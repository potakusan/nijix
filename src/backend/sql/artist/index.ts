import { ArtistMetaResultSet } from "@/types/api/artist";
import SQLFuncWrapper from "..";

export class IndividualArtistAPI extends SQLFuncWrapper {
  private id: string | null = null;
  setId(input: string) {
    this.id = input;
    return this;
  }

  async execMethod() {
    if (!this.con) return [];
    if (!this.id) return [];
    const [rows, _fields] = await this.con.execute<ArtistMetaResultSet[]>(`
      SELECT au.*,im.id,im.url,im.backup_saved_url,im.px_thumb,tw.text
      FROM authors AS au
      JOIN (SELECT tw.* FROM tweets AS tw WHERE tw.id = ${this.e(
        this.id
      )} LIMIT 1) AS tw1 ON tw1.author_id = au.author_id
      JOIN tweets AS tw ON tw.author_id = au.author_id
      JOIN images AS im ON im.id = tw.id AND im.increment = 1 LIMIT 100;
    `);
    return rows;
  }

  async getMeta() {
    if (!this.con) return null;
    if (!this.authorId) return null;
    const query = `SELECT authors.*,tweetCount FROM authors
    JOIN (SELECT author_id,COUNT(*) AS tweetCount FROM tweets
      WHERE author_id = ${this.e(
        this.authorId
      )} GROUP BY author_id) tw ON authors.author_id = tw.author_id
    WHERE authors.author_id = ${this.e(this.authorId)}`;
    const [rows, _fields] = await this.con.execute<ArtistMetaResultSet[]>(
      query
    );
    return rows.length === 0 ? null : rows[0];
  }
}
