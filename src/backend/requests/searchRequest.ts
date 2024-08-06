import { NextApiRequest } from "next";
import { validateDates } from "../validator/search/illustDates";
import { CommonSearchRequestInputs } from "@/types/api/common/inputs";
import dayjs from "dayjs";

export const SearchRequestFormatter = (queries: {
  [key: string]: string;
}): {
  success: boolean;
  inputs?: CommonSearchRequestInputs;
} => {
  const inputs: CommonSearchRequestInputs = {
    tags: [],
    nouns: [],
    limit: 0,
    offset: 0,
    authorId: null,
    aiMode: 0,
    sinceDate: null,
    untilDate: null,
    hParams: [0, 100],
    seed: "",
    sort: "",
    view: "tags",
  };

  inputs.tags = queries.tags ? queries.tags.split(",") : [];
  if (queries.tags === "_") inputs.tags = [];
  inputs.nouns = queries.nouns ? queries.nouns.split(",") : [];
  if (queries.nouns === "_") inputs.nouns = [];

  inputs.limit = Number(queries.limit) || 20;
  inputs.offset = Number(queries.offset || "0") || 0;
  inputs.authorId = queries.authorId || null;
  inputs.aiMode = Number(queries.aiMode) || 2;
  inputs.view = String(queries.view) === "nouns" ? "nouns" : "tags";

  if (
    queries.sinceDate &&
    queries.untilDate &&
    !validateDates(queries.sinceDate as string, queries.untilDate as string)
  ) {
    return { success: false };
  }

  if (queries.sinceDate) {
    inputs.sinceDate = (
      queries.sinceDate
        ? dayjs(queries.sinceDate)
        : dayjs().subtract(100, "year")
    ).format("YYYY-MM-DD");
  } else {
    inputs.sinceDate = null;
  }
  if (queries.untilDate) {
    inputs.untilDate = (
      queries.untilDate ? dayjs(queries.untilDate) : dayjs()
    ).format("YYYY-MM-DD");
  } else {
    inputs.untilDate = null;
  }

  inputs.seed = queries.seed || "";
  inputs.sort = queries.sort || "created_at,desc";

  const hparam = (queries.hParams || "0,100").split(",") || ["0", "100"];
  inputs.hParams = [Number(hparam[0]), Number(hparam[1])];

  return { success: true, inputs: inputs };
};
