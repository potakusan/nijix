import { RowDataPacket } from "mysql2";

export type SearchImageResult = {
  error: boolean;
  errorMessage?: string;
  body: ImageResultSet[];
};

export interface ImageResultSet extends RowDataPacket {
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
  general?: string;
  sensitive?: string;
  questionable?: string;
  explicit?: string;
}
