import { Pagination } from "@mui/material";
import React, { useEffect } from "react";

export default function IPagination({
  totalPage = 10,
  currentPage = 1,
  numOfPageHeadAndTail = 2,
  getPage = (page) => console.log("Current Page:", page),
  size = "medium",
  props,
  pageValueControl, //Kết hợp với context

  getPageNotControl = (page) => console.log("Current Page:", page),
}) {
  const [page, setPage] = React.useState(currentPage);
  return (
    <Pagination
      size={size}
      onChange={(event, newPage) => {
        setPage(newPage);
        getPageNotControl(newPage);

        //MUI Control có thể gây ra lỗi do đó ta phải check
        pageValueControl && getPage(newPage);
      }}
      page={pageValueControl ? pageValueControl : page}
      count={totalPage}
      defaultPage={currentPage}
      boundaryCount={numOfPageHeadAndTail}
      {...props}
    />
  );
}
