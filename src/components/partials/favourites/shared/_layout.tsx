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
import { Dispatch, FC, SetStateAction, useState } from "react";
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
import { GLOBAL_INTMAX } from "../../../../../_config/config";
import { useSearchParams } from "next/navigation";
import { SearchImageResult } from "@/types/api/search/images";
import { SharedFavResultType } from "@/types/api/favs";

export const MyPageLayout = () => {
  const router = useRouter();
  const {
    data: qlen,
    error,
    isLoading,
  } = useSWR<SharedFavResultType>(
    router.query.id ? `/favourite/get?id=${router.query.id}` : null,
    fetcher
  );
  if (isLoading || !qlen) return <>Loading</>;

  const rawIds = qlen.body.reduce((group: string[], item: any) => {
    if (!group) group = [];
    group.push(item.id);
    return group;
  }, []);

  const id = router.query.id as string;
  return (
    <>
      <Header len={qlen.body.length} rawIds={rawIds} />
      <Container maxW={"8xl"} my={{ base: 0, md: 8 }}>
        <Grid templateColumns={"repeat(12, minmax(0, 1fr))"} gap={4}>
          <GridItem colSpan={{ base: 12, sm: 12, md: 3, lg: 2 }}>
            <ConditionsSelector favourite={rawIds} sharedId={id} />
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 12, md: 9, lg: 10 }}>
            {rawIds.filter((item: string) => item !== "_").length === 0 ? (
              <Error />
            ) : (
              <PagingWrapper favourite={rawIds} sharedId={id} />
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
          Shared files not found
        </Heading>
        <Text color={"gray.500"}>
          <b>Oops, this bucket seems empty.</b>
        </Text>
      </Box>
    </Container>
  );
};

const Header: FC<{ len: number; rawIds: string[] }> = ({ len, rawIds }) => {
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
          共有されたお気に入り({len}枚)
        </Heading>
      </Box>
      {LightBox(undefined, Slideshow, setSlideshow, rawIds)}
      <NavBarButton dataset={[]} lightBox={LightBox} />
    </PageHead>
  );
};

const LightBox = (
  _: Slide[] | undefined,
  Slideshow: SlideshowType,
  setSlideshow: Dispatch<SetStateAction<SlideshowType>>,
  rawIds?: string[]
) => {
  const router = useRouter();
  const params = useSearchParams();
  const { tag, noun } = router.query;
  const ids = rawIds || [];
  const qt = [
    `sort=${params.get("sort") || "created_at,desc"}`,
    `aiMode=${params.get("aiMode")}`,
    `tags=${tag || ""}`,
    `nouns=${noun || ""}`,
    `limit=${GLOBAL_INTMAX}`,
    `hparams=${params.get("hparams") || ""}`,
    `offset=0`,
    `sharedIds=${router.query.id}&isSlideshow=true`,
  ];

  console.log(Slideshow.open, ids.length);
  const {
    data: fData,
    error,
    isLoading,
  } = useSWR<SearchImageResult>(
    Slideshow.open ? `/search/images?${queryGenerator(qt)}` : null,
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
    console.log(fData, fetchedData);
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
