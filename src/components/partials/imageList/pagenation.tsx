"use client";

import { FC, useEffect, useState } from "react";
import useSWR from "swr";
import { MetaImageResult } from "@/types/api/meta/images";
import { fetcher } from "@/_frontend/fetch";
import { useRouter } from "next/router";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import { ImageList } from "./list";
import { SearchImageResult } from "@/types/api/search/images";
import { GLOBAL_ITEM_NUMBERS_PER_PAGE } from "../../../../_config/config";
import { useSearchParams } from "next/navigation";
import { queryGenerator } from "@/_frontend/queryGenerator";
import { Box } from "@chakra-ui/react";

export const PagingWrapper: FC<{ artist?: string }> = ({ artist }) => {
  const router = useRouter();
  const { tag, noun } = router.query;
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const params = useSearchParams();
  const qs = [
    `tags=${tag || "_"}`,
    `nouns=${noun || "_"}`,
    `aiMode=${params.get("aiMode")}`,
    `hparams=${params.get("hparams") || ""}`,
  ];
  if (artist) qs.push(`authorId=${artist}`);
  const { data, error, isLoading } = useSWR<MetaImageResult>(
    (tag && noun) || artist ? `/meta/images?${queryGenerator(qs)}` : null,
    fetcher
  );

  const qt = [
    `sort=${params.get("sort") || "created_at,desc"}`,
    `aiMode=${params.get("aiMode")}`,
    `tags=${tag || ""}`,
    `nouns=${noun || ""}`,
    `limit=${GLOBAL_ITEM_NUMBERS_PER_PAGE}`,
    `hparams=${params.get("hparams") || ""}`,
    `offset=${(Number(currentPage || 1) - 1) * GLOBAL_ITEM_NUMBERS_PER_PAGE}`,
  ];
  if (artist) qt.push(`authorId=${artist}`);

  const {
    data: listBody,
    error: listError,
    isLoading: listLoading,
  } = useSWR<SearchImageResult>(
    (tag && noun && currentPage) || artist
      ? `/search/images?${queryGenerator(qt)}`
      : null,
    fetcher
  );

  useEffect(() => {
    if (router.isReady) {
      setCurrentPage(Number(router.query.page));
    }
  }, [router.isReady, router.query.page]);

  const Pager = (
    <>
      {!error && !isLoading && data && (
        <PagingComponent
          artist={artist}
          currentPage={currentPage || 1}
          setCurrentPage={setCurrentPage}
          data={data}
          listLoading={listLoading}
        />
      )}
      {isLoading && <PagerSkeleton currentPage={currentPage || 1} />}
    </>
  );

  return (
    <>
      {Pager}
      <ImageList
        listBody={listBody}
        listError={listError}
        listLoading={listLoading}
      />
      {Pager}
    </>
  );
};

const PagingComponent: FC<{
  data: MetaImageResult;
  currentPage: number;
  setCurrentPage: (e: number) => void;
  listLoading: boolean;
  artist?: string;
}> = ({ data, currentPage, setCurrentPage, listLoading, artist }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pages = Math.ceil(
    (data?.body || GLOBAL_ITEM_NUMBERS_PER_PAGE) / GLOBAL_ITEM_NUMBERS_PER_PAGE
  );
  if (!listLoading && data.body === 0) {
    return (
      <Box sx={{ padding: "20px" }}>
        <div style={{ height: "38px" }}>&nbsp;</div>
      </Box>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        boxSizing: "border-box",
        width: "100%",
      }}
      className={listLoading ? "loading" : ""}
    >
      <ResponsivePagination
        current={currentPage}
        total={pages}
        onPageChange={(page) => {
          if (listLoading) return;
          router.push(
            `/${artist ? `artist/${artist}` : `search`}/${
              router.query.tag || "_"
            }/${router.query.noun || "_"}/${String(
              page
            )}?${searchParams.toString()}`
          );
          setCurrentPage(page);
        }}
      />
    </div>
  );
};

const PagerSkeleton: FC<{ currentPage: number }> = ({ currentPage }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <ResponsivePagination
        current={currentPage}
        total={currentPage}
        onPageChange={() => null}
      />
    </div>
  );
};
