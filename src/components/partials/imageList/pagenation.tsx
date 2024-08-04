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

export const PagingWrapper: FC = () => {
  const router = useRouter();
  const { tag, noun } = router.query;
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const { data, error, isLoading } = useSWR<MetaImageResult>(
    tag && noun ? `/meta/images?tags=${tag}&nouns=${noun}` : null,
    fetcher
  );
  const {
    data: listBody,
    error: listError,
    isLoading: listLoading,
  } = useSWR<SearchImageResult>(
    tag && noun && currentPage
      ? `/search/images?sort=added_at,desc&tags=${tag}&nouns=${noun}&limit=${GLOBAL_ITEM_NUMBERS_PER_PAGE}&offset=${
          (Number(currentPage || 1) - 1) * GLOBAL_ITEM_NUMBERS_PER_PAGE
        }`
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
}> = ({ data, currentPage, setCurrentPage, listLoading }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pages = Math.ceil(
    (data?.body || GLOBAL_ITEM_NUMBERS_PER_PAGE) / GLOBAL_ITEM_NUMBERS_PER_PAGE
  );
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
            `/search/${router.query.tag}/${router.query.noun}/${String(
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
