import { textConverts } from "@/_frontend/convert";
import { generateOriginalUrl } from "@/_frontend/generateOriginalUrl";
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
  Link as RLink,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Skeleton,
} from "@chakra-ui/react";
import Link from "next/link";
import { FC, useState } from "react";

export const ImageCardSkeleton = () => (
  <Card sx={{ width: "100%", maxWidth: "400px" }}>
    <CardBody sx={{ paddingBottom: "4px" }}>
      <Skeleton height="500px" />
      <Stack mt="6" spacing="3">
        <Heading size="md">
          <Skeleton>&nbsp;</Skeleton>
        </Heading>
        <Text as={"div"}>
          <Skeleton>&nbsp;</Skeleton>
        </Text>
      </Stack>
    </CardBody>
    <CardFooter sx={{ padding: 0 }}>
      <ButtonGroup
        isAttached
        spacing="1"
        sx={{ marginTop: "8px", width: "100%" }}
      >
        <Skeleton sx={{ width: "100%" }}>
          <Button
            as={"a"}
            target="_blank"
            disabled
            variant="outline"
            colorScheme="facebook"
            sx={{
              width: "100%",
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }}
          ></Button>
        </Skeleton>
      </ButtonGroup>
    </CardFooter>
  </Card>
);

export const ImageCard: FC<ImageResultSet> = (props) => {
  const maxLen = 14;
  const { croppedText, withoutURL } = textConverts(props.text, {
    maxLength: maxLen,
    removeURL: true,
  });
  const [unavailable, setUnavailable] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(withoutURL.length < maxLen);
  const href = unavailable ? "#" : `/image/${props.id}`;
  const originalURL = generateOriginalUrl(props);
  return (
    <Card sx={{ width: "100%", maxWidth: "400px" }}>
      <CardBody sx={{ paddingBottom: "4px" }}>
        <Link href={href}>
          {!unavailable && (
            <Image
              sx={{
                objectFit: "cover",
                margin: "0 auto",
              }}
              onError={(e) => {
                if (e.currentTarget.src === props.backup_saved_url) {
                  setUnavailable(true);
                } else {
                  if (props.backup_saved_url) {
                    e.currentTarget.src = props.backup_saved_url;
                  } else {
                    setUnavailable(true);
                  }
                }
              }}
              width={"100%"}
              height={500}
              src={props.px_thumb || props.url}
              alt={props.text}
              borderRadius="lg"
            />
          )}
          {unavailable && (
            <Alert
              status="error"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="500"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                UNAVAILABLE
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                この投稿は作者によって削除されたか、非公開状態のため利用できません。
              </AlertDescription>
            </Alert>
          )}
        </Link>
        <Stack mt="6" spacing="3">
          <Heading size="md">
            <Link href={`/artist/` + props.author_id}>{props.username}</Link>
          </Heading>
          <Text>
            {!showAll ? croppedText : withoutURL}
            {!showAll && (
              <RLink
                onClick={() => setShowAll(true)}
                style={{ textDecoration: "underline", marginLeft: "5px" }}
                color="teal.500"
              >
                全て表示
              </RLink>
            )}
          </Text>
        </Stack>
      </CardBody>
      <CardFooter sx={{ padding: 0 }}>
        <ButtonGroup
          isAttached
          spacing="1"
          sx={{ marginTop: "8px", width: "100%" }}
        >
          <Button
            as={"a"}
            target="_blank"
            href={originalURL}
            variant="outline"
            colorScheme="facebook"
            sx={{ width: "33%", borderTopLeftRadius: 0 }}
          >
            ソース
          </Button>
          <Button
            href={href}
            as={"a"}
            variant="solid"
            colorScheme="facebook"
            sx={{ width: "33%" }}
          >
            詳細
          </Button>
          <Button
            as="a"
            href={`/similarTo/${props.id}`}
            variant="outline"
            colorScheme="facebook"
            sx={{ width: "34%", borderTopRightRadius: 0 }}
          >
            類似
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};
