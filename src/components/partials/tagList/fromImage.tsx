import { fetcher } from "@/_frontend/fetch";
import { generateNewPath } from "@/_frontend/generateNewPath";
import { TagsResultType } from "@/types/api/image/tags";
import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
} from "@chakra-ui/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import useSWR from "swr";
import { SkeletonTagCloud } from "./parts/tagExplorer";

type T = { tag: string; type: "tag" | "noun" };

export const TagSelectFromImage: FC<{
  id?: string;
  isOpen: boolean;
  onClose: () => void;
}> = ({ id, isOpen, onClose }) => {
  const router = useRouter();
  const [current, setCurrent] = useState<T[]>([]);

  useEffect(() => {
    if (router.isReady) {
      const gen = (arr: string[], type: "tag" | "noun") =>
        arr.reduce((group: T[], item) => {
          if (!group) group = [];
          group.push({ tag: item, type: type });
          return group;
        }, []);
      const t = gen(((router.query.tag as string) || "").split(","), "tag");
      const n = gen(((router.query.noun as string) || "").split(","), "noun");
      setCurrent(t.concat(n).filter((item) => item.tag !== "_"));
    }
  }, [router]);

  const { data, error, isLoading } = useSWR<TagsResultType>(
    id ? `/image/tags?id=${id}` : null,
    fetcher
  );

  const isIncluded = (tag: string, type: "tag" | "noun") => {
    return !!current.find((item) => item.tag === tag && item.type === type);
  };
  const changeItem = (tag: string, type: "tag" | "noun") => {
    let c: T[] = new Array().concat(current);
    if (isIncluded(tag, type)) {
      c = c.filter((item) => !(item.tag === tag && item.type === type));
    } else {
      c.push({ tag: tag, type: type });
    }
    return setCurrent(c);
  };
  const gen = (type: "tag" | "noun") => {
    const x = current.reduce((group: string[], item) => {
      if (!group) group = [];
      if (item.type === type) {
        group.push(item.tag);
      }
      return group;
    }, []);
    return x.length === 0 ? "_" : x.join(",");
  };
  const searches = useSearchParams();

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mx={4}>
          <ModalHeader>Choose your favours</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}></ModalBody>
          {error && <>Error</>}
          {isLoading && (
            <HStack flexWrap={"wrap"} spacing={1} px={2}>
              <SkeletonTagCloud withHeader={false} />
            </HStack>
          )}
          {!isLoading && (!data || data.body.tags.length === 0) && <>No Tags</>}
          {!isLoading && data && (
            <HStack flexWrap={"wrap"} spacing={1} px={2}>
              {data.body.tags.length > 0 &&
                data.body.tags.map((item) => (
                  <Tag
                    as={"button"}
                    sx={{ userSelect: "none" }}
                    onClick={() => changeItem(item.tag, "tag")}
                    key={item.tag}
                    variant={isIncluded(item.tag, "tag") ? "solid" : "outline"}
                    colorScheme="facebook"
                  >
                    {item.tag}({item.count})
                  </Tag>
                ))}
              {data.body.nouns.length > 0 &&
                data.body.nouns.map((item) => (
                  <Tag
                    as={"button"}
                    sx={{ userSelect: "none" }}
                    onClick={() => changeItem(item.tag, "noun")}
                    key={item.tag}
                    variant={isIncluded(item.tag, "noun") ? "solid" : "outline"}
                    colorScheme="teal"
                  >
                    {item.tag}({item.count})
                  </Tag>
                ))}
            </HStack>
          )}
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              as={Link}
              onClick={() => onClose()}
              href={generateNewPath(searches, gen("tag"), gen("noun"))}
            >
              Reflect
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
