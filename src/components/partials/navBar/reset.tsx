import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

export const ResetModal: FC<{
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
