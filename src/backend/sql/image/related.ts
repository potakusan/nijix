import { ImageResultSet, TagStringSet } from "@/types/api/search/images";
import { IndividualIllustAPI } from ".";
import { TagWithIdResultSet } from "@/types/api/tags/explore";

export class IndividualRelatedIllustAPI extends IndividualIllustAPI {
  intersections = (arrays: string[][]) => {
    return arrays.reduce((a, b) => a.filter((c) => b.includes(c)));
  };
  unions = (arrays: string[][]) => {
    let res = new Set<string>();
    arrays.forEach((array) => array.forEach((item) => res.add(item)));
    return Array.from(res);
  };

  reduceTags = (input: TagStringSet[] | { tag: string }[]) =>
    input.reduce((group: string[], item: any) => {
      if (!group) group = [];
      group.push(item.tag);
      return group;
    }, []);

  async getSelfNouns() {
    if (!this.con) return [];
    if (!this.id) return [];
    const [rows, _fields] = await this.con.execute<TagStringSet[]>(
      `SELECT tag FROM noun_tags WHERE id = ${this.e(this.id)}`
    );
    return rows;
  }

  async getNounsOfItems() {
    if (!this.con) return {};
    if (!this.id) return {};

    const query = `SELECT tweets.id,noun_tags.tag FROM tweets
    JOIN noun_tags ON noun_tags.id = tweets.id
    WHERE tweets.id IN (
      SELECT id FROM tags WHERE tag IN (SELECT tag FROM tags WHERE id = ${this.e(
        this.id
      )}))`;
    const [rows, _fields] = await this.con.execute<TagWithIdResultSet[]>(query);
    return rows.reduce((group: { [key: string]: string[] }, item) => {
      if (!group) group = {};
      if (!group[item.id]) {
        group[item.id] = [item.tag];
      } else {
        group[item.id].push(item.tag);
      }
      return group;
    }, {});
  }

  async getDataSet(ids: string[]) {
    if (!this.con) return {};

    const query = `SELECT 
    ${this.cols.join(",")}
    FROM tweets AS t
    JOIN images ON t.id = images.id AND images.increment = 1
    JOIN authors ON t.author_id = authors.author_id
    WHERE t.id IN (${ids
      .reduce((group: string[], item) => {
        if (!group) group = [];
        group.push(this.e(item));
        return group;
      }, [])
      .join(",")})`;
    const [rows, _fields] = await this.con.execute<ImageResultSet[]>(query);
    return rows;
  }
}
