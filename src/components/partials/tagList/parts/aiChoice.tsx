import { Box, Button, ButtonGroup, Heading } from "@chakra-ui/react";
import Link from "next/link";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

export const AIChoice = () => {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.has("aiMode") ? Number(params.get("aiMode")) : 2;
  const buttons = [
    {
      value: 2,
      text: "全て表示",
    },
    {
      value: 0,
      text: "表示しない",
    },
    {
      value: 1,
      text: "AIのみ",
    },
  ];
  return (
    <Box>
      <Heading size="sm" as="p" sx={{ marginBottom: "8px" }}>
        AIフィルター
      </Heading>
      <ButtonGroup size="sm" isAttached variant="outline">
        {buttons.map((item) => (
          <Button
            href={
              `/search/${router.query.tag}/${router.query.noun}/${router.query.page}` +
              getUpdatedSearchParams(params, {
                key: "aiMode",
                value: item.value,
              })
            }
            as={Link}
            key={item.value}
            colorScheme="teal"
            variant={current === item.value ? "solid" : "outline"}
          >
            {item.text}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export const getUpdatedSearchParams = (
  params: ReadonlyURLSearchParams,
  newData: {
    key: string;
    value: number;
  }
) => {
  const current = new URLSearchParams(params.toString());
  current.set(newData.key, newData.value.toString());

  const search = current.toString();
  const query = search ? `?${search}` : "";

  return query;
};
