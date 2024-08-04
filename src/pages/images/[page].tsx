import { Footer } from "@/components/common/footer";
import Header from "@/components/common/header";
import { ImageList } from "@/components/partials/imageList/list";
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
        <ImageList />
      </main>
    </>
  );
}
