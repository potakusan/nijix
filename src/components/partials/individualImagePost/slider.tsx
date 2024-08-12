import { Box, Image, Skeleton, Tooltip } from "@chakra-ui/react";

import Slider from "react-slick";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetcher } from "@/_frontend/fetch";
import { IndividualIllustType } from "@/types/api/image";
import { Dispatch, FC, SetStateAction, useState } from "react";
import Lightbox, { Slide, SlideImage } from "yet-another-react-lightbox";
import {
  Counter,
  Download,
  Slideshow as SlideshowPlg,
  Thumbnails,
  Zoom,
} from "yet-another-react-lightbox/plugins";
import { NavBarButton } from "../navBar";
import { SlideshowType } from "@/types/api/slideshow";

const settings = {
  dots: true,
  infinite: false,
  slidesToScroll: 1,
  slidesPerRow: 1,
};

const LightBox = (
  data: Slide[] | undefined,
  Slideshow: SlideshowType,
  setSlideshow: Dispatch<SetStateAction<SlideshowType>>,
  _?: string[]
) => (
  <Lightbox
    slideshow={{ delay: 2000 }}
    open={Slideshow.open}
    close={() => setSlideshow({ open: false, initial: 0 })}
    index={Slideshow.initial}
    plugins={[Counter, Download, SlideshowPlg, Thumbnails, Zoom]}
    slides={data}
  />
);

const Carousel: FC<{ setError: (input: boolean) => void }> = ({ setError }) => {
  const router = useRouter();
  const { id } = router.query;
  const [Slideshow, setSlideshow] = useState<SlideshowType>({
    open: false,
    initial: 0,
  });
  const { data, error, isLoading } = useSWR<IndividualIllustType>(
    id ? `/image/list?id=${id}` : null,
    fetcher
  );

  if (error) return <>Error</>;
  if (!isLoading && data && data.body.length === 0) {
    setError(true);
    return null;
  }

  const dataset = data?.body.reduce((group: SlideImage[], item) => {
    if (!group) group = [];
    group.push({
      src: item.backup_saved_url,
    });
    return group;
  }, []);

  return (
    <Box className="imageBody">
      <Slider {...settings} adaptiveHeight={false} variableWidth={false}>
        {isLoading || !data ? (
          <Skeleton>
            <Box className="imageSliderSkeleton" />
          </Skeleton>
        ) : (
          data?.body.map((item, index) => (
            <Image
              onClick={() => setSlideshow({ open: true, initial: index })}
              src={item.backup_saved_url}
              key={index}
              sx={{
                opacity: 1,
                cursor: "pointer",
                transition: ".2s",
                ":hover": { opacity: 0.8 },
              }}
            />
          ))
        )}
      </Slider>
      {LightBox(dataset, Slideshow, setSlideshow)}
      <NavBarButton dataset={dataset} lightBox={LightBox} hideReset />
    </Box>
  );
};

export default Carousel;
