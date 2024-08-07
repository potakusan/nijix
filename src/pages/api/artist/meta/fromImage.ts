import { IndividualImageRequestFormatter } from "@/backend/requests/individualImageRequest";
import { IndividualArtistAPI } from "@/backend/sql/artist";
import {
  checkHTTPRequests,
  makeError,
  makeSuccess,
} from "@/backend/validator/httpRequests";
import { ArtistMetaResultType } from "@/types/api/artist";
import { CommonQueries } from "@/types/api/common/inputs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ArtistMetaResultType>
) {
  const { isValidReuest, requestErrorMessage } = checkHTTPRequests(req, "get");
  if (!isValidReuest) {
    return res.status(403).json(makeError(requestErrorMessage, 0));
  }
  const i = await new IndividualArtistAPI().connect();

  const { success, inputs } = IndividualImageRequestFormatter(
    req.query as CommonQueries
  );
  if (!success || !inputs) {
    return res.status(403).json(makeError("VALIDATION ERROR", 0));
  }

  const response = await i.setId(inputs.id).execMethod();
  i.destroy();
  if (response) {
    return res.status(200).json(makeSuccess(response));
  } else {
    return res.status(500).json(makeError("REPONSE DATA IS NULL", 0));
  }
}
