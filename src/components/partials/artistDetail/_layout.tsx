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
import { useState } from "react";
import { CloseIcon } from "@chakra-ui/icons";
import { TopSlider } from "@/pages";
import { useRouter } from "next/router";
import { ConditionsSelector } from "../tagList/oneSelector";
import { PagingWrapper } from "../imageList/pagenation";
import { PageHead } from "@/pages/search/[tag]/[noun]/[page]";

export const IndivisualArtistLayout = () => {
  const router = useRouter();
  const [error, setError] = useState<boolean>(false);
  const { id } = router.query;
  if (error) {
    return <Error />;
  }
  return (
    <>
      <PageHead>test</PageHead>
      <Container maxW={"8xl"} my={{ base: 0, md: 8 }}>
        <Grid templateColumns={"repeat(12, minmax(0, 1fr))"} gap={4}>
          <GridItem colSpan={{ base: 12, sm: 12, md: 3, lg: 2 }}>
            <ConditionsSelector artist={id as string} />
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 12, md: 9, lg: 10 }}>
            <PagingWrapper artist={id as string} />
          </GridItem>
        </Grid>
        <Divider my={4} />
        <div className="clear" />
      </Container>
    </>
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
