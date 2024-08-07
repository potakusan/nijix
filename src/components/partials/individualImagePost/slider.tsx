import { Box, Image, Skeleton } from "@chakra-ui/react";

import Slider from "react-slick";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetcher } from "@/_frontend/fetch";
import { IndividualIllustType } from "@/types/api/image";
import { FC } from "react";

const settings = {
  dots: true,
  infinite: false,
  slidesToScroll: 1,
  slidesPerRow: 1,
};

const Carousel: FC<{ setError: (input: boolean) => void }> = ({ setError }) => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, isLoading } = useSWR<IndividualIllustType>(
    id ? `/image/list?id=${id}` : null,
    fetcher
  );

  if (error) return <>Error</>;
  if (!isLoading && data && data.body.length === 0) {
    setError(true);
    return null;
  }

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
};

export default Carousel;
