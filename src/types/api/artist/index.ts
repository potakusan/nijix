import { RowDataPacket } from "mysql2";

export type ArtistMetaResultType = {
  error: boolean;
  errorMessage?: string;
  body: ArtistMetaResultSet[];
};

export interface ArtistMetaResultSet extends RowDataPacket {
  author_id: string;
  username: string;
  description: string;
  profile_image_url: string;
  updated_at: string;
  source: string;
  id: string;
  url: string;
  backup_saved_url: string;
  px_thumb?: string;
}
