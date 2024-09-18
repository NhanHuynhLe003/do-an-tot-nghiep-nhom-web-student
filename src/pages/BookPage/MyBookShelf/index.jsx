import { Chip, Stack, Typography } from "@mui/material";
import { addDays, format, isWeekend, nextMonday } from "date-fns";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../apis/axiosConfig";
import SubmitDialog from "../../../components/IDialog/SubmitDialog";
import { useReturnOrderByUser } from "../../../hooks/apis/checkout_order/useReturnOrderByUser";
import { useSendEmail } from "../../../hooks/apis/email/useSendEmail";
import { useGetStudentReadedBooks } from "../../../hooks/apis/students/useGetStudentReadedBooks";
import { useGetStudentReadingBooks } from "../../../hooks/apis/students/useGetStudentReadingBooks";
import style from "./MyBookShelf.module.css";

export default function MyBookShelf() {
  const [booksReadingInShelf, setBooksReadingInShelf] = useState([]);
  const [booksReadedInShelf, setBooksReadedInShelf] = useState([]);
  const { mutate: sendMail } = useSendEmail();

  const studentData = JSON.parse(localStorage.getItem("studentData"));
  const { data: userBooksReadingData } = useGetStudentReadingBooks({
    userId: studentData?._id,
  });

  const { data: dataBooksReaded } = useGetStudentReadedBooks({
    userId: studentData?._id,
  });
  const { mutate: returnOrderBook } = useReturnOrderByUser();

  const [activeItem, setActiveItem] = useState("All Books"); // State để lưu trữ mục đang active

  function translateStatusBook(status) {
    if (status === "pending") {
      return "Chờ xác nhận";
    }
    if (status === "indue") {
      return "Đang mượn";
    }
    if (status === "overdue") {
      return "Đã quá hạn";
    }
    if (status === "completed") {
      return "Đã hoàn thành";
    }
  }

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
      returnOrderBook(
        {
          userId: studentData?._id,
          orderId: orderId,
          bookId: bookId,
          idBookReading: idBookReading,
        },
        {
          onSuccess: () => {
            let returnDate = addDays(new Date(), 2); // Cộng 2 ngày từ ngày hiện tại

            // Nếu ngày trả rơi vào thứ 7 hoặc Chủ Nhật, thì lấy ngày thứ Hai tiếp theo
            if (isWeekend(returnDate)) {
              returnDate = nextMonday(returnDate);
            }

            const formattedDate = format(returnDate, "dd-MM-yyyy");

            sendMail({
              destinationEmail: studentData?.email,
              nameReceiver: studentData?.name,
              title: "Thông báo hẹn trả sách",
              content: `<div>Đã xác nhận sinh viên <b>${studentData?.name}</b> trả sách thành công vào lúc ${format(new Date(), 'dd/MM/yyyy - hh:mm:ss')}. Vui lòng mang sách đến trả đúng hạn vào ngày ${formattedDate} tại f8.1`,
            });

            toast.success(
              "Trả sách thành công, thời gian hẹn trả sách đã được gửi vào Email của bạn, vui lòng kiểm tra!",
              {
                position: "top-center",
                autoClose: 7000,
              }
            );
          },
        }
      );
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

      <Typography
        component={"h2"}
        variant="h4"
        sx={{
          fontWeight: "500",
          color: "var(--color-primary2)",
          opacity: 0.4,
          mt: 4,
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
                    label={`${translateStatusBook(book.book_status)}`}
                    variant="filled"
                    sx={{
                      fontSize: "0.8rem",
                      backgroundColor: `var(--${book.book_status}-color-status-rgba)`,
                      color: `var(--${book.book_status}-color-status)`,
                      textTransform: "capitalize",
                      fontWeight: "500",
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
        {!booksReadedInShelf?.length && (
          <Typography
            component={"h2"}
            sx={{
              color: "var(--color-primary2)",
              opacity: 0.6,
              textAlign: "center",
              width: "100%",
              my: 4,
              fontSize: 16,
            }}
          >
            Chưa có dữ liệu
          </Typography>
        )}

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
                    label={`${translateStatusBook(book?.book_status)}`}
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
