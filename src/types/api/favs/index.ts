export type FavContentType = {
  id: string;
  added_at: number;
};

export type SharedFavType = {
  id: string;
  ids: string;
  added_at: string;
};

export type SharedFavResultType = {
  error: boolean;
  errorMessage?: string;
  body: SharedFavType[];
};
