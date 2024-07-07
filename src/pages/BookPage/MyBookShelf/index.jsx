import { Button, Chip, Stack, Typography } from "@mui/material";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import SubmitDialog from "../../../components/IDialog/SubmitDialog";
import { useReturnOrderByUser } from "../../../hooks/apis/checkout_order/useReturnOrderByUser";
import { useGetStudentReadingBooks } from "../../../hooks/apis/students/useGetStudentReadingBooks";
import style from "./MyBookShelf.module.css";

const books = [
  {
    id: 1,
    title: "Book 1",
    img: "/imgs/books/book_1.png",
    borrowedOn: "2024-01-01",
    submissionDue: "2024-01-15",
  },
  {
    id: 2,
    title: "Book 2",
    img: "/imgs/books/book_1.png",
    borrowedOn: "2024-02-01",
    submissionDue: "2024-02-15",
  },
  {
    id: 3,
    title: "Book 3",
    img: "/imgs/books/book_1.png",
    borrowedOn: "2024-03-01",
    submissionDue: "2024-03-15",
  },
  {
    id: 4,
    title: "Book 4",
    img: "/imgs/books/book_1.png",
    borrowedOn: "2024-04-01",
    submissionDue: "2024-04-15",
  },
  {
    id: 5,
    title: "Book 5",
    img: "/imgs/books/book_1.png",
    borrowedOn: "2024-05-01",
    submissionDue: "2024-05-15",
  },
  {
    id: 6,
    title: "Book 6",
    img: "/imgs/books/book_1.png",
    borrowedOn: "2024-06-01",
    submissionDue: "2024-06-15",
  },
  {
    id: 7,
    title: "Book 7",
    img: "/imgs/books/book_1.png",
    borrowedOn: "2024-07-01",
    submissionDue: "2024-07-15",
  },
  {
    id: 8,
    title: "Book 8",
    img: "/imgs/books/book_1.png",
    borrowedOn: "2024-08-01",
    submissionDue: "2024-08-15",
  },
  {
    id: 9,
    title: "Book 9",
    img: "/imgs/books/book_1.png",
    borrowedOn: "2024-09-01",
    submissionDue: "2024-09-15",
  },
  {
    id: 10,
    title: "Book 10",
    img: "/imgs/books/book_1.png",
    borrowedOn: "2024-10-01",
    submissionDue: "2024-10-15",
  },
];

export default function MyBookShelf() {
  const studentData = JSON.parse(localStorage.getItem("studentData"));
  const {
    data: userBooksReadingData,
    isLoading: isLoadingOrder,
    error: errorOrder,
  } = useGetStudentReadingBooks({ userId: studentData?._id });

  const {
    mutate: returnOrderBook,
    data: orderReturnData,
    isLoading: isLoadingReturnOrder,
    error: errorReturnOrder,
  } = useReturnOrderByUser();

  const [activeItem, setActiveItem] = useState("All Books"); // State để lưu trữ mục đang active
  const [statusBook, setStatusBook] = useState({
    status: "pending",
    message: "Chờ xác nhận",
  });

  const [dataOrderBook, setDataOrderBook] = useState([]);
  const [listBookOrder, setListBookOrder] = useState(null);

  useEffect(() => {
    if (userBooksReadingData) {
      console.log("userBooksReadingData:::", userBooksReadingData);
    }
  }, [userBooksReadingData]);

  function handleAcceptReturnBook(orderId, value, bookId) {
    if (value) {
      console.log("Accept return book");
      returnOrderBook({
        userId: studentData?._id,
        orderId: orderId,
        bookId: bookId,
      });
    }
  }

  return (
    <div className={style.BookShelf}>
      <div className={style.title}>
        <h2>
          <span className={style.blackText}>Your</span>{" "}
          <span className={style.blueText}>Shelf</span>
        </h2>
      </div>
      <div className={style.menu}>
        <ul className={style.card}>
          {/* Sử dụng className active để chỉ định mục đang active */}
          <li
            className={clsx("animate__animated animate__fadeIn", {
              [style.active]: activeItem === "All Books",
            })}
            onClick={() => setActiveItem("All Books")}
          >
            Tất cả
          </li>
          <li
            className={clsx("animate__animated animate__fadeIn", {
              [style.active]: activeItem === "Favourite",
            })}
            onClick={() => setActiveItem("Favourite")}
          >
            Yêu thích
          </li>
          <li
            className={clsx("animate__animated animate__fadeIn", {
              [style.active]: activeItem === "Borrowed Books",
            })}
            onClick={() => setActiveItem("Borrowed Books")}
          >
            Đã mượn
          </li>
        </ul>
      </div>
      <div className={style.bookContainer}>
        {listBookOrder &&
          listBookOrder.map((book) => (
            <div
              key={book.data?.bookId}
              className={`${style.book} ${
                activeItem === "Borrowed Books" ? style.show : ""
              }`}
            >
              <div className={style.bookcard}>
                <div className={style.bookImgContainer}>
                  <img
                    src={book.data?.bookThumb}
                    alt={book.data?.bookName}
                    className={style.imgbook}
                  />
                </div>

                <Stack direction={"column"}>
                  <Typography
                    className={style.bookTitle}
                    component={"h5"}
                    title={book.data?.bookName}
                    sx={{
                      fontSize: "1rem",
                      color: "var(--color-primary2)",
                    }}
                  >
                    {book.data?.bookName}
                  </Typography>
                  <Typography
                    component={"h5"}
                    sx={{
                      fontSize: "0.7rem",
                      color: "var(--color-primary2)",
                      opacity: 0.5,
                      mt: "0.5rem",
                    }}
                  >
                    Author
                  </Typography>
                </Stack>
              </div>
              <div
                className={`${style.bookShelfInformation} ${
                  activeItem === "Borrowed Books" ? style.show : ""
                }`}
              >
                <h4 className={style.titleBookInfo}>Ngày mượn</h4>
                <span className={style.date}>{book.borrowDate}</span>
                <br />

                <h4 className={style.titleBookInfo}>Ngày trả </h4>
                <span className={style.date}>{book.returnDate}</span>
                <br />
                <h4 className={style.titleBookInfo}>Trạng thái</h4>
                <div className={style.btnborrowedOn}>
                  <Chip
                    label={`${book.status}`}
                    variant="filled"
                    sx={{
                      fontSize: "0.85rem",
                      backgroundColor: `var(--${book.status}-color-status-rgba)`,
                      color: `var(--${book.status}-color-status)`,
                      textTransform: "capitalize",
                    }}
                  />
                </div>
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
                    variant: "outlined",
                    color: "primary",
                    title: "X",
                  }}
                  dialogInfo={{
                    contentDialogTitle: "Xác nhận trả sách",
                    contentDialogDesc:
                      "Bạn có chắc chắn trả quyển sách này chứ?",
                  }}
                  fncHandleClickAccept={(data) =>
                    handleAcceptReturnBook(book.orderId, data, book.bookId)
                  }
                ></SubmitDialog>
                <Button
                  disabled={book.status === "indue" ? false : true}
                  fullWidth
                  type="button"
                  variant="outlined"
                  sx={{
                    mt: "3rem",
                  }}
                >
                  Trả sách
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
