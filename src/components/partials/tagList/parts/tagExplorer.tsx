import { fetcher } from "@/_frontend/fetch";
import {
  TagExplorerResult,
  TagExplorerResultSet,
} from "@/types/api/tags/explore";
import { useRouter } from "next/router";
import { FC } from "react";
import { GLOBAL_TAGS_NUMBERS_PER_PAGE } from "../../../../../_config/config";
import {
  Button,
  Heading,
  HStack,
  Link as RLink,
  Skeleton,
  Tag,
  TagLabel,
  TagRightIcon,
  Text,
} from "@chakra-ui/react";
import {
  ExternalLinkIcon,
  SmallAddIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import { generateNewPath } from "@/_frontend/generateNewPath";
import { useSearchParams } from "next/navigation";
import useSWRInfinite from "swr/infinite";
import Link from "next/link";
import { queryGenerator } from "@/_frontend/queryGenerator";

export const TagExplorer: FC<{
  _tag?: boolean;
  _noun?: boolean;
  _character?: boolean;
  artist?: string;
  favourite?: string[];
  sharedId?: string;
}> = ({ _tag, _noun, _character, artist, favourite, sharedId }) => {
  const router = useRouter();
  const params = useSearchParams();
  const { tag, noun } = router.query;

  const getKey = (pageIndex: number) => {
    const qs = [
      `tags=${tag || "_"}`,
      `nouns=${noun || "_"}`,
      `aiMode=${params.get("aiMode") || 2}`,
      `hparams=${params.get("hparams") || ""}`,
      `limit=${GLOBAL_TAGS_NUMBERS_PER_PAGE}`,
      `offset=${pageIndex * GLOBAL_TAGS_NUMBERS_PER_PAGE}`,
      `view=${
        _character ? "character" : _tag ? "tags" : _noun ? "nouns" : "tags"
      }`,
    ];
    if (artist) qs.push(`authorId=${artist}`);
    if (favourite) qs.push(`favs=${favourite.join(",")}`);
    return (tag && noun) || artist
      ? `/tags/explore?${queryGenerator(qs)}`
      : null;
  };

  const { data, error, isLoading, size, setSize } =
    useSWRInfinite<TagExplorerResult>(getKey, fetcher, {
      revalidateFirstPage: false,
    });

  const searchParams = useSearchParams();

  const limit = GLOBAL_TAGS_NUMBERS_PER_PAGE;
  const isEmpty = data?.[0]?.body.length === 0;
  const isReachingEnd =
    isEmpty || (data && data?.[data?.length - 1]?.body.length < limit);

  const newPath = (newTag: string) =>
    generateNewPath(
      searchParams,
      (tag as string) || "_",
      (noun as string) || "_",
      _tag ? newTag : null,
      _noun || _character ? newTag : null,
      artist,
      !!favourite,
      sharedId
    );
  const isExists = (current: string) => {
    if (_tag) {
      return tag ? (tag as string).split(",").indexOf(current) > -1 : false;
    }
    if (_noun) {
      return noun ? (noun as string).split(",").indexOf(current) > -1 : false;
    }
    if (_character) {
      return noun ? (noun as string).split(",").indexOf(current) > -1 : false;
    }
    return false;
  };

  if (error)
    return (
      <>
        <Heading size="sm" as="p" sx={{ marginBottom: "8px" }}>
          {_tag && `タグ`}
          {_noun && `特徴`}
          {_character && `キャラクター`}
        </Heading>
        <Text>Fetch Error</Text>
      </>
    );
  if (!data)
    return (
      <SkeletonTagCloud _character={_character} _tag={_tag} _noun={_noun} />
    );
  return (
    <>
      <Heading size="sm" as="p" sx={{ marginBottom: "8px" }}>
        {_tag && `タグ`}
        {_noun && `特徴`}
        {_character && `キャラクター`}
      </Heading>
      <HStack spacing={1} wrap={"wrap"}>
        {data
          .reduce((group: TagExplorerResultSet[], item) => {
            if (!group) group = [];
            group = group.concat(item.body);
            return group;
          }, [])
          .map((item) => {
            const path = newPath(item.tag);
            const exists = isExists(item.tag);
            return (
              <RLink as={Link} href={path} key={item.tag}>
                <Tag colorScheme="blue" variant={exists ? "solid" : "outline"}>
                  <TagLabel>
                    {item.tag}({item.num})
                  </TagLabel>
                  <TagRightIcon as={exists ? SmallCloseIcon : SmallAddIcon} />
                </Tag>
              </RLink>
            );
          })}
      </HStack>
      {!isReachingEnd && (
        <Button
          isLoading={isLoading}
          loadingText="読込中"
          size="small"
          sx={{ width: "100%", padding: "4px 0", margin: "8px 0" }}
          colorScheme="blue"
          onClick={() => {
            setSize(size + 1);
          }}
        >
          更に読み込み
        </Button>
      )}
      {_noun && (artist || favourite) && (
        <>
          <Text mt="3" fontSize="xs" as="p" textAlign={"right"}>
            <RLink
              as={Link}
              href={`/search/${tag}/${noun}/1?${searchParams.toString()}`}
              display={"inline-block"}
            >
              全てのイラストを検索
              <ExternalLinkIcon mx="2px" />
            </RLink>
          </Text>
        </>
      )}
    </>
  );
};

export const SkeletonTagCloud: FC<{
  _tag?: boolean;
  _noun?: boolean;
  _character?: boolean;
  withHeader?: boolean;
}> = ({ _tag, _noun, _character, withHeader = true }) => {
  const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min);

  return (
    <>
      {withHeader && (
        <Heading size="sm" as="p" sx={{ marginBottom: "8px" }}>
          {_tag && "タグ"}
          {_noun && "特徴"}
          {_character && `キャラクター`}
        </Heading>
      )}
      <HStack spacing={1} wrap={"wrap"}>
        {[...new Array(GLOBAL_TAGS_NUMBERS_PER_PAGE)].map((_item, i) => {
          return (
            <Skeleton key={i} width={`${rand(80, 150)}px`}>
              <Tag>
                <TagLabel />
              </Tag>
            </Skeleton>
          );
        })}
      </HStack>
    </>
  );
};
