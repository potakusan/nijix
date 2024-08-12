import { getFavsList } from "@/_frontend/genFavsList";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
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
import { FC, useEffect, useState } from "react";
import { GLOBAL_BASEURL } from "../../../../_config/config";

export const ShareModal: FC<{
  _artist?: string;
  isOpen: boolean;
  onShareToggle: () => void;
}> = ({ isOpen, onShareToggle, _artist }) => {
  const [id, setId] = useState<string>("");
  const router = useRouter();

  const loader = async () => {
    const ids = getFavsList();
    const f = await fetch("/api/favourite/add", {
      method: "POST",
      body: JSON.stringify({ ids: ids }),
    });
    const js = await f.json();
    return setId(js.body.id);
  };

  useEffect(() => {
    if (router.isReady) {
      loader();
    }
  }, [router.isReady]);

  return (
    <Modal isOpen={isOpen} size="xl" onClose={onShareToggle}>
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader>シェア</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            このURLをシェアすることで、お気に入りを他の人に共有できます。
            <br />
            お気に入り画面から読み込むことで、他の端末へお気に入り状態を共有することもできます。
          </Box>
          <InputGroup mt={4} size="md">
            <Input
              pr="4.5rem"
              readOnly
              value={GLOBAL_BASEURL + "f/" + id}
              placeholder="https://nyaa.ltd/f/"
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => null}
                variant="solid"
                colorScheme="facebook"
              >
                コピー
              </Button>
            </InputRightElement>
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onShareToggle}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
