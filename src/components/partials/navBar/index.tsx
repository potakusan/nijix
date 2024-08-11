import { DeleteIcon, HamburgerIcon, StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SlideFade,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

export const NavBarButton: FC<{
  _artist?: string;
  hideFavourite?: boolean;
}> = ({ _artist, hideFavourite }) => {
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: isResetOpen, onToggle: onResetToggle } = useDisclosure();
  const router = useRouter();
  return (
    <Box position="fixed" bottom="2" right="2">
      <VStack>
        {!hideFavourite && (
          <SlideFade in={isOpen} offsetY="500px">
            <Tooltip label="お気に入り" placement="left">
              <IconButton
                aria-label="favourite"
                icon={<StarIcon />}
                onClick={() => {
                  router.push("/favourite/_/_/1");
                  onToggle();
                }}
              />
            </Tooltip>
          </SlideFade>
        )}
        <SlideFade in={isOpen} offsetY="500px">
          <Tooltip label="検索条件リセット" placement="left">
            <IconButton
              aria-label="reset"
              icon={<DeleteIcon />}
              onClick={() => {
                onResetToggle();
                onToggle();
              }}
            />
          </Tooltip>
        </SlideFade>
        <SlideFade in={isOpen} offsetY="500px">
          <Tooltip label="スライドショー開始" placement="left">
            <IconButton aria-label="slideshow" icon={<SlideShowIcon />} />
          </Tooltip>
        </SlideFade>

        <Tooltip label="操作" placement="left">
          <IconButton
            onClick={onToggle}
            aria-label="control"
            icon={<HamburgerIcon />}
          />
        </Tooltip>
      </VStack>
      <ResetModal
        _artist={_artist}
        isOpen={isResetOpen}
        onResetToggle={onResetToggle}
      />
    </Box>
  );
};

const ResetModal: FC<{
  _artist?: string;
  isOpen: boolean;
  onResetToggle: () => void;
}> = ({ isOpen, onResetToggle, _artist }) => {
  const router = useRouter();

  return (
    <Modal isOpen={isOpen} onClose={onResetToggle}>
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader>検索条件リセット</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          現在適用されている検索条件をすべてリセットします。よろしいですか？
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            href={`/${_artist ? "artist/" + _artist : "search"}/_/_/1`}
            as={Link}
            onClick={() => {
              onResetToggle();
            }}
          >
            OK
          </Button>
          <Button variant="ghost" onClick={onResetToggle}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const SlideShowIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13 17V20H18V22H6V20H11V17H4C3.44772 17 3 16.5523 3 16V4H2V2H22V4H21V16C21 16.5523 20.5523 17 20 17H13ZM10 6V13L15 9.5L10 6Z"></path>
  </svg>
);
