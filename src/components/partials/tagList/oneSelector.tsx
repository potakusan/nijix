import { Box } from "@chakra-ui/react";
import { TagExplorer } from "./parts/tagExplorer";

export const ConditionsSelector = () => {
  return (
    <Box sx={{ position: "sticky", top: "0" }}>
      <Box sx={{ overflowY: "auto", maxHeight: "100vh" }} p={2}>
        <TagExplorer _tag />
        <TagExplorer _noun />
      </Box>
    </Box>
  );
};
