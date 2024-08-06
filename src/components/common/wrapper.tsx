import Head from "next/head";
import Header from "./header";
import Footer from "./footer";
import { FC } from "react";

export const Wrapper: FC<{ children: any }> = ({ children }) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
);
