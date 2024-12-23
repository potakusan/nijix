import { ArtistMetaResultSet } from "@/types/api/artist";
import SQLFuncWrapper from "..";
import { CharacterType } from "@/types/api/character";

export class CharacterAPI extends SQLFuncWrapper {
  async execMethod() {
    if (!this.con) return [];
    const [rows, _fields] = await this.con.execute<CharacterType[]>(`
      WITH BaseData AS (
    SELECT tg.tag AS tag, ng.tag AS noun, COUNT(ng.tag) AS nounCount
    FROM tags tg
    JOIN noun_tags ng ON tg.id = ng.id
    JOIN noun_types nt ON nt.tag = ng.tag AND nt.type = "character"
    WHERE tg.tag <> "aiイラスト"
    GROUP BY tg.tag, ng.tag
),
MaxNounCounts AS (
    SELECT noun, MAX(nounCount) AS maxNounCount
    FROM BaseData
    GROUP BY noun
),
FilteredData AS (
    SELECT bd.tag, bd.noun, bd.nounCount
    FROM BaseData bd
    JOIN MaxNounCounts mnc ON bd.noun = mnc.noun AND bd.nounCount = mnc.maxNounCount
),
GroupCounts AS (
    SELECT tag, COUNT(*) AS groupCount
    FROM tags
    GROUP BY tag
)
SELECT fd.tag, gc.groupCount, fd.noun, fd.nounCount
FROM FilteredData fd
JOIN GroupCounts gc ON fd.tag = gc.tag
ORDER BY gc.groupCount DESC, fd.nounCount DESC;

    `);
    return rows;
  }
}
