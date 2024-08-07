import { SearchRequestFormatter } from "@/backend/requests/searchRequest";
import { IllustMetaAPI } from "@/backend/sql/meta/images";
import {
  checkHTTPRequests,
  makeError,
  makeSuccess,
} from "@/backend/validator/httpRequests";
import { CommonQueries } from "@/types/api/common/inputs";
import { MetaImageResult } from "@/types/api/meta/images";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MetaImageResult>
) {
  const { isValidReuest, requestErrorMessage } = checkHTTPRequests(req, "get");
  if (!isValidReuest) {
    return res.status(403).json(makeError(requestErrorMessage, 0));
  }
  const i = await new IllustMetaAPI().connect();

  const { success, inputs } = SearchRequestFormatter(
    req.query as CommonQueries
  );
  if (!success || !inputs) {
    return res.status(403).json(makeError("VALIDATION ERROR", 0));
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

  const response = await i.execMethod();
  i.destroy();
  if (response) {
    return res.status(200).json(makeSuccess(response[0].sum));
  } else {
    return res.status(500).json(makeError("REPONSE DATA IS NULL", 0));
  }
}
