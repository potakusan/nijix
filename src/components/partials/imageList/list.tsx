import { fetcher } from "@/frontend/fetch";
import { SearchImageResult } from "@/types/api/search/images";
import { FC, Suspense, useEffect, useState } from "react";
import useSWR from "swr";
import { ImageCard } from "./card";
import { SimpleGrid } from "@chakra-ui/react";

export const ImageList: FC<{}> = (props) => {
  const { data, error, isLoading } = useSWR<SearchImageResult>(
    "/search/images?sort=added_at,desc",
    fetcher
  );

  if (error) return <>Error</>;
  if (isLoading) return <>Loading</>;
  console.log(data);
  return (
    <SimpleGrid columns={[1, 1, 3]} spacing="40px">
      {data?.body.map((item) => (
        <ImageCard key={item.id} {...item} />
      ))}
    </SimpleGrid>
  );
};
