import { Search } from "@mui/icons-material";
import { Box, Button, Input, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import SubmitDialog from "../../../../components/IDialog/SubmitDialog";
import ITable from "../../../../components/ITable/ITable";
import {
  trashDataListBooks,
  trashHeaderListBooks,
} from "../../../../data/arrays";
import IBreadcrumbs from "../../../../components/IBreadcrumbs";
export default function BookTrashPage() {
  const [listRowSelected, setListRowSelected] = useState([]);

  //=============fnc================
  function getListRowSelected(params) {
    console.log("List Row Selected:", params);
    setListRowSelected([...params]);
  }

  function handleClickDeleteAll() {
    console.log("Delete All:", listRowSelected);

    //fetch api delete cac sp da chon bang promise.all co id giống id trong listRowSelected
  }

  function handleClickRestoreAll() {
    console.log("Restore All:", listRowSelected);
  }
  return (
    <Stack id="AdminBookManagePage">
      <IBreadcrumbs
        separator=">"
        listBreadcrumbs={[
          {
            id: 1,
            path: "/admin/book-manage",
            name: "Quản lý sách",
          },
          {
            id: 2,
            path: "/admin/book-manage/trash",
            name: "Thùng rác",
          },
        ]}
        sx={{ pl: 4, pt: 2 }}
      ></IBreadcrumbs>
      <Typography component="h1" variant="h4" fontWeight={500} pl={4} pt={2}>
        Thùng Rác
      </Typography>

      <Stack
        px={4}
        pt={2}
        direction={"row"}
        flexWrap={"wrap"}
        justifyContent={"space-between"}
      >
        <Box mb={3} width={"20rem"}>
          <Input
            endAdornment={<Search></Search>}
            placeholder="Tìm kiếm sách...."
            fullWidth
          ></Input>
        </Box>

        <Stack direction={"row"} justifyContent={"right"} gap={2} mb={3}>
          {listRowSelected.length > 1 && (
            <>
              <SubmitDialog
                buttonShowInfo={{
                  variant: "contained",
                  color: "error",
                  title: "Xóa Sách Đã Chọn",
                }}
                dialogInfo={{
                  contentDialogTitle: "Xác nhận xóa tất cả",
                  contentDialogDesc:
                    "Bạn có chắc chắn xóa tất cả sách đã chọn chứ",
                }}
                fncHandleClickAccept={handleClickDeleteAll}
              ></SubmitDialog>

              <SubmitDialog
                buttonShowInfo={{
                  variant: "contained",
                  color: "success",
                  title: "Khôi Phục Sách Đã Chọn",
                }}
                dialogInfo={{
                  contentDialogTitle: "Xác nhận khôi phục sách đã chọn",
                  contentDialogDesc:
                    "Bạn có chắc chắn khôi phục các quyển sách đã chọn chứ",
                }}
                fncHandleClickAccept={handleClickRestoreAll}
              ></SubmitDialog>
            </>
          )}
        </Stack>
      </Stack>

      <Box
        sx={{
          width: "100%",
          px: 4,
          py: 2,
          height: "65vh",
        }}
      >
        <ITable
          fncGetListRowSelected={getListRowSelected}
          dataList={trashDataListBooks}
          headerList={trashHeaderListBooks}
        ></ITable>
      </Box>
    </Stack>
  );
}
