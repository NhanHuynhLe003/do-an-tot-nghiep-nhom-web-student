import { Button, Chip, Stack, Typography } from "@mui/material";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import SubmitDialog from "../../../components/IDialog/SubmitDialog";
import { useReturnOrderByUser } from "../../../hooks/apis/checkout_order/useReturnOrderByUser";
import { useGetStudentReadingBooks } from "../../../hooks/apis/students/useGetStudentReadingBooks";
import style from "./MyBookShelf.module.css";
import axiosInstance from "../../../apis/axiosConfig";
import { useGetStudentReadedBooks } from "../../../hooks/apis/students/useGetStudentReadedBooks";

export default function MyBookShelf() {
  const [booksReadingInShelf, setBooksReadingInShelf] = useState([]);
  const [booksReadedInShelf, setBooksReadedInShelf] = useState([]);

  const studentData = JSON.parse(localStorage.getItem("studentData"));
  const { data: userBooksReadingData } = useGetStudentReadingBooks({
    userId: studentData?._id,
  });

  const { data: dataBooksReaded } = useGetStudentReadedBooks({
    userId: studentData?._id,
  });
  const { mutate: returnOrderBook } = useReturnOrderByUser();

  const [activeItem, setActiveItem] = useState("All Books"); // State để lưu trữ mục đang active
  const [statusBook, setStatusBook] = useState({
    status: "pending",
    message: "Chờ xác nhận",
  });

  useEffect(() => {
    if (userBooksReadingData && dataBooksReaded) {
      const convertDataBooksReadingInShelf =
        userBooksReadingData?.data?.metadata.map(async (book) => {
          //get new image
          const bookFoundId = await axiosInstance.get(
            "/v1/api/book/publish/" + book.book_data.bookId
          );

          return {
            ...book,
            bookData: {
              ...book.book_data,
              bookThumb: bookFoundId?.data?.metadata?.book_thumb,
            },
          };
        });

      const convertDataBooksReadedInShelf = dataBooksReaded?.data?.metadata.map(
        async (book) => {
          //get new image
          const bookFoundId = await axiosInstance.get(
            "/v1/api/book/publish/" + book.book_data.bookId
          );

          return {
            ...book,
            bookData: {
              ...book.book_data,
              bookThumb: bookFoundId?.data?.metadata?.book_thumb,
            },
          };
        }
      );

      //Chờ tất cả các Promise trong mảng convertDataBooksInShelf hoàn thành
      Promise.all(convertDataBooksReadingInShelf)
        .then((datas) => {
          setBooksReadingInShelf(datas);
        })
        .catch((error) => {
          console.error("Error convert data books in shelf", error);
        });

      Promise.all(convertDataBooksReadedInShelf)
        .then((datas) => {
          setBooksReadedInShelf(datas);
        })
        .catch((error) => {
          console.error("Error convert data books in shelf", error);
        });
    }
  }, [userBooksReadingData, dataBooksReaded]);

  function handleAcceptReturnBook(orderId, value, bookId, idBookReading) {
    if (value) {
      returnOrderBook({
        userId: studentData?._id,
        orderId: orderId,
        bookId: bookId,

        idBookReading: idBookReading,
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

      <Typography
        component={"h2"}
        variant="h4"
        sx={{
          fontWeight: "500",
          color: "var(--color-primary2)",
          opacity: 0.4,
        }}
      >
        Sách Đang Đọc
      </Typography>
      <div className={style.bookContainer}>
        {booksReadingInShelf && booksReadingInShelf.length > 0 ? (
          booksReadingInShelf.map((book) => (
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
                      fontSize: "1rem",
                      color: "var(--color-primary2)",
                      opacity: 0.5,
                      mt: "0.35rem",
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
                <span className={style.date}>
                  {book.book_checkout.borrowDate}
                </span>
                <br />

                <h4 className={style.titleBookInfo}>Ngày trả </h4>
                <span className={style.date}>
                  {book.book_checkout.returnDate}
                </span>
                <br />
                <h4 className={style.titleBookInfo}>Trạng thái</h4>
                <div className={style.btnborrowedOn}>
                  <Chip
                    label={`${book.book_status}`}
                    variant="filled"
                    sx={{
                      fontSize: "0.85rem",
                      backgroundColor: `var(--${book.book_status}-color-status-rgba)`,
                      color: `var(--${book.book_status}-color-status)`,
                      textTransform: "capitalize",
                    }}
                  />
                </div>
                <br />

                <SubmitDialog
                  styleBtnShowInfo={{
                    backgroundColor: "#fff",
                    boxShadow: "none",
                    width: "100%",

                    padding: "0.25rem 0rem",
                    "&:hover": {
                      color: "#fff",
                      border: "none",
                      backgroundColor: "var(--color-primary1)",
                      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                    },
                  }}
                  buttonShowInfo={{
                    variant: "outlined",
                    color: "primary",
                    title: "Trả sách",
                  }}
                  dialogInfo={{
                    contentDialogTitle: "Xác nhận trả sách",
                    contentDialogDesc:
                      "Bạn có chắc chắn trả quyển sách này chứ?",
                  }}
                  fncHandleClickAccept={(data) =>
                    handleAcceptReturnBook(
                      book?.book_orderId,
                      data,
                      book?.book_data?.bookId,
                      book?._id
                    )
                  }
                ></SubmitDialog>
              </div>
            </div>
          ))
        ) : (
          <Typography
            component={"h3"}
            variant="h6"
            sx={{
              color: "var(--color-primary2)",
              fontWeight: "400",
              opacity: 0.4,
              textAlign: "center",
              width: "100%",
            }}
          >
            {"Chưa có quyển sách nào :("}
          </Typography>
        )}
      </div>

      <br />
      <br />
      <Typography
        component={"h2"}
        variant="h4"
        sx={{
          fontWeight: "500",
          color: "var(--color-primary2)",
          opacity: 0.4,
        }}
      >
        Sách Đã Đọc
      </Typography>

      <div className={style.bookContainer}>
        {booksReadedInShelf &&
          booksReadedInShelf.map((book) => (
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
                    title={book?.book_data?.bookName}
                    sx={{
                      fontSize: "1rem",
                      color: "var(--color-primary2)",
                    }}
                  >
                    {book?.book_data?.bookName}
                  </Typography>
                  <Typography
                    component={"h5"}
                    sx={{
                      fontSize: "0.8rem",
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
                <span className={style.date}>
                  {book?.book_checkout?.borrowDate}
                </span>
                <br />

                <h4 className={style.titleBookInfo}>Ngày trả </h4>
                <span className={style.date}>
                  {book?.book_checkout?.returnDate}
                </span>
                <br />
                <h4 className={style.titleBookInfo}>Trạng thái</h4>
                <div className={style.btnborrowedOn}>
                  <Chip
                    label={`${book?.book_status}`}
                    variant="filled"
                    sx={{
                      fontSize: "0.85rem",
                      backgroundColor: `var(--${book?.book_status}-color-status-rgba)`,
                      color: `var(--${book?.book_status}-color-status)`,
                      textTransform: "capitalize",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
