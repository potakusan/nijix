import { MetaImageResult } from "@/types/api/meta/images";
import { ImageResultSet, SearchImageResult } from "@/types/api/search/images";
import { TagExplorerResultSet } from "@/types/api/tags/explore";
import { NextApiRequest } from "next";
import { NextRequest } from "next/server";

export const checkHTTPRequests = (
  req: NextApiRequest | NextRequest,
  validRequest: "get" | "post" | "update" | "delete" | "put"
): {
  isValidReuest: boolean;
  requestErrorMessage: string;
} => {
  const isValid = req.method?.toLowerCase() === validRequest;
  return {
    isValidReuest: isValid,
    requestErrorMessage: !isValid ? "INVALID HTTP REQUEST METHOD GIVEN." : "",
  };
};

export const makeError = (
  errorMessage: string = "Unexpected Error",
  body: any
) => ({
  error: true,
  body: body,
  errorMessage: errorMessage,
});

export const makeSuccess = (
  datasets: ImageResultSet[] | TagExplorerResultSet[] | any
) => ({
  error: false,
  body: datasets,
  errorMessage: "",
});
