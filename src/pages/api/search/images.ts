import { IllustAPI } from "@/backend/sql/search/images";
import {
  checkHTTPRequests,
  makeError,
  makeSuccess,
} from "@/backend/validator/httpRequests";
import { SearchImageResult } from "@/types/api/search/images";
import type { NextApiRequest, NextApiResponse } from "next";
import { RequestFormatter } from "@/backend/requests/formatter";
import { CommonQueries } from "@/types/api/common/inputs";

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

  const { success, inputs } = RequestFormatter(req.query as CommonQueries);
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
  i.setHParams(inputs.hParams[0], inputs.hParams[1]);
  i.setSort(inputs.sort, inputs.seed);
  i.setAiMode(inputs.aiMode);

  const response = await i.execMethod();
  i.destroy();
  if (response) {
    return res.status(200).json(makeSuccess(response));
  } else {
    return res.status(500).json(makeError("RESPONSE DATA IS NULL", []));
  }
}
