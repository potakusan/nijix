import { Footer } from "@/components/common/footer";
import Header from "@/components/common/header";
import { PagingWrapper } from "@/components/partials/imageList/pagenation";
import { ConditionsSelector } from "@/components/partials/tagList/oneSelector";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const params = useSearchParams();
  const { tag, noun } = router.query;

  const pathGenerator = (type: "tag" | "noun", input: string) => {
    return `/search/${type === "tag" ? input : "_"}/${
      type === "noun" ? input : "_"
    }/1?${params.toString()}`;
  };

  const fil = (str: string) =>
    str
      .replace(/_/g, "")
      .split(",")
      .filter((item) => item !== "");
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        <Stack
          as={Box}
          sx={{
            borderBottom: "1px solid #ddd",
            background: useColorModeValue("gray.800", "gray.800"),
            color: "#fff",
          }}
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 12, md: 8, lg: 12, xl: 20 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", md: "4xl" }}
            lineHeight={"110%"}
          >
            {router.isReady && (
              <>
                {fil(tag as string).map((item, i) => {
                  const path = pathGenerator("tag", item);
                  return (
                    <>
                      <Link
                        key={item}
                        href={path}
                        color="blue.200"
                        textDecoration={"underline"}
                      >
                        {item}
                      </Link>
                      {i !== fil(tag as string).length - 1 && <>・</>}
                    </>
                  );
                })}
                {fil(tag as string).length > 0 &&
                  fil(noun as string).length > 0 && <>・</>}
                {fil(noun as string).map((item, i) => {
                  const path = pathGenerator("noun", item);
                  return (
                    <>
                      <Link
                        key={item}
                        href={path}
                        color="blue.200"
                        textDecoration={"underline"}
                      >
                        {item}
                      </Link>
                      {i !== fil(noun as string).length - 1 && <>・</>}
                    </>
                  );
                })}
                {fil(tag as string).length === 0 &&
                fil(noun as string).length === 0 ? (
                  <>50万枚以上のえっちなイラストを探索する</>
                ) : (
                  <>のイラスト</>
                )}
              </>
            )}
          </Heading>
        </Stack>
        <Grid h="200px" templateColumns={"repeat(12, 1fr)"} gap={4}>
          <GridItem colSpan={{ sm: 12, md: 3, lg: 2 }}>
            <ConditionsSelector />
          </GridItem>
          <GridItem colSpan={{ sm: 12, md: 9, lg: 10 }}>
            <PagingWrapper />
          </GridItem>
        </Grid>
      </main>
    </>
  );
}
