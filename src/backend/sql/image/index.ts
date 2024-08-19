import { ImageResultSet } from "@/types/api/search/images";
import { SDRatingsType, SDTagsType } from "@/types/api/image/sd";
import { RawTagsType } from "@/types/api/image/tags";
import SQLFuncWrapper from "..";

export class IndividualIllustAPI extends SQLFuncWrapper {
  protected id: string | null = null;
  setId(input: string) {
    this.id = input;
    return this;
  }

  async execMethod() {
    if (!this.con) return [];
    if (!this.id) return [];
    const [rows, _fields] = await this.con.execute<ImageResultSet[]>(`
      SELECT im.*,tw.text,au.username,X.tags,Y.nouns FROM images AS im
      JOIN tweets tw ON im.id = tw.id
      JOIN authors au ON au.author_id = tw.author_id
      LEFT JOIN (SELECT id,GROUP_CONCAT(tag) AS tags FROM tags WHERE id = ${this.e(
        this.id
      )}) AS X ON X.id = im.id
      LEFT JOIN (SELECT id,GROUP_CONCAT(tag) AS nouns FROM noun_tags WHERE id = ${this.e(
        this.id
      )}) AS Y ON Y.id = im.id
      WHERE im.id = ${this.e(this.id)}
      ORDER BY increment asc;
    `);
    return rows;
  }

  private getTagsWithCounts(type: "tags" | "noun_tags") {
    if (!this.con) return [];
    if (!this.id) return [];
    return this.con.execute<RawTagsType[]>(`
      SELECT tags.id,tags.tag,tags.reading,counts.count FROM ${type} AS tags
      JOIN (SELECT COUNT(*) AS count,tag FROM ${type} GROUP BY tag) AS counts ON counts.tag = tags.tag
      WHERE id = ${this.e(this.id)};`);
  }

  async getTags() {
    const [rows, _fields] = await this.getTagsWithCounts("tags");
    return rows;
  }

  async getNouns() {
    const [rows, _fields] = await this.getTagsWithCounts("noun_tags");
    return rows;
  }

  async getSD() {
    if (!this.con) return [];
    if (!this.id) return [];
    const [rows, _fields] = await this.con.execute<SDTagsType[]>(`
      SELECT title,point FROM sd_tags AS im
      WHERE im.id = ${this.e(this.id)}
      ORDER BY point asc;
    `);
    return rows;
  }

  async getSDRatings() {
    if (!this.con) return [];
    if (!this.id) return [];
    const [rows, _fields] = await this.con.execute<SDRatingsType[]>(`
      SELECT * FROM sd_ratings AS im
      WHERE im.id = ${this.e(this.id)};
    `);
    return rows;
  }

  async getRelatedImages() {}
}
