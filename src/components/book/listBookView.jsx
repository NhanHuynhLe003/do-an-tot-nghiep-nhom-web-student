"use strict";
import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import style from "./listBookView.module.css";

import clsx from "clsx";
import FreeModeCarousel from "../ICarousel/FreeModeCarousel";
import CardBook from "./cardBook";

export default function ListdBookView({
  title = "",
  dataList = [],
  paginationCustomize,
  classNameSwiper,
  slideCardPerView,
}) {
  const [listComponentBook, setListComponentBook] = useState([]);
  useEffect(() => {
    const newBooks = dataList.map((book, index) => {
      const currentId =
        book._id || "ID_" + index + Date.now() + Math.random() * 1000;
      return {
        id: currentId,
        component: (
          <CardBook
            idBook={currentId}
            img={book.book_thumb || book.img}
            title={book.book_name || book.title}
            rating={book.book_ratingsAverage || book.vote}
          ></CardBook>
        ),
      };
    });

    newBooks.length > 0
      ? setListComponentBook([...newBooks])
      : setListComponentBook([]);
  }, []);

  if (dataList.length === 0)
    return (
      <Typography
        component={"h2"}
        variant="h5"
        textAlign={"center"}
        sx={{
          color: "var(--color-primary2)",
          opacity: 0.4,
        }}
      >
        Chưa có dữ liệu
      </Typography>
    );

  return (
    <Stack
      className={clsx("listRecomendBook", style.cardListRecomendBook)}
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
