import { textConverts } from "@/_frontend/convert";
import { ImageResultSet } from "@/types/api/search/images";
import {
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
  ButtonGroup,
  Button,
  Image,
  CardFooter,
  Link,
} from "@chakra-ui/react";
import { FC, useState } from "react";

export const ImageCard: FC<ImageResultSet> = (props) => {
  const maxLen = 14;
  const { croppedText, withoutURL } = textConverts(props.text, {
    maxLength: maxLen,
    removeURL: true,
  });
  const [showAll, setShowAll] = useState<boolean>(withoutURL.length < maxLen);
  return (
    <Card>
      <CardBody sx={{ paddingBottom: "4px" }}>
        <Image
          sx={{
            objectFit: "cover",
            margin: "0 auto",
          }}
          width={"100%"}
          height={500}
          src={props.url}
          alt={props.text}
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{props.username}</Heading>
          <Text>
            {!showAll ? croppedText : withoutURL}
            {!showAll && (
              <Link
                onClick={() => setShowAll(true)}
                sx={{ textDecoration: "underline", marginLeft: "5px" }}
                color="teal.500"
              >
                全て表示
              </Link>
            )}
          </Text>
        </Stack>
      </CardBody>
      <CardFooter sx={{ paddingTop: 0 }}>
        <ButtonGroup spacing="2" sx={{ marginTop: "8px" }}>
          <Button variant="solid" colorScheme="facebook">
            詳細
          </Button>
          <Button variant="outline" colorScheme="facebook">
            シェア
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};
