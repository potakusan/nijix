import { ImageResultSet } from "@/types/api/search/images";
import { ConditionInputs } from "@/types/api/meta/images";
import SQLFuncWrapper from "..";
import dayjs from "dayjs";

export class IllustAPI extends SQLFuncWrapper {
  async execMethod() {
    if (!this.con) return;
    let query = this.gen();
    if (
      this.tags.length === 0 &&
      this.nouns.length === 0 &&
      !this.isHParamsChanged()
    ) {
      query = this.withNoConds();
    }
    const [rows, _fields] = await this.con.execute<ImageResultSet[]>(query);
    return rows;
  }

  protected wheres: string[] = [];
  protected joins: string[] = [
    "JOIN authors ON t.author_id = authors.author_id",
    "JOIN images ON t.id = images.id AND images.increment = 1",
  ];

  joinWhereConditions = () =>
    this.wheres.length > 0 ? " WHERE " + this.wheres.join(" AND ") : "";
  joinJoins = () => this.joins.join(" ");
  joinSelectedColumns = () => this.cols.join(",");

  makeConditions = (input: ConditionInputs) => {
    this.mkCommons();
    if (input.cols) {
      this.cols = this.cols.concat(input.cols);
    }
    if (input.wheres) {
      this.wheres = this.wheres.concat(input.wheres);
    }
    if (input.joins) {
      this.joins = this.joins.concat(input.joins);
    }
  };

  setRandOffset() {
    const rand = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;
    const untilDate = dayjs().subtract(rand(0, 400), "day");
    this.sinceDate = untilDate.subtract(1, "y").format("YYYY-MM-DD");
    this.untilDate = untilDate.format("YYYY-MM-DD");
  }

  protected mkCommons() {
    this.mkCondArtist();
    this.mkCondHParams();
    this.mkCondAiMode();
    this.mkCondDate();
  }

  protected mkCondHParams() {
    if (this.isHParamsChanged()) {
      /*
      [min,max]=
      [0,25] : general
      [0,50] : general,sensitive
      [0,75] : general,sensitive,questionable
      [0,100] : general,sensitive,questionable,explicit
      [25,50] : sensitive
      [25,75] : sensitive,questionable
      [25,100] : sensitive,questionable,explicit
      [50,75] : questionable
      [50,100] : questionable,explicit
      [75,100] : explicit

      */
      if (!this.hparams) return;
      let conditions: string[] = [];
      const allColumns = [
        "general",
        "sensitive",
        "questionable",
        "explicit",
      ] as const;

      for (const column of allColumns) {
        if (this.hparams.includes(column)) {
          const others = allColumns.filter((c) => c !== column);
          const condition = others
            .map((other) => `rates.${column} >= rates.${other}`)
            .join(" AND ");
          conditions.push("(" + condition + ")");
        }
      }
      if (conditions.length === 0) return;

      this.wheres.push("(" + conditions.join(" OR ") + ")");
      this.joins.push("JOIN sd_ratings AS rates ON t.id = rates.id");
      this.cols = this.cols.concat([
        "rates.general",
        "rates.sensitive",
        "rates.questionable",
        "rates.explicit",
      ]);
    }
  }

  protected mkCondArtist() {
    if (this.authorId) {
      this.wheres.push(`t.author_id = ${this.e(this.authorId)}`);
    }
  }

  protected mkCondAiMode() {
    switch (this.aiMode) {
      case 0:
        this.wheres.push(`ai = 0`);
        break;
      case 1:
        this.wheres.push(`ai = 1`);
        break;
      case 2:
      default:
        break;
    }
  }

  protected mkCondDate() {
    if (this.sinceDate && this.untilDate) {
      this.wheres.push(
        `t.created_at BETWEEN ${this.e(this.sinceDate)} AND ${this.e(
          this.untilDate
        )}`
      );
    }
  }

  gen() {
    const make = (
      input: string[],
      target: "tags" | "noun_tags",
      alias: string
    ) => {
      let i = 0;
      const res = input.reduce((group: string[], item) => {
        if (!group) group = [];
        if (item === "_") return [];
        group.push(
          `JOIN ${target} AS ${alias}${i} ON ${alias}${i}.id = t.id AND ${alias}${i}.tag = ${this.e(
            item
          )}`
        );
        i++;
        return group;
      }, []);
      return res;
    };
    this.makeConditions({
      joins: make(this.tags, "tags", "X").concat(
        make(this.nouns, "noun_tags", "Y")
      ),
    });
    return this.finallyGenerate();
  }

  withNoConds = () => `
    WITH filtered_tweets AS (
      SELECT t.id, t.text, t.created_at, t.added_at, t.text_lower, t.has_images, t.ai, t.author_id
      FROM tweets t
      ${this.joinWhereConditions()}
      ORDER BY created_at DESC
      LIMIT ${this.num(this.limit)} OFFSET ${this.num(this.offset)}
    )
    SELECT 
        ${this.joinSelectedColumns()}
    FROM filtered_tweets t
    ${this.joinJoins()};`;

  finallyGenerate = () => `
    SELECT 
        ${this.joinSelectedColumns()}
    FROM tweets AS t
    ${this.joinJoins()}
    ${this.joinWhereConditions()}
    ${this.orderBy()}
    LIMIT ${this.num(this.limit)} OFFSET ${this.num(this.offset)};`;
}
