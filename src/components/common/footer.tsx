import { Box, Container, Divider, HStack, Link, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import RLink from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const router = useRouter();
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    if (router.isReady) {
      setHref(router.asPath);
    }
  }, [router.isReady, router.asPath]);
  const removeParams = (url: string) => url.replace(/\?.*?$/g, "");

  return (
    <footer>
      <Box style={{ textAlign: "center" }} my={12}>
        {href?.match(/\/search\/|\/artist\//) && (
          <Container maxW={"md"}>
            <HStack padding={4} justifyContent={"space-around"}>
              <Link
                as={RLink}
                href={`${removeParams(router.asPath)}?hparams=general`}
              >
                全年齢
              </Link>
              <Link
                as={RLink}
                href={`${removeParams(router.asPath)}?hparams=sensitive`}
              >
                R-12
              </Link>
              <Link
                as={RLink}
                href={`${removeParams(router.asPath)}?hparams=questionable`}
              >
                R-15
              </Link>
              <Link
                as={RLink}
                href={`${removeParams(router.asPath)}?hparams=explicit`}
              >
                R-18
              </Link>
            </HStack>
            <Divider my={4} />
          </Container>
        )}
        <Text>nyaa.ltd</Text>
        <Text fontSize="xs" mt={4}>
          All images are the copyright of their original creators.
          <br />
          Thus nyaa.ltd does not hold any rights.
        </Text>

        <Text fontSize="xs" mt={1}>
          All images are automatically collected.
          <br />
          If you wish to stop crawling please contact abuse@nyaa.ltd.
        </Text>
      </Box>
    </footer>
  );
}
