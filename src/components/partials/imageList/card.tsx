import { textConverts } from "@/_frontend/convert";
import { generateOriginalUrl } from "@/_frontend/generateOriginalUrl";
import { ImageResultSet } from "@/types/api/search/images";
import { AddIcon, CopyIcon, WarningIcon } from "@chakra-ui/icons";
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
  HStack,
  Tag,
  TagLeftIcon,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { FC, useState } from "react";
import { TagSelectFromImage } from "../tagList/fromImage";

export const ImageCardSkeleton = () => (
  <Card sx={{ width: "100%", maxWidth: "400px" }}>
    <CardBody sx={{ paddingBottom: "4px" }}>
      <Skeleton height="300px" />
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
  const maxLen = 10;
  const { croppedText, withoutURL } = textConverts(props.text, {
    maxLength: maxLen,
    removeURL: true,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

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
              title={props.text}
              alt={props.text}
              sx={{
                objectFit: "cover",
                margin: "0 auto",
                transition: ".2s",
                ":hover": {
                  opacity: "0.8",
                },
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
              height={300}
              src={props.px_thumb || props.url}
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
              height="300"
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
          <HStack
            spacing={1}
            sx={{
              position: "absolute",
              right: "8px",
              top: "10px",
            }}
          >
            {props.ai && (
              <Tag variant="solid" colorScheme="facebook">
                <TagLeftIcon as={WarningIcon} />
                AIイラスト
              </Tag>
            )}
            {props.has_images > 1 && (
              <Tag variant="solid" colorScheme="facebook">
                <TagLeftIcon as={CopyIcon} />
                {props.has_images}枚
              </Tag>
            )}
          </HStack>
        </Link>
        <Stack mt="6" spacing="3">
          <Heading size="md">
            <Link href={`/artist/` + props.author_id + `/_/_/1`}>
              {props.username}
            </Link>
          </Heading>
          <Text fontSize="xs">
            {!showAll ? croppedText : withoutURL}
            {!showAll && (
              <RLink
                onClick={() => setShowAll(true)}
                style={{ textDecoration: "underline", marginLeft: "5px" }}
                color="teal.500"
              >
                表示
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
            as={Link}
            target="_blank"
            href={originalURL}
            variant="outline"
            colorScheme="facebook"
            sx={{ borderTopLeftRadius: 0, width: "40%" }}
          >
            ソース
          </Button>
          <Button
            isDisabled={unavailable}
            href={href}
            as={Link}
            variant="outline"
            colorScheme="facebook"
            sx={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              width: "40%",
            }}
          >
            詳細
          </Button>
          <Button
            onClick={onOpen}
            isDisabled={unavailable}
            variant="solid"
            colorScheme="facebook"
            sx={{
              borderTopRightRadius: 0,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              width: "20%",
            }}
          >
            <Tooltip
              label="このイラストに登録されたタグを絞り込み条件に追加します"
              fontSize="md"
            >
              <AddIcon />
            </Tooltip>
          </Button>
        </ButtonGroup>
        {isOpen && (
          <TagSelectFromImage isOpen={isOpen} onClose={onClose} id={props.id} />
        )}
      </CardFooter>
    </Card>
  );
};
