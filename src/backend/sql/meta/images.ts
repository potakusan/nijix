import { ImageResultSet } from "@/types/api/search/images";
import { IllustAPI } from "../search/images";
import { ConditionInputs } from "@/types/api/meta/images";

export class IllustMetaAPI extends IllustAPI {
  setOverrideCols = () => (this.cols = ["COUNT(t.id) AS sum"]);
  makeConditions = (input: ConditionInputs) => {
    if (input.cols) {
      this.cols = this.cols.concat(input.cols);
    }
    if (input.wheres) {
      this.wheres = this.wheres.concat(input.wheres);
    }
    if (input.joins) {
      this.joins = this.joins.concat(input.joins);
    }
    this.mkCommons();
    this.setOverrideCols();
  };
}
