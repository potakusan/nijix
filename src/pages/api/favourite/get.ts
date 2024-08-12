import {
  checkHTTPRequests,
  makeError,
  makeSuccess,
} from "@/backend/validator/httpRequests";
import { SearchImageResult } from "@/types/api/search/images";
import type { NextApiRequest, NextApiResponse } from "next";
import { CommonQueries } from "@/types/api/common/inputs";
import { FavouriteEditor } from "@/backend/sql/favourite";
import { IndividualImageRequestFormatter } from "@/backend/requests/individualImageRequest";

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
  const i = await new FavouriteEditor().connect();

  const { success, inputs } = IndividualImageRequestFormatter(
    req.query as CommonQueries
  );
  if (!success || !inputs) {
    return res.status(403).json(makeError("VALIDATION ERROR", []));
  }
  try {
    const response = await i.setId(inputs.id).get();
    i.destroy();
    if (response) {
      return res.status(200).json(makeSuccess(JSON.parse(response)));
    } else {
      return res.status(500).json(makeError("RESPONSE DATA IS NULL", []));
    }
  } catch (e) {
    i.destroy();
    return res.status(500).json(makeError("RESPONSE DATA IS NULL", []));
  }
}
