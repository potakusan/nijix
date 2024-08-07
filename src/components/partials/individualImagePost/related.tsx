import { Skeleton, Image, Card, Box, Heading } from "@chakra-ui/react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetcher } from "@/_frontend/fetch";
import { SearchImageResult } from "@/types/api/search/images";
import Link from "next/link";
import Slider from "react-slick";

export default function RelatedImages() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, isLoading } = useSWR<SearchImageResult>(
    id ? `/image/related?id=${id}` : null,
    fetcher
  );
  if (error) return <>Error</>;
  if (!isLoading && (!data || data.body.length === 0)) {
    return null;
  }
  return (
    <Box mt="6">
      <Heading size={"md"} m={"4"} color="teal">
        Related Images
      </Heading>
      <Slider
        slidesToShow={6}
        slidesToScroll={3}
        responsive={[
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
        ]}
        adaptiveHeight={false}
        variableWidth={false}
        swipeToSlide
      >
        {!data || isLoading
          ? [...new Array(24)].map((_, i) => {
              return (
                <Box key={i}>
                  <Skeleton
                    borderRadius={"24px"}
                    sx={{
                      margin: "0 20px",
                    }}
                  >
                    <Card sx={{ height: "150px", width: "auto" }}></Card>
                  </Skeleton>
                </Box>
              );
            })
          : data.body.map((item) => {
              if (!item.backup_saved_url) return null;
              return (
                <Box key={item.id}>
                  <Box
                    sx={{
                      margin: "0 20px",
                    }}
                  >
                    <Link href={`/image/${item.id}`}>
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
  );
}
