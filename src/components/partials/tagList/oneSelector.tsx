import { Box, Divider } from "@chakra-ui/react";
import { TagExplorer } from "./parts/tagExplorer";
import { AIChoice } from "./parts/aiChoice";
import { FC } from "react";
import { HSlider } from "./parts/hSlider";

export const ConditionsSelector: FC<{
  artist?: string;
  favourite?: string[];
}> = ({ artist, favourite }) => {
  return (
    <Box sx={{ position: "sticky", top: "0" }}>
      <Box sx={{ overflowY: "auto", maxHeight: "100vh" }} p={2}>
        <AIChoice artist={artist} favourite={favourite} />
        <Divider my={"4"} />
        <HSlider artist={artist} favourite={favourite} />
        <Divider my={"4"} />
        <TagExplorer _tag artist={artist} favourite={favourite} />
        <Divider my={"4"} />
        <TagExplorer _noun artist={artist} favourite={favourite} />
        <Divider my={"4"} />
      </Box>
    </Box>
  );
};
