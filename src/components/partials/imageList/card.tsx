import { ImageResultSet } from "@/types/api/search/images";
import {
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
  CardFooter,
  ButtonGroup,
  Button,
  Image,
} from "@chakra-ui/react";
import { FC } from "react";

export const ImageCard: FC<ImageResultSet> = (props) => {
  return (
    <Card maxW="sm">
      <CardBody>
        <Image src={props.url} alt={props.text} borderRadius="lg" />
        <Stack mt="6" spacing="3">
          <Heading size="md">{props.username}</Heading>
          <Text>{props.text}</Text>
        </Stack>
        <ButtonGroup spacing="2" sx={{ marginTop: "8px" }}>
          <Button variant="solid" colorScheme="blue">
            詳細
          </Button>
          <Button variant="ghost" colorScheme="blue">
            シェア
          </Button>
        </ButtonGroup>
      </CardBody>
    </Card>
  );
};
