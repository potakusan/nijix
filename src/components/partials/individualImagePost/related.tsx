import { Skeleton, Image, Card, Box, Heading } from "@chakra-ui/react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetcher } from "@/_frontend/fetch";
import { ImageResultSet, SearchImageResult } from "@/types/api/search/images";
import Link from "next/link";
import Slider from "react-slick";
import { FC } from "react";
import { ImageListResultSet } from "@/types/api/image";

export default function RelatedImages() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, isLoading } = useSWR<SearchImageResult>(
    id ? `/image/related?id=${encodeURIComponent(id as string)}` : null,
    fetcher
  );
  if (error) return <>Error</>;
  if (!isLoading && (!data || data.body.length === 0)) {
    return null;
  }
  return (
    <ImagesSlider
      title="Related Images"
      data={data?.body}
      isLoading={isLoading}
    />
  );
}

export const ImagesSlider: FC<{
  isSameFunc?: (id: number) => void;
  title?: any | string;
  data?: ImageResultSet[] | ImageListResultSet[];
  isLoading?: boolean;
}> = ({ title, data, isLoading, isSameFunc }) => {
  const router = useRouter();
  return (
    <Box mt="6">
      <Heading size={"md"} m={"4"} color="teal">
        {title}
      </Heading>
      <Slider
        slidesToShow={6}
        slidesToScroll={6}
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
          : data.map((item) => {
              if (!item.backup_saved_url) return null;
              return (
                <Box key={item.id}>
                  <Box
                    sx={{
                      margin: "0 20px",
                    }}
                  >
                    <Link
                      onClick={(e) => {
                        if (isSameFunc && item.id === router.query.id) {
                          isSameFunc(item.increment);
                          e.preventDefault();
                          return;
                        }
                      }}
                      href={`/image/${item.id}${
                        isSameFunc && item.id !== router.query.id
                          ? `?initialId=${item.increment}`
                          : ``
                      }`}
                    >
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
  );
};
