import { RowDataPacket } from "mysql2";

export type HParamExplorerResult = {
  error: boolean;
  errorMessage?: string;
  body: HParamExplorerResultSet;
};

export interface HParamExplorerResultSet extends RowDataPacket {
  generalCount: number;
  sensitiveCount: number;
  questionableCount: number;
  explicitCount: number;
}
