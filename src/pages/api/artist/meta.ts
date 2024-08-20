import { IndividualImageRequestFormatter } from "@/backend/requests/individualImageRequest";
import { SearchRequestFormatter } from "@/backend/requests/searchRequest";
import { IndividualArtistAPI } from "@/backend/sql/artist";
import { IllustMetaAPI } from "@/backend/sql/meta/images";
import {
  checkHTTPRequests,
  makeError,
  makeSuccess,
} from "@/backend/validator/httpRequests";
import { ArtistMetaResultSet } from "@/types/api/artist";
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
  const i = await new IndividualArtistAPI().connect();
  const m = await new IllustMetaAPI().connect();

  const { success, inputs } = SearchRequestFormatter(
    req.query as CommonQueries
  );
  if (!success || !inputs) {
    return res.status(403).json(makeError("VALIDATION ERROR", 0));
  }

  if (!inputs.tags) {
    m.setTags([]);
  } else {
    m.setTags(inputs.tags);
  }

  if (!inputs.nouns) {
    m.setNouns([]);
  } else {
    m.setNouns(inputs.nouns);
  }
  m.setAuthorId(inputs.authorId);
  m.setSinceDate(inputs.sinceDate);
  m.setUntilDate(inputs.untilDate);
  m.setHParams(inputs.hParams);
  m.setAiMode(inputs.aiMode);

  const imageSum = await m.execMethod();

  i.setAuthorId(inputs.authorId);

  const response: ArtistMetaResultSet | null = await i.getMeta();
  i.destroy();
  m.destroy();
  if (response) {
    return res.status(200).json(
      makeSuccess(
        Object.assign(response, {
          tweetCount: imageSum && imageSum.length > 0 ? imageSum[0].sum : 0,
        }) as ArtistMetaResultSet
      )
    );
  } else {
    return res.status(500).json(makeError("REPONSE DATA IS NULL", 0));
  }
}
