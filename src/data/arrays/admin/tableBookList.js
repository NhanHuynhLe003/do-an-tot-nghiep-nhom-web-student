import { Box, Button, Stack } from "@mui/material";
import { FaTrash } from "react-icons/fa";
import { PiNotePencilBold } from "react-icons/pi";
export const headerListBooks = [
  { field: "id", headerName: "Id", width: 70 },
  {
    field: "BookImage",
    headerName: "Image",
    width: 90,
    renderCell: (params) => (
      // Giup render html trong cell
      <img
        src={params.value}
        alt="Book"
        style={{ width: 50, padding: "5px 0", height: "auto" }}
      />
    ),
  },
  { field: "BookName", headerName: "Book Name", width: 200 },
  { field: "BookCate", headerName: "Category", width: 200 },
  { field: "BookQuantity", headerName: "Quantity", width: 200 },
  {
    field: "BookAction",
    headerName: "Action",
    width: 250,
    renderCell: (params) => (
      <Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: "1rem" }}
          title="Sửa Sách"
          onClick={() =>
            window.location.replace(
              `/admin/book-manage/create-book/${params.row.id}`
            )
          }
        >
          <PiNotePencilBold></PiNotePencilBold>
        </Button>
        <Button variant="contained" color="error" title="Xóa Sách">
          <FaTrash></FaTrash>
        </Button>
      </Box>
    ),
  },
];

export const dataListBooks = [
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
  {
    id: 5,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 5",
    BookCate: "Category 5",
    BookQuantity: 50,
  },
  {
    id: 6,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 6",
    BookCate: "Category 6",
    BookQuantity: 60,
  },
  {
    id: 7,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 7",
    BookCate: "Category 7",
    BookQuantity: 70,
  },
  {
    id: 8,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 8",
    BookCate: "Category 8",
    BookQuantity: 80,
  },
  {
    id: 9,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 9",
    BookCate: "Category 9",
    BookQuantity: 90,
  },
  {
    id: 10,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 10",
    BookCate: "Category 10",
    BookQuantity: 100,
  },
  {
    id: 11,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 11",
    BookCate: "Category 11",
    BookQuantity: 110,
  },
  {
    id: 12,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 12",
    BookCate: "Category 12",
    BookQuantity: 120,
  },
  {
    id: 13,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 13",
    BookCate: "Category 13",
    BookQuantity: 130,
  },
  {
    id: 14,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 14",
    BookCate: "Category 14",
    BookQuantity: 140,
  },
  {
    id: 15,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 15",
    BookCate: "Category 15",
    BookQuantity: 150,
  },
  {
    id: 16,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 16",
    BookCate: "Category 16",
    BookQuantity: 160,
  },
  {
    id: 17,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 17",
    BookCate: "Category 17",
    BookQuantity: 170,
  },
  {
    id: 18,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 18",
    BookCate: "Category 18",
    BookQuantity: 180,
  },
  {
    id: 19,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 19",
    BookCate: "Category 19",
    BookQuantity: 190,
  },
  {
    id: 20,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 20",
    BookCate: "Category 20",
    BookQuantity: 200,
  },
  {
    id: 21,
    BookImage: "https://via.placeholder.com/150",
    BookName: "Book 21",
    BookCate: "Category 21",
    BookQuantity: 200,
  },
];
