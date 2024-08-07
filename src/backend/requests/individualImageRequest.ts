import { CommonIndividualImageRequestInputs } from "@/types/api/common/inputs";

export const IndividualImageRequestFormatter = (queries: {
  [key: string]: string;
}): {
  success: boolean;
  inputs?: CommonIndividualImageRequestInputs;
} => {
  const inputs: CommonIndividualImageRequestInputs = {
    id: "",
  };

  inputs.id = queries.id || "";
  if (!queries.id || queries.id === "_") inputs.id = "";

  return { success: true, inputs: inputs };
};
