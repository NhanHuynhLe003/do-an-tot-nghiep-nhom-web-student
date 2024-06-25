import { Pagination } from "@mui/material";
import React from "react";

export default function IPagination({
  totalPage = 10,
  currentPage = 1,
  numOfPageHeadAndTail = 2,
  getPage = (page) => console.log("Current Page:", page),
  size = "medium",
  props,
}) {
  return (
    <Pagination
      size={size}
      onChange={(event, newPage) => {
        getPage(newPage);
      }}
      count={totalPage}
      defaultPage={currentPage}
      boundaryCount={numOfPageHeadAndTail}
      {...props}
    />
  );
}
