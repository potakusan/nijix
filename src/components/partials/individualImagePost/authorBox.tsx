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
  Tag,
} from "@chakra-ui/react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetcher } from "@/_frontend/fetch";
import { ArtistMetaResultType } from "@/types/api/artist";
import NextLink from "next/link";
import Slider from "react-slick";
import { generateOriginalUrl } from "@/_frontend/generateOriginalUrl";

export default function ArtistBox() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, isLoading } = useSWR<ArtistMetaResultType>(
    id ? `/artist/meta/fromImage?id=${id}` : null,
    fetcher
  );

  if (error) return <>Error</>;
  if (isLoading || !data) return <SkeletonArtistBox />;
  if (!isLoading && (!data || data.body.length === 0)) {
    return null;
  }
  return (
    <Box mt={4}>
      <Card>
        <CardBody>
          <Box>
            <Heading size="md" sx={{ display: "flex", alignItems: "center" }}>
              <Link
                as={NextLink}
                href={`/artist/${data.body[0].author_id}/_/_/1`}
                color="teal"
              >
                {data.body[0].source === "twitter" ? "@" : ""}
                {data.body[0].username}
              </Link>
              <NextLink
                passHref
                target="_blank"
                rel="noopener noreferrer"
                href={generateOriginalUrl(
                  false,
                  id as string,
                  data.body[0].source,
                  data.body[0].author_id
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
          <Divider m={4} />
          <Box mt={4} display="block" className="authorImages">
            <Slider
              infinite={data.body.length !== 1}
              centerMode
              centerPadding="60px"
              slidesToScroll={3}
              dots={false}
              autoplay={true}
              autoplaySpeed={2000}
            >
              {data?.body.map((item, _) => {
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
          <NextLink href={"/artist/" + data.body[0].author_id + "/_/_/1"}>
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
