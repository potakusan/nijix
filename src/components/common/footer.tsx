import { Box, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <footer>
      <Box style={{ textAlign: "center" }} my={12}>
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
