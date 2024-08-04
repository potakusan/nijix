export interface CommonRequestInputs {
  tags: string[] | null;
  nouns: string[] | null;
  limit: number;
  offset: number;
  authorId: string | null;
  aiMode: number;
  sinceDate: string | null;
  untilDate: string | null;
  hParams: [number, number];
  sort: string;
  seed: string;
  view: "tags" | "nouns";
}

export interface CommonQueries {
  [key: string]: string;
}
