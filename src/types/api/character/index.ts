import { RowDataPacket } from "mysql2";

export type CharacterTypeResult = {
  error: boolean;
  errorMessage?: string;
  body: CharacterType[];
};

export interface CharacterType extends RowDataPacket {
  tag: string;
  groupCount: number;
  noun: string;
  nounCount: number;
}
