import { Box, Image, Skeleton } from "@chakra-ui/react";

import Slider from "react-slick";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetcher } from "@/_frontend/fetch";
import { IndivisualIllustType } from "@/types/api/image";

const settings = {
  dots: true,
  infinite: false,
  slidesToScroll: 1,
  slidesPerRow: 1,
};

export default function Carousel() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, isLoading } = useSWR<IndivisualIllustType>(
    id ? `/image/list?id=${id}` : null,
    fetcher
  );

  if (error) return <>Error</>;

  return (
    <Box className="imageBody">
      <Slider {...settings} adaptiveHeight={false} variableWidth={false}>
        {isLoading || !data ? (
          <Skeleton>
            <Box className="imageSliderSkeleton" />
          </Skeleton>
        ) : (
          data?.body.map((item, index) => (
            <Image src={item.backup_saved_url} key={index} />
          ))
        )}
      </Slider>
    </Box>
  );
}
