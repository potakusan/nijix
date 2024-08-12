import { Box, Button, ButtonGroup, Heading } from "@chakra-ui/react";
import Link from "next/link";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { FC } from "react";

export const AIChoice: FC<{
  artist?: string;
  favourite?: string[];
  sharedId?: string;
}> = ({ artist, favourite, sharedId }) => {
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
      <ButtonGroup
        isAttached
        size="sm"
        variant="outline"
        flexDirection={"column"}
        w="100%"
      >
        {buttons.map((item, i) => (
          <Button
            w="100%"
            href={
              `/${
                sharedId
                  ? `f/${sharedId}`
                  : artist
                  ? `artist/${artist}`
                  : favourite
                  ? `favourite`
                  : `search`
              }/${router.query.tag}/${router.query.noun}/${router.query.page}` +
              getUpdatedSearchParams(params, {
                key: "aiMode",
                value: item.value,
              })
            }
            sx={{
              borderRadius: 0,
              borderBottomWidth: i === buttons.length - 1 ? "1px" : 0,
            }}
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
