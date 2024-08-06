import { Box, Image } from "@chakra-ui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetcher } from "@/_frontend/fetch";
import { IndivisualIllustType } from "@/types/api/image";

const settings = {
  dots: true,
  infinite: false,
  slidesToScroll: 1,
};

export default function Carousel() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, isLoading } = useSWR<IndivisualIllustType>(
    id ? `/image/list?id=${id}` : null,
    fetcher
  );

  if (error) return <>Error</>;
  if (isLoading || !data) return <>Loading</>;

  return (
    <Box>
      <Slider {...settings} adaptiveHeight={false} variableWidth={false}>
        {data?.body.map((item, index) => (
          <Image src={item.backup_saved_url} key={index} />
        ))}
      </Slider>
    </Box>
  );
}
