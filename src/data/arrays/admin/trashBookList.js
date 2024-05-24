import { Box, Button, Stack } from "@mui/material";
import { FaTrash } from "react-icons/fa";
import { IoMdReturnLeft } from "react-icons/io";
import SubmitDialog from "../../../components/IDialog/SubmitDialog";
export const trashHeaderListBooks = [
  { field: "id", headerName: "Id", width: 70 },
  {
    field: "BookImage",
    headerName: "Image",
    width: 150,
    renderCell: (params) => (
      // Giup render the anh book html trong cell
      <img
        src={params.value}
        alt="Book"
        style={{ width: 60, padding: "5px 0" }}
      />
    ),
  },
  { field: "BookName", headerName: "Book Name", width: 200 },
  { field: "BookCate", headerName: "Category", width: 200 },
  { field: "BookQuantity", headerName: "Quantity", width: 150 },
  {
    field: "BookAction",
    headerName: "Action",
    width: 250,
    renderCell: (params) => {
      function handleDelBook(data) {
        console.log("[DATA DELETE FROM TRASH:::]", data);
      }
      return (
        <Box>
          <SubmitDialog
            buttonShowInfo={{
              variant: "contained",
              color: "error",
              title: <FaTrash></FaTrash>,
            }}
            dialogInfo={{
              contentDialogTitle: "Xác nhận xóa quyển sách này",
              contentDialogDesc:
                "Bạn có chắc chắn xóa quyển sách này khỏi thùng rác chứ, sau khi hoàn tất sẽ không thể khôi phục lại được.",
            }}
            fncHandleClickAccept={handleDelBook}
          ></SubmitDialog>
          <Button
            variant="contained"
            color="success"
            title="Khôi Phục Sách"
            sx={{ ml: 2 }}
          >
            <IoMdReturnLeft></IoMdReturnLeft>
          </Button>
        </Box>
      );
    },
  },
];

export const trashDataListBooks = [
  {
    id: 1,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 1",
    BookCate: "Category 1",
    BookQuantity: 10,
  },
  {
    id: 2,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 2",
    BookCate: "Category 2",
    BookQuantity: 20,
  },
  {
    id: 3,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 3",
    BookCate: "Category 3",
    BookQuantity: 30,
  },
  {
    id: 4,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 4",
    BookCate: "Category 4",
    BookQuantity: 40,
  },
];
