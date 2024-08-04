import mysql from "mysql2/promise";
import { db_setting } from "../_config/config";

export default class SQLFunc {
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

  protected e(input: string) {
    if (!this.con) throw new Error("CONNECTION_NOT_ESTABLISHED");
    return this.con.escape(input);
  }

  protected num(input: string | number) {
    if (!this.con) throw new Error("CONNECTION_NOT_ESTABLISHED");
    return Number(input);
  }
  protected sortBy: "created_at" | "added_at" | string = "created_at";
  protected sortOrd: "desc" | "asc" | "rand" = "desc";
  protected isSortRand: boolean = false;

  public setSort(input: string, seed?: string) {
    const int = decodeURIComponent(input).split(",");
    const by = (int[0] || "created_at").toLowerCase();
    const ord = (int[1] || "desc").toLowerCase();
    if (by === "created_at") {
      this.sortBy = "created_at";
    } else if (by === "added_at") {
      this.sortBy = "added_at";
    } else if (by === "explicit") {
      this.sortBy = "explicit";
    } else {
      this.sortBy = "created_at";
    }
    if (ord === "desc") {
      this.sortOrd = "desc";
    } else {
      this.sortOrd = "asc";
    }
    if (ord === "rand") {
      this.isSortRand = true;
      this.sortBy =
        "RAND(" + Number(seed || Math.floor(Math.random() * 10110011)) + ")";
    }
  }

  protected orderBy() {
    return `ORDER BY ${
      this.sortBy === "added_at" || this.sortBy === "created_at" ? "t." : ""
    }${this.sortBy} ${this.sortOrd}`;
  }
}
