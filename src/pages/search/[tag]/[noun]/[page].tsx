import { Footer } from "@/components/common/footer";
import Header from "@/components/common/header";
import { PagingWrapper } from "@/components/partials/imageList/pagenation";
import { ConditionsSelector } from "@/components/partials/tagList/oneSelector";
import { Grid, GridItem } from "@chakra-ui/react";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
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
