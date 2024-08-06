"use client";

import { SearchImageResult } from "@/types/api/search/images";
import { FC } from "react";
import { ImageCard, ImageCardSkeleton } from "./card";
import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import { GLOBAL_ITEM_NUMBERS_PER_PAGE } from "../../../../_config/config";

export const ImageList: FC<{
  listError: boolean;
  listLoading: boolean;
  listBody: SearchImageResult | undefined;
}> = ({ listBody, listError, listLoading }) => {
  if (listError) return <>Error</>;
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
