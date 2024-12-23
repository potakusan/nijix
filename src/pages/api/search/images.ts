import { IllustAPI } from "@/backend/sql/search/images";
import {
  checkHTTPRequests,
  makeError,
  makeSuccess,
} from "@/backend/validator/httpRequests";
import { SearchImageResult } from "@/types/api/search/images";
import type { NextApiRequest, NextApiResponse } from "next";
import { CommonQueries } from "@/types/api/common/inputs";
import { SearchRequestFormatter } from "@/backend/requests/searchRequest";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchImageResult>
) {
  const { isValidReuest, requestErrorMessage } = checkHTTPRequests(req, "get");
  if (!isValidReuest) {
    return res
      .status(403)
      .json({ error: true, errorMessage: requestErrorMessage, body: [] });
  }
  const i = await new IllustAPI().connect();

  const { success, inputs } = SearchRequestFormatter(
    req.query as CommonQueries
  );
  if (!success || !inputs) {
    return res.status(403).json(makeError("VALIDATION ERROR", []));
  }

  if (!inputs.tags) {
    i.setTags([]);
  } else {
    i.setTags(inputs.tags);
  }

  if (!inputs.nouns) {
    i.setNouns([]);
  } else {
    i.setNouns(inputs.nouns);
  }

  i.setOffset(inputs.offset);
  i.setLimit(inputs.limit);
  i.setAuthorId(inputs.authorId);
  i.setSinceDate(inputs.sinceDate);
  i.setUntilDate(inputs.untilDate);
  i.setHParams(inputs.hParams);
  i.setSort(inputs.sort, inputs.seed);
  i.setAiMode(inputs.aiMode);
  i.setIsSlideshow(inputs.isSlideshow);

  if (inputs.favs) {
    i.setFavs(inputs.favs);
  } else if (inputs.sharedIds) {
    const all = await i.getSharedItems(inputs.sharedIds);
    i.setFavs(all);
  }

  if (inputs.sort === "top") {
    i.setRandOffset();
  }

  const response = await i.execMethod();
  i.destroy();
  if (response) {
    return res.status(200).json(makeSuccess(response));
  } else {
    return res.status(500).json(makeError("RESPONSE DATA IS NULL", []));
  }
}
