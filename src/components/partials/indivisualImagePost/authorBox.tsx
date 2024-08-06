import {
  Box,
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

  return (
    <Box>
      <Card>
        <CardBody>
          <Box>
            <Heading size="md">
              <Link
                as={NextLink}
                href={`/artist/${data.body[0].author_id}`}
                color="teal"
              >
                {data.body[0].source === "twitter" ? "@" : ""}
                {data.body[0].username}
              </Link>
            </Heading>
            <NextLink
              passHref
              target="_blank"
              rel="noopener noreferrer"
              href={generateOriginalUrl(data.body[0])}
            >
              <Tag
                size={"small"}
                variant="solid"
                colorScheme="teal"
                mt={2}
                p={1}
              >
                Image Source:
                {data.body[0].source === "twitter"
                  ? "X(Twitter)"
                  : data.body[0].source}
              </Tag>
            </NextLink>
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
          <Skeleton w={"45px"} mt={2}>
            <Tag size={"small"} variant="solid" colorScheme="teal" p={1}></Tag>
          </Skeleton>
        </Box>
        <Divider m={4} />
        <Box mt={4} display="block" className="authorImages">
          <Skeleton w={"100%"} h="186px" />
        </Box>
      </CardBody>
    </Card>
  </Box>
);
