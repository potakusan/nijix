import { ArtistMetaResultSet } from "@/types/api/artist";
import SQLFuncWrapper from "..";

export class FavouriteEditor extends SQLFuncWrapper {
  private id: string | null = null;
  setId(input: string) {
    this.id = input;
    return this;
  }

  async put(ids: string[]) {
    if (!this.con) return null;
    if (!this.id) return null;
    const query = `
      INSERT INTO shares (id,ids,added_at) VALUES (${this.e(this.id)},?,NOW())
    `;
    const [rows, _fields] = await this.con.execute(query, [
      JSON.stringify(ids),
    ]);
    return rows;
  }

  async isExists(ids: string[]): Promise<null | string> {
    if (!this.con) return null;
    if (!ids) return null;
    const query = `
      SELECT * FROM shares WHERE ids = ?
    `;
    const [rows, _fields] = await this.con.execute<any>(query, [
      JSON.stringify(ids),
    ]);
    return rows.length > 0 ? rows[0]["id"] : null;
  }

  async get() {
    if (!this.con) return "[]";
    if (!this.id) return "[]";
    const query = `
      SELECT * FROM shares WHERE id = ?
    `;
    const [rows, _fields] = await this.con.execute<any>(query, [this.id]);
    return rows.length > 0 ? rows[0]["ids"] : "[]";
  }
}
