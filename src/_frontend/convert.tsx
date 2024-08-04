import { Text } from "@chakra-ui/react";
import { ReactElement } from "react";

export const textConverts = (
  input: string,
  options: {
    maxLength?: number;
    removeURL?: boolean;
  }
): { croppedText: ReactElement; rawText: string; withoutURL: string } => {
  let text = input;
  const urlExp = /http(|s).*?(\s|$)/g;
  if (options.removeURL) {
    text = text.replace(urlExp, "");
  }
  if (options.maxLength) {
    if (text.length > options.maxLength) {
      text = text.slice(0, options.maxLength) + "…";
    }
  }
  return {
    croppedText: <>{text}</> || (
      <Text sx={{ fontStyle: "oblique" }}>No description provided</Text>
    ),
    rawText: text || "",
    withoutURL: input.replace(urlExp, ""),
  };
};
