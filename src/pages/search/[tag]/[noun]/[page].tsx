import { Wrapper } from "@/components/common/wrapper";
import { PagingWrapper } from "@/components/partials/imageList/pagenation";
import { ConditionsSelector } from "@/components/partials/tagList/oneSelector";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Link,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { FC } from "react";

export default function SearchByTagAndNouns() {
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
    <Wrapper>
      <PageHead>
        <Heading
          fontWeight={600}
          p={4}
          fontSize={{ base: "2xl", sm: "4xl", md: "4xl" }}
          lineHeight={"110%"}
        >
          {router.isReady ? (
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
          ) : (
            <>&nbsp;</>
          )}
        </Heading>
      </PageHead>
      <Container maxW={"8xl"} my={{ base: 0, md: 8 }}>
        <Grid templateColumns={"repeat(12, 1fr)"} gap={4}>
          <GridItem colSpan={{ base: 12, sm: 12, md: 3, lg: 2 }}>
            <ConditionsSelector />
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 12, md: 9, lg: 10 }}>
            <PagingWrapper />
          </GridItem>
        </Grid>
      </Container>
    </Wrapper>
  );
}

export const PageHead: FC<{ children: any }> = ({ children }) => {
  return (
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
      {children}
    </Stack>
  );
};
