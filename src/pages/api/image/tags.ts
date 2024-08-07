import { IndividualImageRequestFormatter } from "@/backend/requests/individualImageRequest";
import { IndividualIllustAPI } from "@/backend/sql/image";
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
  const i = await new IndividualIllustAPI().connect();

  const { success, inputs } = IndividualImageRequestFormatter(
    req.query as CommonQueries
  );
  if (!success || !inputs) {
    return res.status(403).json(makeError("VALIDATION ERROR", 0));
  }
  i.setId(inputs.id);

  const tags = await i.getTags();
  const nouns = await i.getNouns();
  i.destroy();
  return res.status(200).json(
    makeSuccess({
      tags: tags,
      nouns: nouns,
    })
  );
}
