import { ImageResultSet } from "@/types/api/search/images";
import SQLFuncWrapper from "../../../../_sql";
import { ConditionInputs } from "@/types/api/meta/images";

export class IndivisualIllustAPI extends SQLFuncWrapper {
  private id: string | null = null;
  setId(input: string) {
    this.id = input;
    return this;
  }

  async execMethod() {
    if (!this.con) return [];
    if (!this.id) return [];
    const [rows, _fields] = await this.con.execute<ImageResultSet[]>(`
      SELECT * FROM images AS im
      WHERE im.id = ${this.e(this.id)}
      ORDER BY increment asc;
    `);
    return rows;
  }
}
