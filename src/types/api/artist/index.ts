import { RowDataPacket } from "mysql2";
import { ImageResultSet } from "../search/images";

export type ArtistMetaResultType1 = {
  error: boolean;
  errorMessage?: string;
  body: ArtistMetaResultSet;
};

export type ArtistMetaResultType = {
  error: boolean;
  errorMessage?: string;
  body: { m: ArtistMetaResultSet[]; r: ImageResultSet[] };
};

export interface ArtistMetaResultSet extends RowDataPacket {
  author_id: string;
  username: string;
  description: string;
  profile_image_url: string;
  updated_at: string;
  source: string;
  id?: string;
  url?: string;
  backup_saved_url?: string;
  px_thumb?: string;
  tweetCount?: number;
  text: string;
}
