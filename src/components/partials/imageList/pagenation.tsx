"use client";

import { FC, useState } from "react";
import { Box, Button, Center, HStack, Link } from "@chakra-ui/react";
import useSWR from "swr";
import { MetaImageResult } from "@/types/api/meta/images";
import { fetcher } from "@/_frontend/fetch";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export const PagingWrapper: FC<{ children: any }> = ({ children }) => {
  const { data, error, isLoading } = useSWR<MetaImageResult>(
    "/meta/images?sort=added_at,desc",
    fetcher
  );
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(
    Number(router.query.page)
  );

  const Pager = (
    <>
      {!error && !isLoading && data && (
        <PagingComponent
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          data={data}
        />
      )}
      {isLoading && <>Loading</>}
    </>
  );

  return (
    <>
      {Pager}
      {children}
      {Pager}
    </>
  );
};

const PagingComponent: FC<{
  data: MetaImageResult;
  currentPage: number;
  setCurrentPage: (e: number) => void;
}> = ({ data, currentPage, setCurrentPage }) => {
  const router = useRouter();
  const pages = Math.ceil((data?.body || 18) / 18);
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
        height: "100%",
      }}
    >
      <ReactPaginate
        forcePage={currentPage}
        activeClassName={"item active "}
        breakClassName={"item break-me "}
        breakLabel={"..."}
        containerClassName={"pagination"}
        disabledClassName={"disabled-page"}
        marginPagesDisplayed={2}
        nextClassName={"item next "}
        nextLabel={<ChevronRightIcon w={8} h={8} />}
        onPageChange={(e) => {
          router.push({
            pathname: "/search/[tag]/[noun]/[page]",
            query: {
              tag: router.query.tag,
              noun: router.query.noun,
              page: String(e.selected + 1),
            },
          });
          setCurrentPage(e.selected);
        }}
        pageCount={pages}
        pageClassName={"item pagination-page "}
        pageRangeDisplayed={2}
        previousClassName={"item previous"}
        previousLabel={<ChevronLeftIcon w={8} h={8} />}
      />
    </div>
  );
};
