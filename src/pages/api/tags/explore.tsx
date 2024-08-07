// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { TagExplorer } from "@/backend/sql/tags/explore";
import {
  checkHTTPRequests,
  makeError,
  makeSuccess,
} from "@/backend/validator/httpRequests";
import { CommonQueries } from "@/types/api/common/inputs";
import { TagExplorerResult } from "@/types/api/tags/explore";
import { SearchRequestFormatter } from "@/backend/requests/searchRequest";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TagExplorerResult>
) {
  const { isValidReuest, requestErrorMessage } = checkHTTPRequests(req, "get");
  if (!isValidReuest) {
    return res.status(403).json(makeError(requestErrorMessage, []));
  }
  const i = await new TagExplorer().connect();

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

  i.setView(inputs.view);
  i.setOffset(inputs.offset);
  i.setLimit(inputs.limit);
  i.setAuthorId(inputs.authorId);
  i.setSinceDate(inputs.sinceDate);
  i.setUntilDate(inputs.untilDate);
  i.setHParams(inputs.hParams);
  i.setAiMode(inputs.aiMode);

  const response = await i.get();
  i.destroy();
  if (response) {
    return res.status(200).json(makeSuccess(response));
  } else {
    return res.status(500).json(makeError("RESPONSE DATA IS NULL", []));
  }
}
