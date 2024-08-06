"use client";

import { SearchImageResult } from "@/types/api/search/images";
import { FC } from "react";
import { ImageCard, ImageCardSkeleton } from "./card";
import { Box, Text, Heading, SimpleGrid } from "@chakra-ui/react";
import { GLOBAL_ITEM_NUMBERS_PER_PAGE } from "../../../../_config/config";
import { InfoIcon } from "@chakra-ui/icons";

export const ImageList: FC<{
  listError: boolean;
  listLoading: boolean;
  listBody: SearchImageResult | undefined;
}> = ({ listBody, listError, listLoading }) => {
  if (listError) return <>Error</>;
  if (!listLoading && listBody?.body.length === 0) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <InfoIcon boxSize={"50px"} color={"blue.500"} />
        <Heading as="h2" size="xl" mt={6} mb={2}>
          No Images
        </Heading>
        <Text color={"gray.500"}>
          No images found that match current conditions
        </Text>
      </Box>
    );
  }
  return (
    <Box px={4}>
      <SimpleGrid
        spacing={"20px"}
        columns={[1, 1, 2, 3, 4]}
        sx={{
          "@media screen and (max-width:768px)": {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
        }}
      >
        {listLoading &&
          [...Array(GLOBAL_ITEM_NUMBERS_PER_PAGE)].map((_, i) => (
            <ImageCardSkeleton key={i} />
          ))}
        {listBody?.body.map((item) => (
          <ImageCard key={item.id} {...item} />
        ))}
      </SimpleGrid>
    </Box>
  );
};
