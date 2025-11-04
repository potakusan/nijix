import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Skeleton,
  Tag,
} from "@chakra-ui/react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetcher } from "@/_frontend/fetch";
import { TagsResultType } from "@/types/api/image/tags";
import Link from "next/link";

const TagsBox = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, isLoading } = useSWR<TagsResultType>(
    id ? `/image/tags?id=${encodeURIComponent(id as string)}` : null,
    fetcher
  );
  if (!isLoading && (!data || data.body.tags.length === 0)) {
    return null;
  }
  return (
    <Box mt={4}>
      <Card>
        <CardHeader pb={1}>
          <Heading size="md">Tags</Heading>
        </CardHeader>
        <CardBody pt={2}>
          {(isLoading || !data) && <SkeletonTagsBox />}
          {!isLoading && data && (
            <HStack flexWrap={"wrap"} spacing={1}>
              {data?.body.tags.map((item) => {
                return (
                  <Link key={item.tag} href={`/search/${item.tag}/_/1`}>
                    <Tag key={item.tag} variant="solid" colorScheme="facebook">
                      {item.tag}({item.count})
                    </Tag>
                  </Link>
                );
              })}
              {data?.body.nouns.map((item) => {
                return (
                  <Link key={item.tag} href={`/search/_/${item.tag}/1`}>
                    <Tag key={item.tag} variant="solid" colorScheme="teal">
                      {item.tag}({item.count})
                    </Tag>
                  </Link>
                );
              })}
            </HStack>
          )}
          {error && <>Error</>}
        </CardBody>
      </Card>
    </Box>
  );
};

const SkeletonTagsBox = () =>
  [...new Array(8)].map((_, i) => {
    return (
      <Skeleton key={i}>
        <Tag variant="solid" colorScheme="teal">
          &nbsp;
        </Tag>
      </Skeleton>
    );
  });

export default TagsBox;
