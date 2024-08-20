import { ArtistMetaResultSet } from "@/types/api/artist";
import SQLFuncWrapper from "..";
import { CharacterType } from "@/types/api/character";

export class CharacterAPI extends SQLFuncWrapper {
  async execMethod() {
    if (!this.con) return [];
    const [rows, _fields] = await this.con.execute<CharacterType[]>(`
      SELECT X.tag,Y.groupCount,noun,COUNT(noun) AS nounCount FROM (
	      SELECT tg.id,tg.tag AS tag,ng.tag AS noun FROM tags tg
	      JOIN noun_tags ng ON tg.id = ng.id
	      JOIN noun_types nt ON nt.tag = ng.tag AND nt.type = "character"
      ) AS X
      JOIN (
	      SELECT tag,COUNT(tag) AS groupCount FROM tags GROUP BY tag
      ) Y ON Y.tag = X.tag
      WHERE X.tag <> "aiイラスト" 
      GROUP BY tag,noun
      ORDER BY groupCount DESC, nounCount DESC
    `);
    return rows;
  }
}
