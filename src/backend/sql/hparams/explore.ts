import { TagExplorerResultSet } from "@/types/api/tags/explore";
import SQLFuncWrapper from "..";
import { HParamExplorerResultSet } from "@/types/api/hparams";

export class HParamsExplorer extends SQLFuncWrapper {
  protected favs: string[] | null = null;
  setFavs = (input: string[]) => (this.favs = input);

  async get() {
    if (!this.con) return [];

    const [tags_includes, nouns_includes] = this.makeTags(
      this.tags,
      this.nouns
    );

    let conditions: string[] = [];
    let joins: string[] = ["FROM images i"];
    if (this.favs && this.favs.length > 0) {
      conditions.push(`
        i.id IN (${this.favs
          .reduce((res: string[], item) => {
            if (!res) res = [];
            res.push(this.e(item));
            return res;
          }, [])
          .join(",")})
      `);
    }

    joins.push("JOIN sd_ratings sr ON i.id = sr.id");
    // Author and date conditions
    const needsTweetsJoin =
      this.authorId !== null ||
      (this.sinceDate && this.untilDate) ||
      this.aiMode < 2;
    if (needsTweetsJoin) {
      joins.push("JOIN tweets tw ON i.id = tw.id");
      if (this.aiMode === 0) {
        conditions.push(`tw.ai = 0`);
      } else if (this.aiMode === 1) {
        conditions.push(`tw.ai = 1`);
      }
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
        SELECT DISTINCT i.id,sr.general,sr.sensitive,sr.questionable,sr.explicit
        ${joins.join(" ")}
        ${whereClause}
      )
      SELECT
        SUM(CASE WHEN fi.general > fi.sensitive AND fi.general > fi.questionable AND fi.general > fi.explicit THEN 1 ELSE 0 END) AS generalCount,
        SUM(CASE WHEN fi.sensitive > fi.general AND fi.sensitive > fi.questionable AND fi.sensitive > fi.explicit THEN 1 ELSE 0 END) AS sensitiveCount,
        SUM(CASE WHEN fi.questionable > fi.general AND fi.questionable > fi.sensitive AND fi.questionable > explicit THEN 1 ELSE 0 END) AS questionableCount,
        SUM(CASE WHEN fi.explicit > fi.general AND fi.explicit > fi.sensitive AND fi.explicit > fi.questionable THEN 1 ELSE 0 END) AS explicitCount
      FROM filtered_images fi
    `;
    const [rows, _fields] = await this.con.execute<HParamExplorerResultSet[]>(
      query
    );
    return rows.length > 0
      ? rows[0]
      : {
          generalCount: 0,
          sensitiveCount: 0,
          questionableCount: 0,
          explicitCount: 0,
        };
  }
}
