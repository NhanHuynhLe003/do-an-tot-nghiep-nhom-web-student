import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import style from "./listCardViewHorizontal.module.css";
import PaginationCarousel from "../ICarousel/PaginationCarousel";
import book1 from "../../assets/images/books/book_1.png";
import book2 from "../../assets/images/books/book_2.png";
import book3 from "../../assets/images/books/book_3.png";
import book4 from "../../assets/images/books/book_4.png";
import book5 from "../../assets/images/books/book_5.png";
import book6 from "../../assets/images/books/book_6.png";
import book7 from "../../assets/images/books/book_7.png";
import clsx from "clsx";
import FreeModeCarousel from "../ICarousel/FreeModeCarousel";
import CardBook from "./cardBook";

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
  dataList = [],
  paginationCustomize,
  classNameSwiper,
  slideCardPerView,
}) {
  const [listComponentBook, setListComponentBook] = useState([]);
  useEffect(() => {
    const newBooks = listBook.map((book, index) => {
      return {
        component: (
          <CardBook
            img={book.img}
            title={book.title}
            rating={book.vote}
          ></CardBook>
        ),
      };
    });

    dataList.length > 0
      ? setListComponentBook([...dataList])
      : setListComponentBook([...newBooks]);
    console.log(listComponentBook);
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
