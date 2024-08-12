// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  checkHTTPRequests,
  makeError,
  makeSuccess,
} from "@/backend/validator/httpRequests";
import { TagExplorerResult } from "@/types/api/tags/explore";
import { FavouriteEditor } from "@/backend/sql/favourite";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TagExplorerResult>
) {
  const { isValidReuest, requestErrorMessage } = checkHTTPRequests(req, "post");
  if (!isValidReuest) {
    return res.status(405).json(makeError(requestErrorMessage, []));
  }
  if (!req.body) {
    return res.status(405).json(makeError(requestErrorMessage, []));
  }
  const inputs = JSON.parse(req.body);
  let id = crypto.randomUUID();
  const i = await new FavouriteEditor().connect();
  const alreadyExists = await i.isExists(inputs.ids);
  if (!alreadyExists) {
    await i.setId(id).put(inputs.ids);
  } else {
    id = alreadyExists;
  }

  i.destroy();
  return res.status(200).json(
    makeSuccess({
      id: id,
    })
  );
}
