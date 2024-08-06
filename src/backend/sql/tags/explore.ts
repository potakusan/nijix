import { TagExplorerResultSet } from "@/types/api/tags/explore";
import SQLFuncWrapper from "../../../../_sql";

export class TagExplorer extends SQLFuncWrapper {
  async get() {
    if (!this.con) return [];

    const [tags_includes, nouns_includes] = this.makeTags(
      this.tags,
      this.nouns
    );

    let conditions: string[] = [];
    let joins: string[] = ["FROM images i"];

    // SD ratings condition
    if (this.isHParamsChanged()) {
      joins.push("JOIN sd_ratings sr ON i.id = sr.id");
      conditions.push(
        `sr.explicit BETWEEN ${this.con.escape(
          this.hparams[0] / 100
        )} AND ${this.con.escape(this.hparams[1] / 100)}`
      );
    }

    // Author and date conditions
    const needsTweetsJoin =
      this.authorId !== null || (this.sinceDate && this.untilDate);
    if (needsTweetsJoin) {
      joins.push("JOIN tweets tw ON i.id = tw.id");
      if (this.authorId !== null) {
        conditions.push(`tw.author_id = ${this.con.escape(this.authorId)}`);
      }
      if (this.sinceDate && this.untilDate) {
        conditions.push(
          `tw.created_at BETWEEN ${this.con.escape(
            this.sinceDate
          )} AND ${this.con.escape(this.untilDate)}`
        );
      }
    }

    // Tags includes
    tags_includes.forEach((tag) => {
      if (this.con) {
        conditions.push(
          `EXISTS (SELECT 1 FROM tags t WHERE t.id = i.id AND t.tag = ${this.con.escape(
            tag
          )})`
        );
      }
    });

    // Nouns includes
    nouns_includes.forEach((noun) => {
      if (this.con) {
        conditions.push(
          `EXISTS (SELECT 1 FROM noun_tags nt WHERE nt.id = i.id AND nt.tag = ${this.con.escape(
            noun
          )})`
        );
      }
    });

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      WITH filtered_images AS (
        SELECT DISTINCT i.id
        ${joins.join(" ")}
        ${whereClause}
      )
      SELECT COUNT(*) AS num, t.tag
      FROM filtered_images fi
      JOIN ${this.view === "tags" ? "tags" : "noun_tags"} t ON fi.id = t.id
      GROUP BY t.tag
      ORDER BY num DESC
      LIMIT ${Number(this.limit)} OFFSET ${Number(this.offset)}
    `;
    const [rows, _fields] = await this.con.execute<TagExplorerResultSet[]>(
      query
    );
    return rows;
  }
}