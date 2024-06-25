import MuiPagination from "@mui/material/Pagination";
import IPagination from "../../IPagination";

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

export default function ITableCustomPagination(props) {
  return (
    <IPagination
      size="small"
      currentPage={1}
      totalPage={10}
      siblingCount={3}
      numOfPageHeadAndTail={1}
    />
  );
}
