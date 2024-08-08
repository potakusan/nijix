import { fetcher } from "@/_frontend/fetch";
import { Wrapper } from "@/components/common/wrapper";
import { SearchImageResult } from "@/types/api/search/images";
import {
  Box,
  Button,
  Container,
  Heading,
  Skeleton,
  Stack,
  Text,
  Image,
  Card,
  Link,
  Divider,
} from "@chakra-ui/react";
import RLink from "next/link";
import useSWR from "swr";
import Slider from "react-slick";
import { FC, useMemo } from "react";
import SearchInput from "@/components/partials/searchInput";

export default function Home() {
  const Slider1 = useMemo(() => <TopSlider />, []);
  return (
    <Wrapper>
      <>
        <Container maxW={"3xl"}>
          <Stack
            as={Box}
            textAlign={"center"}
            spacing={{ base: 8, md: 14 }}
            py={{ base: 10, md: 24 }}
          >
            <Heading
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
              lineHeight={"110%"}
            >
              Discover <br />
              <Text as={"span"} color={"teal.400"}>
                fap materials
              </Text>
            </Heading>
            <Heading size="md">
              XなどにアップロードされたイラストをAIでタグ付けして横断検索できます。
            </Heading>
            <Text fontSize="sm">
              *イラストはすべて引用形式で掲載しており、作者が削除すると自動的に非表示になります。
            </Text>
            <Text color={"gray.500"}></Text>
            <Stack
              direction={"column"}
              spacing={3}
              align={"center"}
              alignSelf={"center"}
              position={"relative"}
            >
              <Button
                as={Link}
                href="/search/_/_/1"
                colorScheme={"green"}
                bg={"green.400"}
                rounded={"full"}
                px={6}
                _hover={{
                  bg: "green.500",
                }}
              >
                Start explore
              </Button>
            </Stack>
            <Divider />
            <SearchInput />
          </Stack>
        </Container>
        {Slider1}
      </>
    </Wrapper>
  );
}

export const TopSlider: FC<{ component?: "a" }> = ({ component }) => {
  const { data, error, isLoading } = useSWR<SearchImageResult>(
    `/search/images?sort=top&aiMode=2&limit=40&offset=0`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );
  if (error) return null;
  return (
    <Slider
      slidesToShow={6}
      slidesToScroll={3}
      responsive={[
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
          },
        },
      ]}
      adaptiveHeight={true}
      variableWidth={false}
      autoplay={true}
      pauseOnHover={false}
      autoplaySpeed={5000}
      speed={5000}
      arrows={false}
      cssEase="linear"
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
                  <Card sx={{ height: "350px", width: "auto" }}></Card>
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
                  <Link as={component || RLink} href={`/image/${item.id}`}>
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
                        height="350px"
                        objectFit={"cover"}
                      />
                    </Card>
                  </Link>
                </Box>
              </Box>
            );
          })}
    </Slider>
  );
};
