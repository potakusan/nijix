import { RowDataPacket } from "mysql2";

export type TagExplorerResult = {
  error: boolean;
  errorMessage?: string;
  body: TagExplorerResultSet[];
};

export interface TagExplorerResultSet extends RowDataPacket {
  num: number;
  tag: string;
}
[];
