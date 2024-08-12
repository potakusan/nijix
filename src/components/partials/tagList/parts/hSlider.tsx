import { HParams } from "@/types/api/search/images";
import { Box, Checkbox, Heading, HStack } from "@chakra-ui/react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { FC } from "react";
import { GLOBAL_ITEM_NUMBERS_PER_PAGE } from "../../../../../_config/config";
import useSWR from "swr";
import { HParamExplorerResult } from "@/types/api/hparams";
import { queryGenerator } from "@/_frontend/queryGenerator";
import { fetcher } from "@/_frontend/fetch";

export const HSlider: FC<{ artist?: string; favourite?: string[] }> = ({
  artist,
  favourite,
}) => {
  const router = useRouter();
  const params = useSearchParams();
  const { tag, noun } = router.query;
  const current = params.get("hparams")
    ? decodeURI(params.get("hparams") || "")
        .split(",")
        .reduce((group: string[], item) => {
          if (!group) group = [];
          group.push(item);
          return group;
        }, [])
    : ["general", "sensitive", "questionable", "explicit"];

  const qt = [
    `sort=${params.get("sort") || "created_at,desc"}`,
    `aiMode=${params.get("aiMode")}`,
    `tags=${tag || ""}`,
    `nouns=${noun || ""}`,
    `limit=${GLOBAL_ITEM_NUMBERS_PER_PAGE}`,
  ];
  if (artist) qt.push(`authorId=${artist}`);
  if (favourite) qt.push(`favs=${favourite.join(",")}`);

  const { data, error, isLoading } = useSWR<HParamExplorerResult>(
    (tag && noun) || artist ? `/hparams/explore?${queryGenerator(qt)}` : null,
    fetcher
  );

  const displays: { [key in HParams]: string } = {
    general: "全年齢",
    sensitive: "R-12",
    questionable: "R-15",
    explicit: "R-18",
  };
  return (
    <Box>
      <Heading size="sm" as="p" sx={{ marginBottom: "8px" }}>
        エッチフィルター
      </Heading>
      <HStack wrap="wrap">
        {(
          ["general", "sensitive", "questionable", "explicit"] as HParams[]
        ).map((item) => {
          return (
            <Checkbox
              key={item}
              sx={{ width: "100%" }}
              isChecked={current.indexOf(item) > -1}
              value={item}
              onChange={() => {
                let c = new Array().concat(current);
                if (current.indexOf(item) > -1) {
                  c = c.filter((_) => item != _);
                } else {
                  c.push(item);
                }
                router.push(
                  `/${
                    artist
                      ? `artist/${artist}`
                      : favourite
                      ? `favourite`
                      : `search`
                  }/${tag}/${noun}/1${getUpdatedSearchParams(params, {
                    key: "hparams",
                    value: c.join(","),
                  })}`
                );
              }}
            >
              {displays[item]}
              {(isLoading || !data) && <>(...)</>}
              {!isLoading && data && <>({data.body[item + "Count"]})</>}
            </Checkbox>
          );
        })}
      </HStack>
    </Box>
  );
};

export const getUpdatedSearchParams = (
  params: ReadonlyURLSearchParams,
  newData: {
    key: string;
    value: string | number;
  }
) => {
  const current = new URLSearchParams(params.toString());
  current.set(newData.key, newData.value.toString());

  const search = current.toString();
  const query = search ? `?${search}` : "";

  return query;
};
