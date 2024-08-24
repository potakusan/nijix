import {
  Box,
  Button,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";

import Slider from "react-slick";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetcher } from "@/_frontend/fetch";
import { ImageListResultSet, IndividualIllustType } from "@/types/api/image";
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { ImagesSlider } from "./related";
import { InfoOutlineIcon } from "@chakra-ui/icons";

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
  let sliderRef = useRef<Slider | null>(null); // <---- improved this type
  const { id } = router.query;
  const [Slideshow, setSlideshow] = useState<SlideshowType>({
    open: false,
    initial: 0,
  });
  const { data, error, isLoading } = useSWR<IndividualIllustType>(
    id ? `/image/list?id=${id}` : null,
    fetcher
  );

  useEffect(() => {
    if (router.isReady) {
      if (sliderRef) {
        (sliderRef as any).slickGoTo(Number(router.query.initialId) - 1);
      }
    }
  }, [router.isReady, router.query.initialId]);

  if (error) return <>Error</>;

  if (!router.isReady) return null;

  if (!isLoading && data && data.body.main.length === 0) {
    setError(true);
    return null;
  }

  const dataset = data?.body.main.reduce((group: SlideImage[], item) => {
    if (!group) group = [];
    group.push({
      src: item.backup_saved_url,
    });
    return group;
  }, []);

  const isSameFunc = (id: number) => {
    if (sliderRef) {
      (sliderRef as any).slickGoTo(
        data?.body.main.findIndex((item) => item.increment === id)
      );
    }
    return;
  };

  return (
    <>
      <Box className="imageBody">
        <Slider
          ref={(slider: any) => {
            sliderRef = slider;
          }}
          initialSlide={Number(router.query.initialId) - 1 || 0}
          {...settings}
          adaptiveHeight={false}
          variableWidth={false}
        >
          {isLoading || !data ? (
            Number(router.query.initialId) - 1 || 0 ? (
              [...new Array(Number(router.query.initialId))].map((_, i) => (
                <Skeleton key={"daemon-" + i}>
                  <Box className="imageSliderSkeleton" />
                </Skeleton>
              ))
            ) : (
              <Skeleton>
                <Box className="imageSliderSkeleton" />
              </Skeleton>
            )
          ) : (
            data?.body.main.map((item, index) => (
              <Image
                alt={item.text}
                title={item.text}
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
      {data?.body.additional && data?.body.additional.length > 1 && (
        <>
          <AdditionalSlider
            isSameFunc={isSameFunc}
            data={data?.body.additional}
          />
          <Divider my={4} />
        </>
      )}
    </>
  );
};

const AdditionalSlider: FC<{
  data: ImageListResultSet[];
  isSameFunc: (newKey: number) => void;
}> = ({ data, isSameFunc }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <ImagesSlider
        isSameFunc={isSameFunc}
        title={
          <>
            同じアルバムに収録された画像 &nbsp;
            <InfoOutlineIcon onClick={onOpen} sx={{ cursor: "pointer" }} />
          </>
        }
        data={data}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>アルバムについて</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            NijiXでは、クロール元サイトで1つの投稿にまとめられた画像を、シチュエーション、体位、登場キャラクターなどによって複数のアイテムに分割して収録しています。
            <br />
            このため、アルバム全体の収録枚数と、NijiXにおけるアイテムごとの収録枚数が異なる場合があります。
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Carousel;
