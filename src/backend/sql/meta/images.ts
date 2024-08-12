import { IllustAPI } from "../search/images";
import { ConditionInputs } from "@/types/api/meta/images";

export class IllustMetaAPI extends IllustAPI {
  joins: string[] = [
    "JOIN authors ON t.author_id = authors.author_id",
    "JOIN images ON t.id = images.id  AND images.increment = 1",
  ];

  setOverrideCols = () => (this.cols = ["COUNT(t.id) AS sum"]);
  makeConditions = (input: ConditionInputs) => {
    this.mkCommons();
    if (input.cols) {
      this.cols = this.cols.concat(input.cols);
    }
    if (input.wheres) {
      this.wheres = this.wheres.concat(input.wheres);
    }
    if (input.joins) {
      this.joins = this.joins.concat(input.joins);
    }
    this.setOverrideCols();
  };

  withNoConds = () => `
    WITH filtered_tweets AS (
      SELECT t.id, t.author_id
      FROM tweets t
      ${this.joinWhereConditions()}
    )
    SELECT 
        ${this.joinSelectedColumns()}
    FROM filtered_tweets t
    ${this.joinJoins()};`;
}
