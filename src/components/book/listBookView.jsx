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
      return {
        id: `${JSON.stringify(book)}-${book.title}-${index}`,
        component: (
          <CardBook
            img={book.img}
            title={book.title}
            rating={book.vote}
          ></CardBook>
        ),
      };
    });

    newBooks.length > 0
      ? setListComponentBook([...newBooks])
      : setListComponentBook([]);
  }, []);
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
