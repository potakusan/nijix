"use client";

import { fetcher } from "@/_frontend/fetch";
import { SearchImageResult } from "@/types/api/search/images";
import { FC } from "react";
import useSWR from "swr";
import { ImageCard } from "./card";
import { SimpleGrid } from "@chakra-ui/react";
import { useRouter } from "next/router";

export const ImageList: FC<{}> = () => {
  const router = useRouter();
  const { tag, noun, page } = router.query;
  const { data, error, isLoading } = useSWR<SearchImageResult>(
    `/search/images?sort=added_at,desc&tags=${tag}&nouns=${noun}&limit=18&offset=${
      (Number(page || 1) - 1) * 18 + 1
    }`,
    fetcher
  );

  if (error) return <>Error</>;
  if (isLoading) return <>Loading</>;
  return (
    <SimpleGrid
      columns={[1, 1, 2, 3]}
      spacing="40px"
      sx={{
        "@media screen and (max-width:768px)": {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
      }}
    >
      {data?.body.map((item) => (
        <ImageCard key={item.id} {...item} />
      ))}
    </SimpleGrid>
  );
};
