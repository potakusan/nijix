import { NextPage } from "next";
import Router from "next/router";

const REDIRECT_URL = "/search/_/_/1";

const RedirectPage: NextPage = () => {
  return null;
};

RedirectPage.getInitialProps = async ({ res }) => {
  if (!res) {
    return [];
  }
  if (typeof window === "undefined") {
    res.writeHead(302, { Location: REDIRECT_URL });
    res.end();

    return {};
  }

  Router.push(REDIRECT_URL);

  return {};
};

export default RedirectPage;
