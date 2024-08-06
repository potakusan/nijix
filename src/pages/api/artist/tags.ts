import { IndivisualImageRequestFormatter } from "@/backend/requests/indivisualImageRequest";
import { IndivisualArtistAPI } from "@/backend/sql/artist";
import {
  checkHTTPRequests,
  makeError,
  makeSuccess,
} from "@/backend/validator/httpRequests";
import { CommonQueries } from "@/types/api/common/inputs";
import { SDResponseType } from "@/types/api/image/sd";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SDResponseType>
) {
  const { isValidReuest, requestErrorMessage } = checkHTTPRequests(req, "get");
  if (!isValidReuest) {
    return res.status(403).json(makeError(requestErrorMessage, 0));
  }
  const i = await new IndivisualArtistAPI().connect();

  const { success, inputs } = IndivisualImageRequestFormatter(
    req.query as CommonQueries
  );
  if (!success || !inputs) {
    return res.status(403).json(makeError("VALIDATION ERROR", 0));
  }
  i.setAuthorId(inputs.id);

  i.destroy();
  return res.status(200).json(makeSuccess({}));
}
