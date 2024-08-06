import { RowDataPacket } from "mysql2";

export type SDResponseType = {
  error: boolean;
  errorMessage?: string;
  body: {
    tags: SDTagsType[];
    ratings: SDRatingsType;
  };
};

export interface SDRatingsType extends RowDataPacket {
  id: string;
  general: number;
  sensitive: number;
  questionable: number;
  explicit: number;
  media_key: string;
}

export interface SDTagsType extends RowDataPacket {
  title: string;
  point: number;
}
