import { IndivisualImageRequestFormatter } from "@/backend/requests/indivisualImageRequest";
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

  const { success, inputs } = IndivisualImageRequestFormatter(
    req.query as CommonQueries
  );
  if (!success || !inputs) {
    return res.status(403).json(makeError("VALIDATION ERROR", 0));
  }
  i.setId(inputs.id);

  const tags = await i.getSD();
  const ratings = await i.getSDRatings();
  i.destroy();
  if (tags && ratings) {
    return res.status(200).json(
      makeSuccess({
        tags: tags,
        ratings:
          ratings.length > 0
            ? ratings[0]
            : {
                id: inputs.id,
                general: 0,
                sensitive: 0,
                questionable: 0,
                explicit: 0,
                media_key: "",
              },
      })
    );
  } else {
    return res.status(500).json(makeError("REPONSE DATA IS NULL", 0));
  }
}
