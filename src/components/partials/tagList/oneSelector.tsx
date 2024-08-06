import { Box, Divider } from "@chakra-ui/react";
import { TagExplorer } from "./parts/tagExplorer";
import { AIChoice } from "./parts/aiChoice";

export const ConditionsSelector = () => {
  return (
    <Box sx={{ position: "sticky", top: "0" }}>
      <Box sx={{ overflowY: "auto", maxHeight: "100vh" }} p={2}>
        <AIChoice />
        <Divider my={"4"} />
        <TagExplorer _tag />
        <Divider my={"4"} />
        <TagExplorer _noun />
      </Box>
    </Box>
  );
};
