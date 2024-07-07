import { Button, Chip, Stack, Typography } from "@mui/material";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import SubmitDialog from "../../../components/IDialog/SubmitDialog";
import { useReturnOrderByUser } from "../../../hooks/apis/checkout_order/useReturnOrderByUser";
import { useGetStudentReadingBooks } from "../../../hooks/apis/students/useGetStudentReadingBooks";
import style from "./MyBookShelf.module.css";
import axiosInstance from "../../../apis/axiosConfig";

export default function MyBookShelf() {
  const [booksInShelf, setBooksInShelf] = useState([]);

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

  useEffect(() => {
    if (userBooksReadingData) {
      console.log("Books in shelf", userBooksReadingData?.data?.metadata);

      const convertDataBooksInShelf = userBooksReadingData?.data?.metadata.map(
        async (book) => {
          //get new image
          const bookFoundId = await axiosInstance.get(
            "/v1/api/book/publish/" + book.book_data.bookId
          );
          console.log("Book found id", bookFoundId?.data?.metadata?.book_thumb);

          return {
            ...book,
            bookData: {
              ...book.book_data,
              bookThumb: bookFoundId?.data?.metadata?.book_thumb,
            },
          };
        }
      );

      Promise.all(convertDataBooksInShelf)
        .then((datas) => {
          console.log("Convert data books in shelf", datas);
          setBooksInShelf(datas);
        })
        .catch((error) => {
          console.error("Error convert data books in shelf", error);
        });
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
        {booksInShelf &&
          booksInShelf.map((book) => (
            <div
              key={book.data?.bookId}
              className={`${style.book} ${
                activeItem === "Borrowed Books" ? style.show : ""
              }`}
            >
              <div className={style.bookcard}>
                <div className={style.bookImgContainer}>
                  <img
                    src={book?.bookData?.bookThumb}
                    alt={book?.bookData?.bookName}
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
