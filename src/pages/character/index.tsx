import { Wrapper } from "@/components/common/wrapper";
import { IndividualImagePostLayout } from "@/components/partials/individualImagePost/_layout";
import SearchInput from "@/components/partials/searchInput";
import {
  Box,
  Card,
  Container,
  Divider,
  Heading,
  HStack,
  Link,
  Spinner,
  Tag,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import { PageHead } from "../search/[tag]/[noun]/[page]";
import { fetcher } from "@/_frontend/fetch";
import useSWR from "swr";
import { CharacterTypeResult } from "@/types/api/character";
import RLink from "next/link";
import { Fragment } from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";

export default function IndividualImagePage() {
  return (
    <Wrapper>
      <Header />
      <Container maxW={"8xl"} my={{ base: 0, md: 8 }}>
        <Container maxW={"4xl"}>
          <Text fontSize="sm" my={4}>
            キャラクター名はMeCabで判定しています。該当するキャラクターがリストにない場合はここから前方一致検索できます。
          </Text>
          <SearchInput />
        </Container>
        <CharacterList />
      </Container>
    </Wrapper>
  );
}

const Header = () => {
  return (
    <PageHead>
      <Box>
        <Heading
          fontWeight={600}
          p={4}
          fontSize={{ base: "2xl", sm: "4xl", md: "4xl" }}
          lineHeight={"110%"}
        >
          キャラクターから画像を探す
        </Heading>
      </Box>
    </PageHead>
  );
};

const CharacterList = () => {
  const { data, error, isLoading } = useSWR<CharacterTypeResult>(
    `/character/list`,
    fetcher
  );

  if (isLoading || !data) {
    return (
      <Container
        margin="20px auto"
        display="flex"
        justifyContent={"center"}
        alignItems={"center"}
        flexDir={"column"}
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text align={"center"} my={4}>
          読込中...
          <br />
          時間がかかる場合があります
        </Text>
      </Container>
    );
  }
  if (error) {
    return <>Error</>;
  }
  const obj = data?.body.reduce(
    (group: { [key: string]: { noun: string; count: number }[] }, item) => {
      if (!group) group = {};
      if (!group[item.tag]) group[item.tag] = [];
      if (
        data.body.find((_item) => {
          return _item.nounCount > item.nounCount && _item.noun === item.noun;
        })
      )
        return group;
      group[item.tag].push({ noun: item.noun, count: item.nounCount });
      return group;
    },
    {}
  );
  return (
    <>
      <Box>
        <Card p={4} my={8}>
          <Heading mb={4} fontSize="md">
            作品索引
          </Heading>
          <HStack flexWrap={"wrap"} spacing={4}>
            {Object.keys(obj).map((item) => {
              const title = item;
              const items = obj[title];
              if (items.length < 2) return null;
              return (
                <Link key={title} href={"#" + title} color="teal.600">
                  <ChevronDownIcon />
                  {title}
                </Link>
              );
            })}
          </HStack>
        </Card>
      </Box>
      {Object.keys(obj).map((item) => {
        const title = item;
        const items = obj[title];
        if (items.length < 2) return null;
        return (
          <Box key={title} id={title}>
            <Heading fontSize="xl" my={4}>
              {title}
            </Heading>
            <HStack flexWrap={"wrap"} spacing={4}>
              {items.map((item) => {
                return (
                  <Link
                    key={item.noun}
                    as={RLink}
                    href={`/search/${title}/${item.noun}/1`}
                  >
                    <Tag variant="solid" colorScheme="teal">
                      <TagLabel>
                        {item.noun}({item.count})
                      </TagLabel>
                    </Tag>
                  </Link>
                );
              })}
            </HStack>
            <Divider my={4} />
          </Box>
        );
      })}
    </>
  );
};
