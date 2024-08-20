import {
  Box,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Link as RLink,
} from "@chakra-ui/react";
import { Fragment, useState } from "react";
import { CloseIcon } from "@chakra-ui/icons";
import { TopSlider } from "@/pages";
import { useRouter } from "next/router";
import { ConditionsSelector } from "../tagList/oneSelector";
import { PagingWrapper } from "../imageList/pagenation";
import { PageHead } from "@/pages/search/[tag]/[noun]/[page]";
import useSWR from "swr";
import { ArtistMetaResultType1 } from "@/types/api/artist";
import { queryGenerator } from "@/_frontend/queryGenerator";
import { fetcher } from "@/_frontend/fetch";
import { NavBarButton } from "../navBar";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const IndividualArtistLayout = () => {
  const router = useRouter();
  const [error, setError] = useState<boolean>(false);
  const { id } = router.query;
  if (error) {
    return <Error />;
  }
  return (
    <>
      <Header />
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

const Header = () => {
  const router = useRouter();
  const params = useSearchParams();
  const { id } = router.query;
  const { tag, noun } = router.query;
  const qs = [
    `authorId=${id || "_"}`,
    `sort=${params.get("sort") || "created_at,desc"}`,
    `aiMode=${params.get("aiMode")}`,
    `tags=${tag || ""}`,
    `nouns=${noun || ""}`,
    `hparams=${params.get("hparams") || ""}`,
  ];
  const { data, error, isLoading } = useSWR<ArtistMetaResultType1>(
    id ? `/artist/meta?${queryGenerator(qs)}` : null,
    fetcher
  );
  if (error) return null;
  if (isLoading || !data) {
    return <PageHead>-</PageHead>;
  }
  if (!isLoading && !data) {
    return null; //404
  }
  if (router.query.tag || router.query.noun) {
    const tags = (router.query.tag as string).split(",");
    const nouns = (router.query.noun as string).split(",");
    window.document.title = `${tags
      .concat(nouns)
      .filter((item) => item !== "_")
      .join(",")}に関連する${data.body.username}さんのイラスト - NijiX`;
  } else {
    window.document.title = `${data.body.username}さんのイラスト - NijiX`;
  }
  const fil = (str: string) =>
    str
      .replace(/_/g, "")
      .split(",")
      .filter((item) => item !== "");

  const pathGenerator = (type: "tag" | "noun", input: string) => {
    return `/artist/${id}/${type === "tag" ? input : "_"}/${
      type === "noun" ? input : "_"
    }/1?${params.toString()}`;
  };

  return (
    <PageHead>
      <Box>
        <Heading
          fontWeight={600}
          p={4}
          fontSize={{ base: "2xl", sm: "4xl", md: "4xl" }}
          lineHeight={"110%"}
        >
          {router.isReady ? (
            <>
              {fil(tag as string).map((item, i) => {
                const path = pathGenerator("tag", item);
                return (
                  <Fragment key={i}>
                    <RLink
                      as={Link}
                      key={item}
                      href={path}
                      color="blue.200"
                      textDecoration={"underline"}
                    >
                      {item}
                    </RLink>
                    {i !== fil(tag as string).length - 1 && <>・</>}
                  </Fragment>
                );
              })}
              {fil(tag as string).length > 0 &&
                fil(noun as string).length > 0 && <>・</>}
              {fil(noun as string).map((item, i) => {
                const path = pathGenerator("noun", item);
                return (
                  <Fragment key={i}>
                    <RLink
                      as={Link}
                      key={item}
                      href={path}
                      color="blue.200"
                      textDecoration={"underline"}
                    >
                      {item}
                    </RLink>
                    {i !== fil(noun as string).length - 1 && <>・</>}
                  </Fragment>
                );
              })}
              {fil(tag as string).length === 0 &&
              fil(noun as string).length === 0 ? (
                <>
                  {data.body.username}さんのイラスト({data.body.tweetCount}枚)
                </>
              ) : (
                <>
                  に関連する{data.body.username}さんのイラスト(
                  {data.body.tweetCount}枚)
                </>
              )}
            </>
          ) : (
            <>&nbsp;</>
          )}
        </Heading>
      </Box>
      <NavBarButton _artist={(id as string) || ""} />
    </PageHead>
  );
};
