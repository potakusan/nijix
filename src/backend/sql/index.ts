import mysql from "mysql2/promise";
import { db_setting } from "../../../_config/config";
import { HParams } from "@/types/api/search/images";

class SQLFunc {
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

  protected makeTags = (_tags: string[], _nouns: string[]) => {
    const tags = [];
    const nouns = [];
    for (let i = 0; i < _tags.length; ++i) {
      if (_tags[i] === "_") continue;
      tags.push(_tags[i]);
    }
    for (let i = 0; i < _nouns.length; ++i) {
      if (_nouns[i] === "_") continue;
      nouns.push(_nouns[i]);
    }
    return [tags, nouns];
  };
}

export default class SQLFuncWrapper extends SQLFunc {
  protected cols: string[] = [
    "t.id",
    "t.text",
    "t.created_at",
    "t.added_at",
    "t.text_lower",
    "t.has_images",
    "t.ai",
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

  protected tags: string[] = [];
  protected nouns: string[] = [];

  setTags = (str: string[]) => (this.tags = str);
  setNouns = (str: string[]) => (this.nouns = str);

  protected limit: number = 20;
  protected offset: number = 0;

  setLimit = (lim: number) => (this.limit = lim);
  setOffset = (off: number) => (this.offset = off);

  protected authorId: string | null = null;

  setAuthorId = (authorId: string | null) => (this.authorId = authorId);

  protected view: "tags" | "nouns" = "tags";

  setView = (input: "tags" | "nouns") => (this.view = input);

  protected sinceDate: null | string = null;
  protected untilDate: null | string = null;

  setSinceDate = (date: string | null) => (this.sinceDate = date);
  setUntilDate = (date: string | null) => (this.untilDate = date);

  protected hparams: HParams[] | null = null;

  isHParamsChanged = () =>
    this.hparams !== null ||
    !(
      this.hparams &&
      (["general", "sensitive", "questionable", "explicit"] as HParams[]).every(
        (v) => (this.hparams as HParams[]).includes(v)
      )
    );

  setHParams = (inputs: HParams[] | null) => (this.hparams = inputs);

  protected aiMode: 0 | 1 | 2 = 2;
  setAiMode = (aimode = 2) => {
    switch (aimode) {
      case 0:
      case 1:
      case 2:
        this.aiMode = aimode;
        break;
      default:
        this.aiMode = 2;
        break;
    }
  };
}
