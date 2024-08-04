import { ImageResultSet } from "@/types/api/search/images";
import { NextApiRequest } from "next";

export const checkHTTPRequests = (
  req: NextApiRequest,
  validRequest: "get" | "post" | "update" | "delete"
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

export const makeError = (errorMessage: string = "Unexpected Error") => ({
  error: true,
  body: [],
  errorMessage: errorMessage,
});

export const makeSuccess = (datasets: ImageResultSet[]) => ({
  error: false,
  body: datasets,
  errorMessage: "",
});
