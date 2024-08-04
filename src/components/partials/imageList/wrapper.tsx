import { FC } from "react";
import { ImageList } from "./list";
import { Box } from "@chakra-ui/react";
import { PagingWrapper } from "./pagenation";

export const ImageWrapper: FC<{}> = (props) => {
  return (
    <Box>
      <PagingWrapper />
    </Box>
  );
};
