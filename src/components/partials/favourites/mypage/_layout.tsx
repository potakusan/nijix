import {
  Box,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Modal,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { CloseIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { ConditionsSelector } from "../../tagList/oneSelector";
import { PagingWrapper } from "../../imageList/pagenation";
import { PageHead } from "@/pages/search/[tag]/[noun]/[page]";
import useSWR from "swr";
import { queryGenerator } from "@/_frontend/queryGenerator";
import { fetcher } from "@/_frontend/fetch";
import { NavBarButton } from "../../navBar";
import Lightbox, { Slide } from "yet-another-react-lightbox";
import { SlideshowType } from "@/types/api/slideshow";
import {
  Counter,
  Download,
  Slideshow as SlideshowPlg,
  Thumbnails,
  Zoom,
} from "yet-another-react-lightbox/plugins";
import { getFavsId } from "@/_frontend/genFavsList";
import { GLOBAL_INTMAX } from "../../../../../_config/config";
import { useSearchParams } from "next/navigation";
import { SearchImageResult } from "@/types/api/search/images";

export const MyPageLayout = () => {
  const qlen = getFavsId(0, true);
  return (
    <>
      <Header />
      <Container maxW={"8xl"} my={{ base: 0, md: 8 }}>
        <Grid templateColumns={"repeat(12, minmax(0, 1fr))"} gap={4}>
          <GridItem colSpan={{ base: 12, sm: 12, md: 3, lg: 2 }}>
            <ConditionsSelector favourite={qlen} />
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 12, md: 9, lg: 10 }}>
            {qlen.filter((item) => item !== "_").length === 0 ? (
              <Error />
            ) : (
              <PagingWrapper favourite={qlen} />
            )}
          </GridItem>
        </Grid>
        <Divider my={4} />
        <div className="clear" />
      </Container>
    </>
  );
};

const Error = () => {
  return (
    <Container>
      <Box textAlign="center" py={36} px={6}>
        <Box display="inline-block">
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            bg={"red.500"}
            rounded={"50px"}
            w={"55px"}
            h={"55px"}
            textAlign="center"
          >
            <CloseIcon boxSize={"20px"} color={"white"} />
          </Flex>
        </Box>
        <Heading as="h2" size="xl" mt={6} mb={2}>
          Favourites not found
        </Heading>
        <Text color={"gray.500"}>
          <b>
            It looks like you haven’t added any illustrations to your bucket
            yet.
          </b>
          <br />
          By adding illustrations to your favourites, you can create a slideshow
          of only the images you like and use personalised recommendations based
          on your favourites.
          <br />
          Of course, no membership is required.
        </Text>
      </Box>
    </Container>
  );
};

const Header = () => {
  const qlen = getFavsId(0, true).filter((item) => item !== "_").length;

  const [Slideshow, setSlideshow] = useState<SlideshowType>({
    open: false,
    initial: 0,
  });
  return (
    <PageHead>
      <Box>
        <Heading
          fontWeight={600}
          p={4}
          fontSize={{ base: "2xl", sm: "4xl", md: "4xl" }}
          lineHeight={"110%"}
        >
          お気に入り({qlen}枚)
        </Heading>
      </Box>
      {LightBox(undefined, Slideshow, setSlideshow)}
      <NavBarButton
        onFavouriteShares
        hideFavourite
        dataset={[]}
        lightBox={LightBox}
      />
    </PageHead>
  );
};

const LightBox = (
  _: Slide[] | undefined,
  Slideshow: SlideshowType,
  setSlideshow: Dispatch<SetStateAction<SlideshowType>>
) => {
  const router = useRouter();
  const params = useSearchParams();
  const { tag, noun } = router.query;

  const qt = [
    `sort=${params.get("sort") || "created_at,desc"}`,
    `aiMode=${params.get("aiMode")}`,
    `tags=${tag || ""}`,
    `nouns=${noun || ""}`,
    `limit=${GLOBAL_INTMAX}`,
    `hparams=${params.get("hparams") || ""}`,
    `offset=0`,
    `favs=${getFavsId(0, true).join(",")}&isSlideshow=true`,
  ];

  const {
    data: fData,
    error,
    isLoading,
  } = useSWR<SearchImageResult>(
    Slideshow.open && getFavsId(0, true).length > 0
      ? `/search/images?${queryGenerator(qt)}`
      : null,
    fetcher
  );

  if (error) {
    alert("ERROR OCCURED WHILE LOADING IMAGES");
    return <></>;
  }
  if (isLoading) {
    return (
      <Modal isOpen={true} onClose={() => null}>
        <ModalOverlay />
      </Modal>
    );
  }
  if (!isLoading) {
    const fetchedData = fData?.body.reduce((group: Slide[], item) => {
      if (!group) group = [];
      group.push({ src: item.backup_saved_url || item.url });
      return group;
    }, []);
    return (
      <Lightbox
        slideshow={{ delay: 2000 }}
        open={Slideshow.open}
        close={() => setSlideshow({ open: false, initial: 0 })}
        index={Slideshow.initial}
        plugins={[Counter, Download, SlideshowPlg, Thumbnails, Zoom]}
        slides={fetchedData}
      />
    );
  }
  return <></>;
};

export default MyPageLayout;
