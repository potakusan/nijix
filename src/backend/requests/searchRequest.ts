import { NextApiRequest } from "next";
import { validateDates } from "../validator/search/illustDates";
import { CommonSearchRequestInputs } from "@/types/api/common/inputs";
import dayjs from "dayjs";
import { HParams } from "@/types/api/search/images";

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
    hParams: null,
    seed: "",
    sort: "",
    view: "tags",
    text: "",
    favs: null,
    isSlideshow: false,
    sharedIds: "",
  };

  inputs.tags = queries.tags ? queries.tags.split(",") : [];
  if (queries.tags === "_") inputs.tags = [];
  inputs.nouns = queries.nouns ? queries.nouns.split(",") : [];
  if (queries.nouns === "_") inputs.nouns = [];

  inputs.limit = Number(queries.limit) || 20;
  inputs.offset = Number(queries.offset || "0") || 0;
  inputs.authorId = queries.authorId || null;
  inputs.aiMode = Number(queries.aiMode);
  inputs.view =
    String(queries.view) === "nouns"
      ? "nouns"
      : String(queries.view) === "character"
      ? "character"
      : "tags";

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
  inputs.text = queries.text || "";

  inputs.hParams = validateHParams((queries.hparams || "").split(","));
  if (queries.favs) {
    inputs.favs = queries.favs.split(",");
  }
  if (queries.isSlideshow) {
    inputs.isSlideshow = true;
  }
  if (queries.sharedIds) {
    inputs.sharedIds = queries.sharedIds;
  }

  return { success: true, inputs: inputs };
};

export const validateHParams = (inputs: string[]): HParams[] | null => {
  const acceptables: HParams[] = [
    "general",
    "sensitive",
    "questionable",
    "explicit",
  ];
  const res: HParams[] = [];
  for (let i = 0; i < inputs.length; ++i) {
    if (acceptables.indexOf(inputs[i] as HParams) > -1) {
      res.push(inputs[i] as HParams);
    }
  }
  return res.length > 0 ? res : null;
};
