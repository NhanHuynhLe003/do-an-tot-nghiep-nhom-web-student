import { Stack } from "@mui/material";
import React from "react";
import TrashSelectedRowsButton from "./TrashSelectedRowsButton";
import ITableCustomPagination from "./ITableCustomPagination";

export default function CustomFooterTable() {
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      m={2}
      width={"100%"}
    >
      <TrashSelectedRowsButton></TrashSelectedRowsButton>
      <ITableCustomPagination></ITableCustomPagination>
    </Stack>
  );
}
