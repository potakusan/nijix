export type IndividualIllustType = {
  error: boolean;
  errorMessage?: string;
  body: { main: ImageListResultSet[]; additional: ImageListResultSet[] };
};

export type ImageListResultSet = {
  id: string;
  media_key: string;
  width: string;
  height: string;
  url: string;
  type: string;
  added_at: string;
  md5: string;
  status: number;
  status_checked_at: string;
  backup_saved_url: string;
  px_thumb: string | null;
  increment: number;
  text: string;
};
