import { Box, Divider } from "@chakra-ui/react";
import { TagExplorer } from "./parts/tagExplorer";
import { AIChoice } from "./parts/aiChoice";
import { FC } from "react";
import { HSlider } from "./parts/hSlider";

export const ConditionsSelector: FC<{
  artist?: string;
  favourite?: string[];
  sharedId?: string;
}> = ({ artist, favourite, sharedId }) => {
  return (
    <Box sx={{ position: "sticky", top: "0" }}>
      <Box sx={{ overflowY: "auto", maxHeight: "100vh" }} p={2}>
        <AIChoice artist={artist} sharedId={sharedId} favourite={favourite} />
        <Divider my={"4"} />
        <HSlider artist={artist} sharedId={sharedId} favourite={favourite} />
        <Divider my={"4"} />
        <TagExplorer
          _tag
          artist={artist}
          sharedId={sharedId}
          favourite={favourite}
        />
        <Divider my={"4"} />
        <TagExplorer
          _noun
          artist={artist}
          sharedId={sharedId}
          favourite={favourite}
        />
        <Divider my={"4"} />
      </Box>
    </Box>
  );
};
