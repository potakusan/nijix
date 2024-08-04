import { RowDataPacket } from "mysql2";

export type MetaImageResult = {
  error: boolean;
  errorMessage?: string;
  body: number;
};

export interface MetaImageResultSet extends RowDataPacket {
  [key: string]: any;
}
[];
