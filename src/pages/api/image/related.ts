import { IndividualImageRequestFormatter } from "@/backend/requests/individualImageRequest";
import { IndividualRelatedIllustAPI } from "@/backend/sql/image/related";
import {
  checkHTTPRequests,
  makeError,
  makeSuccess,
} from "@/backend/validator/httpRequests";
import { CommonQueries } from "@/types/api/common/inputs";
import { SearchImageResult } from "@/types/api/search/images";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchImageResult>
) {
  const { isValidReuest, requestErrorMessage } = checkHTTPRequests(req, "get");
  if (!isValidReuest) {
    return res.status(403).json(makeError(requestErrorMessage, 0));
  }
  const i = await new IndividualRelatedIllustAPI().connect();

  const { success, inputs } = IndividualImageRequestFormatter(
    req.query as CommonQueries
  );
  if (!success || !inputs) {
    return res.status(403).json(makeError("VALIDATION ERROR", 0));
  }

  const selfNounsResponse = await i.setId(inputs.id).getSelfNouns();
  if (!selfNounsResponse || selfNounsResponse.length === 0) {
    return res.status(200).json(makeSuccess([]));
  }

  const selfNouns = i.reduceTags(selfNounsResponse);

  let itemsByNouns: { [authorId: string]: string[] } =
    await i.getNounsOfItems();

  const ids = Object.keys(itemsByNouns);
  const jaccardResult: { id: string; jaccard: number }[] = [];
  for (let j = 0; j < ids.length; ++j) {
    const key = ids[j];
    if (key === inputs.id) continue;
    const targetNouns = itemsByNouns[key];
    const int = i.intersections([selfNouns, targetNouns]);
    const uni = i.unions([selfNouns, targetNouns]);
    jaccardResult.push({ id: key, jaccard: int.length / uni.length });
  }
  const shouldGetIds = jaccardResult
    .sort((a, b) => b.jaccard - a.jaccard)
    .slice(0, 40)
    .reduce((group: string[], item) => {
      if (!group) group = [];
      group.push(item.id);
      return group;
    }, []);
  const response = await i.getDataSet(shouldGetIds);

  i.destroy();
  if (response) {
    return res.status(200).json(makeSuccess(response));
  } else {
    return res.status(500).json(makeError("REPONSE DATA IS NULL", 0));
  }
}
