import { IllustAPI } from "@/backend/sql/search/images";
import {
  checkHTTPRequests,
  makeError,
  makeSuccess,
} from "@/backend/validator/httpRequests";
import { validateDates } from "@/backend/validator/search/illustDates";
import { SearchImageResult } from "@/types/api/search/images";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";

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
  const i = await new IllustAPI().connect();

  const tags = (req.query.tags as string) || "";
  const nouns = (req.query.nouns as string) || "";
  const limit = Number(req.query.limit as string) || 20;
  const offset = Number(req.query.offset as string) || 0;
  const authorId = (req.query.authorId as string) || null || null;
  const seed = (req.query.seed as string) || "";
  const sort = (req.query.sort as string) || "created_at,desc";
  const aiMode = Number(req.query.aiMode as string) || 2;
  const hparam = ((req.query.hparams as string) || "0,100").split(",") || [
    "0",
    "100",
  ];
  const [min, max] = [Number(hparam[0]), Number(hparam[1])];

  if (
    !validateDates(req.query.sinceDate as string, req.query.untilDate as string)
  ) {
    res.status(403).json(makeError("INVALID DATE GIVEN"));
    return;
  }

  const sinceDate = (
    req.query.sinceDate
      ? dayjs(req.query.sinceDate as string)
      : dayjs().subtract(100, "year")
  ).format("YYYY-MM-DD");
  const untilDate = (
    req.query.untilDate
      ? dayjs(req.query.untilDate as string)
      : dayjs().add(1, "year")
  ).format("YYYY-MM-DD");

  if (tags === "_") {
    i.setTags([]);
  } else {
    i.setTags(tags.split(","));
  }

  if (nouns === "_") {
    i.setNouns([]);
  } else {
    i.setNouns(nouns.split(","));
  }

  i.setOffset(offset);
  i.setLimit(limit);
  i.setAuthorId(authorId);
  i.setSinceDate(sinceDate);
  i.setUntilDate(untilDate);
  i.setHParams(min, max);
  i.setSort(sort, seed);
  i.setAiMode(aiMode);

  const response = await i.execMethod();
  if (response) {
    return res.status(200).json(makeSuccess(response));
  } else {
    return res.status(500).json(makeError("REPONSE DATA IS NULL"));
  }
}
