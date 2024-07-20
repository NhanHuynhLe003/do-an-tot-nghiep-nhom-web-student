import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitDialog from "../../../components/IDialog/SubmitDialog";
import ITable from "../../../components/ITable/ITable";
import { headerListBooks } from "../../../data/arrays";
import { useGetAllBookNotDeletedByAdmin } from "../../../hooks/apis/books/useGetAllBookNotDeletedByAdmin";

export default function AdminBookManagePage() {
  // nevigate
  const navigate = useNavigate();

  const [listRowSelected, setListRowSelected] = useState([]);
  const [listBook, setListBook] = useState([]);
  const [bookSearch, setBookSearch] = useState(""); // Lấy search để fetch api
  const [searchControl, setSearchControl] = useState(""); // Cập nhật dữ liệu search lập tức để hiển thị
  const [paginate, setPaginate] = useState({
    skip: 0,
    limit: 20,
  });

  const { data: listBookData, isLoading: isLoadingListBook } =
    useGetAllBookNotDeletedByAdmin({
      search: bookSearch,
      skip: paginate.skip,
      limit: paginate.limit,
    });

  useEffect(() => {
    if (listBookData && listBookData.data && listBookData.data.metadata) {
      /**
        id: 1,
        BookImage: "https://via.placeholder.com/150",
        BookName: "Book 1",
        BookCate: "Category 1",
        BookQuantity: 10,
       */
      const displayListBook = listBookData.data.metadata?.result.map((book) => {
        return {
          ...book,
          id: book._id,
          BookImage: book.book_thumb,
          BookName: book.book_name,
          BookCate: book.book_genre.join(", "),
          BookQuantity: book.book_quantity,
        };
      });

      setListBook(displayListBook);
    }
  }, [listBookData]);

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

  function handleClickTrashBtn() {
    navigate("/admin/book-manage/trash");
  }

  const debounceSearch = useCallback(
    debounce((value) => {
      console.log("Search Book:", value);
      setBookSearch(value);
    }, 500),
    [debounce]
  );

  function handleSearchBook(event) {
    setSearchControl(event.target.value);
    debounceSearch(event.target.value);
  }

  if (isLoadingListBook)
    return (
      <Stack
        width={"100%"}
        minHeight={"80vh"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <CircularProgress
          sx={{
            fontSize: 32,
          }}
        ></CircularProgress>
      </Stack>
    );

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
          <input
            value={searchControl}
            placeholder="Tìm kiếm sách...."
            onChange={handleSearchBook}
          />
        </Box>

        <Stack direction={"row"} justifyContent={"right"} gap={2} mb={3}>
          {listRowSelected.length > 1 && (
            <SubmitDialog
              buttonShowInfo={{
                variant: "outlined",
                color: "error",
                title: "Xóa Tất Cả",
              }}
              dialogInfo={{
                contentDialogTitle: "Xác nhận xóa tất cả",
                contentDialogDesc:
                  "Bạn có chắc chắn xóa tất cả sách đã chọn chứ",
              }}
              fncHandleClickAccept={handleClickDeleteAll}
            />
          )}
          <Button variant="outlined">Tạo Danh Mục</Button>
          <Button
            variant="outlined"
            color="success"
            onClick={handleClickCreateBookBtn}
          >
            Thêm Sách
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={handleClickTrashBtn}
          >
            Thùng Rác
          </Button>
          <Button variant="outlined" color="info">
            Sách Nháp
          </Button>
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
          dataList={listBook}
          headerList={headerListBooks}
          minHeightTable={90}
          rowHeight={90}
          pageSize={20}
        />
      </Box>
    </Stack>
  );
}
