import { Search } from "@mui/icons-material";
import { Box, Button, Input, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import ITable from "../../../components/ITable/ITable";
import { dataListBooks, headerListBooks } from "../../../data/arrays";
import SubmitDialog from "../../../components/IDialog/SubmitDialog";
import { useNavigate } from "react-router-dom";

export default function AdminBookManagePage() {
  // nevigate
  const navigate = useNavigate();

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

  function handleClickCreateBookBtn() {
    navigate("/admin/book-manage/create-book");
  }

  return (
    <Stack id="AdminBookManagePage">
      <Typography component="h1" variant="h4" fontWeight={500} pl={4} pt={2}>
        Kho Sách
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
            <SubmitDialog
              buttonShowInfo={{
                variant: "contained",
                color: "error",
                title: "Xóa Tất Cả",
              }}
              dialogInfo={{
                contentDialogTitle: "Xác nhận xóa tất cả",
                contentDialogDesc:
                  "Bạn có chắc chắn xóa tất cả sách đã chọn chứ",
              }}
              fncHandleClickAccept={handleClickDeleteAll}
            ></SubmitDialog>
          )}
          <Button variant="contained">Tạo Danh Mục</Button>
          <Button variant="contained" onClick={handleClickCreateBookBtn}>
            Tạo Sách
          </Button>
          <Button variant="contained">Thùng Rác</Button>
          <Button variant="contained">Sách Nháp</Button>
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
          dataList={dataListBooks}
          headerList={headerListBooks}
        ></ITable>
      </Box>
    </Stack>
  );
}
