import { Box, Stack, TextField } from "@mui/material";
import { FaTrash } from "react-icons/fa";
import SubmitDialog from "../../../components/IDialog/SubmitDialog";

export const cartHeaderTable = [
  {
    field: "BookImage",
    headerName: "Ảnh",
    width: 80,
    renderCell: (params) => (
      // Giup render the anh book html trong cell
      <img
        src={params.value}
        alt="Book"
        style={{ width: 60, height: "100%", padding: "0.25rem 0.1rem" }}
      />
    ),
  },
  { field: "BookName", headerName: "Tên", width: 120 },
  {
    field: "BookQuantity",
    headerName: "Sl",
    width: 80,
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          sx={{
            maxHeight: "30px",
          }}
        >
          <button
            style={{
              border: "1px solid var(--color-primary2)",
              backgroundColor: "transparent",
              color: "var(--color-primary2)",
              borderTopLeftRadius: "0.5rem",
              borderBottomLeftRadius: "0.5rem",
              width: "1.5rem",
              height: "auto",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            -
          </button>
          <div
            style={{
              borderTop: "1px solid var(--color-primary2)",
              borderBottom: "1px solid var(--color-primary2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "22px",
              paddingLeft: "0.5rem",
              paddingRight: "0.5rem",
            }}
          >
            {params.value}
          </div>
          <button
            style={{
              fontWeight: "bold",
              fontSize: "1rem",
              border: "1px solid var(--color-primary2)",
              backgroundColor: "transparent",
              color: "var(--color-primary2)",
              borderTopRightRadius: "0.5rem",
              borderBottomRightRadius: "0.5rem",
              width: "1.5rem",
              height: "auto",
            }}
          >
            +
          </button>
        </Stack>
      </Box>
    ),
  },
  {
    field: "BookAction",
    headerName: "Action",
    width: 80,
    renderCell: (params) => {
      function handleDelBook(data) {
        console.log("[DATA DELETE FROM TRASH:::]", data);
      }
      return (
        <Box>
          <SubmitDialog
            styleBtnShowInfo={{
              color: "var(--color-primary2)",
              backgroundColor: "#fff",
              boxShadow: "none",

              padding: "0.25rem 0rem",
              "&:hover": {
                color: "var(--color-primary2)",
                backgroundColor: "#fff",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              },
            }}
            buttonShowInfo={{
              variant: "contained",
              color: "primary",
              title: "X",
            }}
            dialogInfo={{
              contentDialogTitle: "Xác nhận xóa sách khỏi giỏ hàng",
              contentDialogDesc:
                "Bạn có chắc chắn xóa quyển sách này khỏi giỏ hàng chứ?",
            }}
            fncHandleClickAccept={handleDelBook}
          ></SubmitDialog>
        </Box>
      );
    },
  },
];

export const cartDataBookList = [
  {
    id: 1,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 1",
    BookQuantity: 10,
  },
];
