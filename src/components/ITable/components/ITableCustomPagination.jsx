import MuiPagination from "@mui/material/Pagination";
import IPagination from "../../IPagination";
import { useContext, useEffect, useState } from "react";
import { IPaginationTableCustomContext } from "../ITable";

function ICustomPagination({ page, onPageChange, className }) {
  return (
    <MuiPagination
      color="primary"
      className={className}
      //   count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event, newPage - 1);
      }}
    />
  );
}

export default function ITableCustomPagination() {
  const { pagePagination, setPagePagination } = useContext(
    IPaginationTableCustomContext
  );

  return (
    <IPagination
      pageValueControl={pagePagination.page}
      size="small"
      currentPage={1}
      totalPage={pagePagination.customTotalPageSize}
      siblingCount={3}
      numOfPageHeadAndTail={1}
      getPage={(page) => {
        setPagePagination({ ...pagePagination, page: page });
      }}
    />
  );
}
