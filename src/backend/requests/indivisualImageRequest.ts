import { CommonIndivisualImageRequestInputs } from "@/types/api/common/inputs";

export const IndivisualImageRequestFormatter = (queries: {
  [key: string]: string;
}): {
  success: boolean;
  inputs?: CommonIndivisualImageRequestInputs;
} => {
  const inputs: CommonIndivisualImageRequestInputs = {
    id: "",
  };

  inputs.id = queries.id || "";
  if (!queries.id || queries.id === "_") inputs.id = "";

  return { success: true, inputs: inputs };
};
