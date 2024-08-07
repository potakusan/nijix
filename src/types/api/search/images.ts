import { RowDataPacket } from "mysql2";

export type SearchImageResult = {
  error: boolean;
  errorMessage?: string;
  body: ImageResultSet[];
};

export interface ImageSdRatings {
  general?: string;
  sensitive?: string;
  questionable?: string;
  explicit?: string;
}

export interface ImageUrlSet {
  url: string;
  media_key?: string;
  type?: string;
  md5?: string;
  status?: string;
  backup_saved_url?: string;
  px_thumb?: string;
}

export interface ImageResultSet
  extends RowDataPacket,
    ImageSdRatings,
    ImageUrlSet {
  id: string;
  text: string;
  created_at: string;
  added_at: string;
  text_lower: string;
  has_images: number;
  author_id: string;
  username: string;
  description: string;
  profile_image_url: string;
  updated_at: string;
  source: string;
}

export interface TagStringSet extends RowDataPacket {
  tag: string[];
}

export type HParams = "general" | "sensitive" | "questionable" | "explicit";
