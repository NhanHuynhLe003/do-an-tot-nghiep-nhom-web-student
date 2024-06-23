import { Box, Stack, Typography } from "@mui/material";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import book1 from "../../assets/images/books/book_1.png";
import book2 from "../../assets/images/books/book_2.png";
import book3 from "../../assets/images/books/book_3.png";
import book4 from "../../assets/images/books/book_4.png";
import book5 from "../../assets/images/books/book_5.png";
import book6 from "../../assets/images/books/book_6.png";
import book7 from "../../assets/images/books/book_7.png";
import FreeModeCarousel from "../ICarousel/FreeModeCarousel";
import CardBook from "./cardBook";
import style from "./listCardViewHorizontal.module.css";

const listBook = [
  {
    img: book1,
    title: "Sách 1123123123123123",
    vote: 4.5,
  },
  {
    img: book2,
    title: "Sách 2",
    vote: 4.5,
  },
  {
    img: book3,
    title: "Sách 3",
    vote: 4.5,
  },
  {
    img: book4,
    title: "Sách 4",
    vote: 4.5,
  },
  {
    img: book5,
    title: "Sách 5",
    vote: 4.5,
  },
  {
    img: book6,
    title: "Sách 6",
    vote: 4.5,
  },
  {
    img: book7,
    title: "Sách 7",
    vote: 4.5,
  },
];
export default function ListCardViewHorizontal({
  title = "Sách Mới Nhất",
  dataList = [...listBook],
  paginationCustomize,
  classNameSwiper,
  slideCardPerView,
}) {
  const [listComponentBook, setListComponentBook] = useState([]);
  useEffect(() => {
    const newBooks = dataList.map((book, index) => {
      return {
        component: (
          <CardBook
            key={book._id || book.title + JSON.stringify(Date.now())}
            img={book.img || book.book_thumb}
            title={book.title || book.book_name}
            rating={book.vote || book.book_ratingsAverage}
            author={book.book_author || "Author"}
            yearRelease={
              book.book_publish_date
                ? new Date(book.book_publish_date).getFullYear()
                : new Date().getFullYear()
            }
          ></CardBook>
        ),
      };
    });

    setListComponentBook(newBooks);
    console.log("LIST COMPONENT BOOK:::", newBooks);
  }, []);
  return (
    <Stack
      className={clsx("listViewCardHorizon", style.cardListHorizonContainer)}
      direction={"row"}
    >
      <Box className={style.titleCardList}>
        <Typography
          className={style.titleHeading}
          component={"h2"}
          variant="h6"
        >
          {title}
        </Typography>
      </Box>
      <Box className={style.boxCardCarouselContainer}>
        <FreeModeCarousel
          dataList={listComponentBook}
          paginationCustomize={paginationCustomize}
          classNameSwiper={classNameSwiper}
          slidesPerView={slideCardPerView}
        ></FreeModeCarousel>
      </Box>
    </Stack>
  );
}
