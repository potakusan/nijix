import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Heading,
  Image,
  Link,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetcher } from "@/_frontend/fetch";
import { ArtistMetaResultType } from "@/types/api/artist";
import NextLink from "next/link";
import Slider from "react-slick";
import { generateOriginalUrl } from "@/_frontend/generateOriginalUrl";
import Head from "next/head";

export default function ArtistBox() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, isLoading } = useSWR<ArtistMetaResultType>(
    id ? `/artist/meta/fromImage?id=${encodeURIComponent(id as string)}` : null,
    fetcher
  );

  if (error) return <>Error</>;
  if (isLoading || !data) return <SkeletonArtistBox />;
  if (
    !isLoading &&
    (!data ||
      !data.body ||
      !data.body.r ||
      data.body.r.length === 0 ||
      !data.body.m ||
      data.body.m.length === 0)
  ) {
    return null;
  }
  let text = data.body.m[0].text.replace(
    /https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/g,
    ""
  );
  if (!text || text.length === 0) {
    text = "無題";
  }
  return (
    <Box mt={4}>
      <Head>
        <title>
          {`${text} | ${data.body.m[0].username}さんのイラスト - NijiX`}
        </title>
        <meta
          name="description"
          content={
            router.isReady
              ? `${text || "無題"} - ${
                  data.body.m[0].username
                }さんのイラストからAIを使った特徴分析で関連画像を検索できます。${(
                  data.body.m[0].tags || "[]"
                )
                  .split(",")
                  .concat((data.body.m[0].nouns || "[]").split(","))
                  .join(",")}に関するエロ画像を検索。`
              : ""
          }
        />
      </Head>
      <Card>
        <CardBody>
          <Box>
            <Heading size="md" sx={{ display: "flex", alignItems: "center" }}>
              <Link
                as={NextLink}
                href={`/artist/${data.body.r[0].author_id}/_/_/1`}
                color="teal"
              >
                {data.body.r[0].source === "twitter" ? "@" : ""}
                {data.body.r[0].username}
              </Link>
              <NextLink
                passHref
                target="_blank"
                rel="noopener noreferrer"
                href={generateOriginalUrl(
                  false,
                  id as string,
                  data.body.r[0].source,
                  data.body.r[0].author_id
                )}
              >
                <Button
                  size={"small"}
                  variant="outline"
                  colorScheme="teal"
                  fontSize="10"
                  ml={2}
                  p={1}
                  px={3}
                >
                  Source
                </Button>
              </NextLink>
            </Heading>
          </Box>
          {data.body.m && data.body.m.length > 0 && (
            <>
              <Text as="h1" my={3} color="blue.300" fontSize="sm">
                {text}
              </Text>
              <Text
                as="p"
                textAlign={"right"}
                my={3}
                color="blue.300"
                fontSize="sm"
              >
                {data.body.m[0].added_at}
              </Text>
            </>
          )}
          <Divider m={4} />
          <Box mt={4} display="block" className="authorImages">
            <Slider
              infinite={data.body.r.length !== 1}
              centerMode
              centerPadding="60px"
              slidesToScroll={3}
              dots={false}
              autoplay={true}
              autoplaySpeed={2000}
            >
              {data?.body.r.map((item, _) => {
                if (!item.backup_saved_url) return null;
                return (
                  <Box key={item.id}>
                    <Box
                      sx={{
                        margin: "0 20px",
                      }}
                    >
                      <Link as={NextLink} href={`/image/${item.id}`}>
                        <Card
                          borderRadius={"20px"}
                          as="span"
                          sx={{
                            transition: ".2s",
                            opacity: 1,
                            ":hover": { opacity: 0.8 },
                          }}
                        >
                          <Image
                            alt={item.text}
                            title={item.text}
                            borderRadius={"20px"}
                            src={item.px_thumb || item.backup_saved_url}
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                            height="150px"
                            objectFit={"cover"}
                          />
                        </Card>
                      </Link>
                    </Box>
                  </Box>
                );
              })}
            </Slider>
          </Box>
          <NextLink href={"/artist/" + data.body.r[0].author_id + "/_/_/1"}>
            <Button
              variant="solid"
              colorScheme="teal"
              width={"100%"}
              mt={2}
              p={1}
            >
              See all images
            </Button>
          </NextLink>
        </CardBody>
      </Card>
    </Box>
  );
}

const SkeletonArtistBox = () => (
  <Box>
    <Card>
      <CardBody>
        <Box>
          <Heading size="md">
            <Skeleton>&nbsp;</Skeleton>
          </Heading>
        </Box>
        <Divider m={4} />
        <Box mt={4} display="block" className="authorImages">
          <Skeleton w={"100%"} h="156px" />
        </Box>
        <Skeleton>
          <Button
            variant="solid"
            colorScheme="teal"
            width={"100%"}
            mt={2}
            p={1}
          >
            See all images
          </Button>
        </Skeleton>
      </CardBody>
    </Card>
  </Box>
);
