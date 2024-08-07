import { HParams } from "../search/images";

export interface CommonSearchRequestInputs {
  tags: string[] | null;
  nouns: string[] | null;
  limit: number;
  offset: number;
  authorId: string | null;
  aiMode: number;
  sinceDate: string | null;
  untilDate: string | null;
  hParams: HParams[] | null;
  sort: string;
  seed: string;
  view: "tags" | "nouns";
}

export interface CommonIndividualImageRequestInputs {
  id: string;
}

export interface CommonQueries {
  [key: string]: string;
}
