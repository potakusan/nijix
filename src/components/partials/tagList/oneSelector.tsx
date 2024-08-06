import { Box, Divider } from "@chakra-ui/react";
import { TagExplorer } from "./parts/tagExplorer";
import { AIChoice } from "./parts/aiChoice";
import { FC } from "react";

export const ConditionsSelector: FC<{ artist?: string }> = ({ artist }) => {
  return (
    <Box sx={{ position: "sticky", top: "0" }}>
      <Box sx={{ overflowY: "auto", maxHeight: "100vh" }} p={2}>
        <AIChoice artist={artist} />
        <Divider my={"4"} />
        <TagExplorer _tag artist={artist} />
        <Divider my={"4"} />
        <TagExplorer _noun artist={artist} />
      </Box>
    </Box>
  );
};
