import { Container, Divider, Grid, GridItem } from "@chakra-ui/react";
import Carousel from "./slider";
import ArtistBox from "./authorBox";
import SDTagsBox from "./sdTagsBox";
import TagsBox from "./tagsBox";
import RelatedImages from "./related";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const IndivisualImagePostLayout = () => {
  return (
    <Container maxW="container.xl" my={{ base: 0, md: 8 }}>
      <Grid templateColumns={"repeat(12, minmax(0, 1fr))"} gap={4}>
        <GridItem w="100%" colSpan={{ base: 12, sm: 12, md: 8, lg: 9 }}>
          <Carousel />
          <RelatedImages />
        </GridItem>
        <GridItem w="100%" colSpan={{ base: 12, sm: 12, md: 4, lg: 3 }}>
          <ArtistBox />
          <TagsBox />
          <SDTagsBox />
        </GridItem>
      </Grid>
      <Divider my={4} />
      <div className="clear" />
    </Container>
  );
};
