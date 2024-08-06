import SQLFuncWrapper from "../../../../_sql";
import { ArtistMetaResultSet } from "@/types/api/artist";

export class IndivisualArtistAPI extends SQLFuncWrapper {
  private id: string | null = null;
  setId(input: string) {
    this.id = input;
    return this;
  }

  async execMethod() {
    if (!this.con) return [];
    if (!this.id) return [];
    const [rows, _fields] = await this.con.execute<ArtistMetaResultSet[]>(`
      SELECT au.*,im.id,im.url FROM authors AS au
      JOIN (SELECT tw.* FROM tweets AS tw WHERE tw.id = ${this.e(
        this.id
      )} LIMIT 1) AS tw1 ON tw1.author_id = au.author_id
      JOIN tweets AS tw ON tw.author_id = au.author_id
      JOIN images AS im ON im.id = tw.id AND im.increment = 1
      LIMIT 10;
    `);
    return rows;
  }
}
