import { RowDataPacket } from "mysql2";

export type TagsResultType = {
  error: boolean;
  errorMessage?: string;
  body: {
    tags: RawTagsType[];
    nouns: RawTagsType[];
  };
};

export interface RawTagsType extends RowDataPacket {
  id: string;
  tag: string;
  added_at?: string;
  reading?: string;
  type?: string;
  count?: number;
}
