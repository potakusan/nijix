import { ImageResultSet } from "@/types/api/search/images";
import { IllustAPI } from "../search/images";

export class IllustMetaAPI extends IllustAPI {
  setOverrideCols = () => (this.cols = ["COUNT(t.id) AS sum"]);
  makeConditions = () => {
    this.mkCommons();
    this.setOverrideCols();
  };
}
