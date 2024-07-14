import { Stack } from "@mui/material";
import React from "react";
import TrashSelectedRowsButton from "./TrashSelectedRowsButton";
import ITableCustomPagination from "./ITableCustomPagination";

export default function CustomFooterTable({
  isShowPagination = true,
  isShowTrashButton = true,
}) {
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      m={2}
      width={"100%"}
    >
      {isShowTrashButton && <TrashSelectedRowsButton></TrashSelectedRowsButton>}
      {isShowPagination && <ITableCustomPagination></ITableCustomPagination>}
    </Stack>
  );
}
