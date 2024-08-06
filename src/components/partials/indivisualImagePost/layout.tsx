import { Box, Container, Divider, Grid, GridItem } from "@chakra-ui/react";
import Carousel from "./slider";

export const IndivisualImagePostLayout = () => {
  return (
    <Container maxW="container.xl" my={8}>
      <Grid templateColumns={"repeat(12, 1fr)"} gap={4}>
        <GridItem colSpan={{ sm: 12, md: 8, lg: 9 }}>
          <Carousel />
        </GridItem>
        <GridItem colSpan={{ sm: 12, md: 4, lg: 3 }}>
          <Box>test</Box>
        </GridItem>
      </Grid>
      <Divider my={4} />
      <div className="clear" />
    </Container>
  );
};
