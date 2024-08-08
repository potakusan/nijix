import { fetcher } from "@/_frontend/fetch";
import { TagSuggesterResult } from "@/types/api/tags/explore";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  FormControl,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

function SearchInput() {
  const [text, setText] = useState<string>("");
  const [debouncedText, setDebouncedText] = useState<string>("");

  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (value: string) => {
    setText(value);

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      setDebouncedText(value);
    }, 320);
  };

  const { data, error, isLoading } = useSWR<TagSuggesterResult>(
    debouncedText ? `/tags/suggest?text=${debouncedText}` : null,
    fetcher
  );

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  const router = useRouter();
  return (
    <Flex justify="center" align="center" w="full">
      <FormControl>
        <AutoComplete
          emptyState
          openOnFocus
          disableFilter
          suggestWhenEmpty
          isLoading={isLoading}
        >
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.600" />
            </InputLeftElement>
            <AutoCompleteInput
              autoComplete="off"
              onChange={(e) => handleChange(e.target.value)}
              value={text}
              placeholder="Search Materials"
              variant="filled"
            />
          </InputGroup>
          <AutoCompleteList>
            {data && data.body.length > 0 ? (
              data.body.map((item, i) => (
                <AutoCompleteItem
                  key={`option-${item.tag + item.variant}`}
                  value={item.tag}
                  _selected={{ bg: "whiteAlpha.50" }}
                  _focus={{ bg: "whiteAlpha.100" }}
                  onClick={() =>
                    router.push(
                      `/search/${item.variant === "tag" ? item.tag : "_"}/${
                        item.variant === "noun" ? item.tag : "_"
                      }/1`
                    )
                  }
                >
                  {item.variant === "tag" && <HashTagIcon />}
                  {item.variant === "noun" && <AtMarkIcon />}
                  <Text ml={2}>
                    {item.tag}({item.num})
                  </Text>
                </AutoCompleteItem>
              ))
            ) : (
              <AutoCompleteItem disabled value={false}>
                Search by hashtag or character name, including furigana!
              </AutoCompleteItem>
            )}
            {error && (
              <AutoCompleteItem disabled value={false}>
                Error
              </AutoCompleteItem>
            )}
          </AutoCompleteList>
        </AutoComplete>
      </FormControl>
    </Flex>
  );
}

export default SearchInput;

const HashTagIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 448 512"
    width="14px"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M440.667 182.109l7.143-40c1.313-7.355-4.342-14.109-11.813-14.109h-74.81l14.623-81.891C377.123 38.754 371.468 32 363.997 32h-40.632a12 12 0 0 0-11.813 9.891L296.175 128H197.54l14.623-81.891C213.477 38.754 207.822 32 200.35 32h-40.632a12 12 0 0 0-11.813 9.891L132.528 128H53.432a12 12 0 0 0-11.813 9.891l-7.143 40C33.163 185.246 38.818 192 46.289 192h74.81L98.242 320H19.146a12 12 0 0 0-11.813 9.891l-7.143 40C-1.123 377.246 4.532 384 12.003 384h74.81L72.19 465.891C70.877 473.246 76.532 480 84.003 480h40.632a12 12 0 0 0 11.813-9.891L151.826 384h98.634l-14.623 81.891C234.523 473.246 240.178 480 247.65 480h40.632a12 12 0 0 0 11.813-9.891L315.472 384h79.096a12 12 0 0 0 11.813-9.891l7.143-40c1.313-7.355-4.342-14.109-11.813-14.109h-74.81l22.857-128h79.096a12 12 0 0 0 11.813-9.891zM261.889 320h-98.634l22.857-128h98.634l-22.857 128z"></path>
  </svg>
);

const AtMarkIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    width="14px"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32v80 32c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"></path>
  </svg>
);
