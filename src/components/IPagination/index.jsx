import { Pagination } from "@mui/material";
import React from "react";

export default function IPagination({
  totalPage = 10,
  currentPage = 1,
  numOfPageHeadAndTail = 2,
}) {
  return (
    <Pagination
      count={totalPage}
      defaultPage={currentPage}
      boundaryCount={numOfPageHeadAndTail}
    />
  );
}
