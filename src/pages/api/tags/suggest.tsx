// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  checkHTTPRequests,
  makeError,
  makeSuccess,
} from "@/backend/validator/httpRequests";
import { CommonQueries } from "@/types/api/common/inputs";
import { TagSuggesterResult } from "@/types/api/tags/explore";
import { SearchRequestFormatter } from "@/backend/requests/searchRequest";
import { TagSuggester } from "@/backend/sql/tags/suggest";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TagSuggesterResult>
) {
  const { isValidReuest, requestErrorMessage } = checkHTTPRequests(req, "get");
  if (!isValidReuest) {
    return res.status(403).json(makeError(requestErrorMessage, []));
  }
  const i = await new TagSuggester().connect();

  const { success, inputs } = SearchRequestFormatter(
    req.query as CommonQueries
  );
  if (!success || !inputs) {
    return res.status(403).json(makeError("VALIDATION ERROR", []));
  }

  if (!inputs.text) {
    return res.status(403).json(makeError("TEXT MUST NOT BE EMPTY", []));
  } else {
    i.setText(inputs.text);
  }

  const response = await i.get();
  i.destroy();
  if (response) {
    return res.status(200).json(makeSuccess(response));
  } else {
    return res.status(500).json(makeError("RESPONSE DATA IS NULL", []));
  }
}
