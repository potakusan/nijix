import { IndividualImageRequestFormatter } from "@/backend/requests/individualImageRequest";
import { SearchRequestFormatter } from "@/backend/requests/searchRequest";
import { IndividualArtistAPI } from "@/backend/sql/artist";
import { IllustMetaAPI } from "@/backend/sql/meta/images";
import { TagExplorer } from "@/backend/sql/tags/explore";
import {
  checkHTTPRequests,
  makeError,
  makeSuccess,
} from "@/backend/validator/httpRequests";
import { ArtistMetaResultSet, ArtistMetaResultType1 } from "@/types/api/artist";
import { CommonQueries } from "@/types/api/common/inputs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ArtistMetaResultType1>
) {
  const { isValidReuest, requestErrorMessage } = checkHTTPRequests(req, "get");
  if (!isValidReuest) {
    return res.status(403).json(makeError(requestErrorMessage, 0));
  }
  const i = await new IndividualArtistAPI().connect();
  const m = await new IllustMetaAPI().connect();
  const t = await new TagExplorer().connect();

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
  m.destroy();

  i.setAuthorId(inputs.authorId);
  const response: ArtistMetaResultSet | null = await i.getMeta();
  i.destroy();

  /* GET TAGS */

  if (!inputs.tags) {
    t.setTags([]);
  } else {
    t.setTags(inputs.tags);
  }

  if (!inputs.nouns) {
    t.setNouns([]);
  } else {
    t.setNouns(inputs.nouns);
  }

  t.setView(inputs.view);
  t.setOffset(inputs.offset);
  t.setLimit(inputs.limit);
  t.setAuthorId(inputs.authorId);
  t.setSinceDate(inputs.sinceDate);
  t.setUntilDate(inputs.untilDate);
  t.setHParams(inputs.hParams);
  t.setAiMode(inputs.aiMode);
  if (inputs.favs) {
    t.setFavs(inputs.favs);
  }
  const tags = await t.get();
  t.destroy();

  /* END GET TAGS*/

  if (response) {
    return res.status(200).json(
      makeSuccess(
        Object.assign(response, {
          tweetCount: imageSum && imageSum.length > 0 ? imageSum[0].sum : 0,
          availableTags: tags.reduce((group: string[], item) => {
            if (!group) group = [];
            group.push(item.tag);
            return group;
          }, []),
        }) as ArtistMetaResultSet
      )
    );
  } else {
    return res.status(500).json(makeError("REPONSE DATA IS NULL", 0));
  }
}
