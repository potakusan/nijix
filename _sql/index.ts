import mysql from "mysql2/promise";
import { db_setting } from "../_config/config";

export default class X {
  con: mysql.Connection | null = null;

  async connect(): Promise<this> {
    this.con = await mysql.createConnection(db_setting);
    return this;
  }

  public destroy() {
    return this.con?.destroy();
  }

  protected response(
    data:
      | mysql.OkPacket
      | mysql.RowDataPacket[]
      | mysql.RowDataPacket[][]
      | mysql.OkPacket[]
      | mysql.ResultSetHeader,
    keepConnected: boolean = false
  ) {
    if (!Array.isArray(data)) return [];
    if (!keepConnected) this.con?.destroy();
    return data;
  }
}
