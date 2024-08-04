import { ImageResultSet } from "@/types/api/search/images";
import SQLFuncWrapper from "../../../../_sql";
import { ConditionInputs } from "@/types/api/meta/images";

export class IllustAPI extends SQLFuncWrapper {
  async execMethod() {
    if (!this.con) return;
    const tlen = this.tags.length;
    const nlen = this.nouns.length;
    let query = "";
    if (tlen === 0) {
      if (nlen === 0) {
        //検索条件なし
        query = this.searchWithNoCondition();
      }
      if (nlen === 1) {
        //tag条件なし、nouns1こだけ
        query = this.searchByOnlyOneTagOrOneNoun("noun_tags");
      }
      if (nlen > 1) {
        //tag条件なし、nouns複数
      }
    }
    if (tlen === 1) {
      if (nlen === 0) {
        //tag1こだけ、nounsなし
        query = this.searchByOnlyOneTagOrOneNoun("tags");
      }
      if (nlen === 1) {
        //tagもnounsも1こだけ
        query = this.searchByBothOfOneTagAndOneNoun();
      }
      if (nlen > 1) {
        //tag1こだけ、nouns複数
      }
    }
    if (tlen === 2) {
      if (nlen === 0) {
        //tag複数、nounsなし
      }
      if (nlen === 1) {
        //tag複数、nouns1こだけ
      }
      if (nlen > 1) {
        //tagもnounsも複数
      }
    }
    const [rows, _fields] = await this.con.execute<ImageResultSet[]>(query);
    return rows;
  }

  protected wheres: string[] = [];
  protected joins: string[] = [
    "JOIN authors ON t.author_id = authors.author_id",
    "JOIN images ON t.id = images.id AND images.increment = 1",
  ];
  protected cols: string[] = [
    "t.id",
    "t.text",
    "t.created_at",
    "t.added_at",
    "t.text_lower",
    "t.has_images",
    "images.media_key",
    "images.url",
    "images.type",
    "images.status",
    "images.backup_saved_url",
    "images.px_thumb",
    "authors.author_id",
    "authors.username",
    "authors.description",
    "authors.profile_image_url",
    "authors.updated_at",
    "authors.source",
  ];

  joinWhereConditions = () =>
    this.wheres.length > 0 ? " WHERE " + this.wheres.join(" AND ") : "";
  joinJoins = () => this.joins.join(" ");
  joinSelectedColumns = () => this.cols.join(",");

  makeConditions = (input: ConditionInputs) => {
    if (input.cols) {
      this.cols = this.cols.concat(input.cols);
    }
    if (input.wheres) {
      this.wheres = this.wheres.concat(input.wheres);
    }
    if (input.joins) {
      this.joins = this.joins.concat(input.joins);
    }
    this.mkCommons();
  };

  protected mkCommons() {
    this.mkCondArtist();
    this.mkCondHParams();
    this.mkCondAiMode();
    this.mkCondDate();
  }

  protected mkCondHParams() {
    if (this.isHParamsChanged()) {
      this.wheres.push(
        `rates.explicit BETWEEN ${this.hparams[0] / 100} AND ${
          this.hparams[1] / 100
        }`
      );
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

  searchWithNoCondition() {
    this.makeConditions({});
    let sqlQuery = `
    SELECT 
        ${this.joinSelectedColumns()}
    FROM tweets AS t
    ${this.joinJoins()}
    ${this.joinWhereConditions()}
    ${this.orderBy()}
    LIMIT ${this.num(this.limit)} OFFSET ${this.num(this.offset)};`;
    return sqlQuery;
  }

  // tags:length1, nouns:length0 OR vice versa
  searchByOnlyOneTagOrOneNoun(target: "noun_tags" | "tags") {
    if (target === "tags" && !this.tags) throw new Error("TAGS_NOT_SPECIFIED");
    if (target === "noun_tags" && !this.nouns)
      throw new Error("NOUNS_NOT_SPECIFIED");
    const tag = target === "tags" ? this.tags[0] : this.nouns[0];

    this.makeConditions({
      wheres: [
        target === "tags"
          ? `tags.tag = ${this.e(tag)}`
          : `noun_tags.tag = ${this.e(tag)}`,
      ],
      joins: [`JOIN ${target} ON t.id = tags.id`],
    });

    let sqlQuery = `
    SELECT 
        ${this.joinSelectedColumns()}
    FROM tweets AS t
    ${this.joinJoins()}
    ${this.joinWhereConditions()}
    ${this.orderBy()}
    LIMIT ${this.num(this.limit)} OFFSET ${this.num(this.offset)};`;
    return sqlQuery;
  }

  // tags:length1, nouns:length1
  searchByBothOfOneTagAndOneNoun() {
    if (!this.tags || this.tags.length === 0)
      throw new Error("TAGS_NOT_SPECIFIED");
    if (!this.nouns || this.tags.length === 0)
      throw new Error("NOUNS_NOT_SPECIFIED");
    const tag = this.tags[0];
    const noun = this.nouns[0];

    this.makeConditions({
      wheres: [`tags.tag = ${this.e(tag)}`, `noun_tags.tag = ${this.e(noun)}`],
      joins: [
        `JOIN tags ON t.id = tags.id`,
        `JOIN noun_tags ON t.id = noun_tags.id`,
      ],
    });

    let sqlQuery = `
    SELECT 
        ${this.joinSelectedColumns()}
    FROM tweets AS t
    ${this.joinJoins()}
    ${this.joinWhereConditions()}
    ${this.orderBy()}
    LIMIT ${this.num(this.limit)} OFFSET ${this.num(this.offset)};`;
    return sqlQuery;
  }
}
