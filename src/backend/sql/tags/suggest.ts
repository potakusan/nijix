import { TagSuggesterResultSet } from "@/types/api/tags/explore";
import SQLFuncWrapper from "..";

export class TagSuggester extends SQLFuncWrapper {
  private text: string = "";
  setText = (input: string) => (this.text = input);

  async get() {
    if (!this.con) return [];
    if (!this.text) return [];
    if (!this.con) return [];
    const t = this.e(this.text + "*");
    const q = `
    SELECT LOWER(tag) AS tag, COUNT(tag) AS num, "tag" AS variant
      FROM tags
      WHERE MATCH(tag, reading) AGAINST(${t} IN BOOLEAN MODE)
      GROUP BY tag

    UNION ALL

    SELECT LOWER(tag) AS tag, COUNT(tag) AS num, "noun" AS variant
      FROM noun_tags
      WHERE MATCH(tag, reading) AGAINST(${t} IN BOOLEAN MODE)
      GROUP BY tag

    ORDER BY num DESC;
    `;
    const [rows, _fields] = await this.con.execute<TagSuggesterResultSet[]>(q);
    return rows;
  }
}
