import {
  Box,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
} from "@chakra-ui/react";
import Carousel from "./slider";
import ArtistBox from "./authorBox";
import SDTagsBox from "./sdTagsBox";
import TagsBox from "./tagsBox";
import RelatedImages from "./related";
import { useState } from "react";
import { CloseIcon } from "@chakra-ui/icons";
import { TopSlider } from "@/pages";
import { FavBox } from "../favourites/favButton";

export const IndividualImagePostLayout = () => {
  const [error, setError] = useState<boolean>(false);
  if (error) {
    return <Error />;
  }
  return (
    <Container maxW={"8xl"} my={{ base: 0, md: 8 }}>
      <Grid templateColumns={"repeat(12, minmax(0, 1fr))"} gap={4}>
        <GridItem w="100%" colSpan={{ base: 12, sm: 12, md: 8, lg: 9 }}>
          <Carousel setError={setError} />
          <RelatedImages />
        </GridItem>
        <GridItem w="100%" colSpan={{ base: 12, sm: 12, md: 4, lg: 3 }}>
          <FavBox />
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

const Error = () => {
  return (
    <>
      <Box textAlign="center" py={36} px={6}>
        <Box display="inline-block">
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            bg={"red.500"}
            rounded={"50px"}
            w={"55px"}
            h={"55px"}
            textAlign="center"
          >
            <CloseIcon boxSize={"20px"} color={"white"} />
          </Flex>
        </Box>
        <Heading as="h2" size="xl" mt={6} mb={2}>
          404 Not Found
        </Heading>
        <Text color={"gray.500"}>
          The file you have requested did not found.
          <br />
        </Text>
      </Box>
      <TopSlider component={"a"} />
    </>
  );
};
