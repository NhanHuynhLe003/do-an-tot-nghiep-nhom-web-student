import { Box, Stack, Typography } from "@mui/material";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import FreeModeCarousel from "../ICarousel/FreeModeCarousel";
import CardBook from "./cardBook";
import style from "./listCardViewHorizontal.module.css";

export default function ListCardViewHorizontal({
  title = "Sách Mới Nhất",
  dataList,
  paginationCustomize,
  classNameSwiper,
  slideCardPerView,
  isLoading = false,
  isHiddenWhenOutOfStock = true,
  spacebetween = 30,
}) {
  const [listComponentBook, setListComponentBook] = useState([]);
  useEffect(() => {
    const newBooks =
      dataList &&
      dataList.map((book, index) => {
        const currentId =
          book._id || "ID_" + index;
        return {
          id: currentId,
          bookQuantity: book.book_quantity,
          component: (
            <CardBook
              author={book?.book_author}
              isHiddenWhenOutOfStock={isHiddenWhenOutOfStock}
              idBook={currentId}
              img={book.book_thumb || book.img}
              title={book.book_name || book.title}
              rating={book.book_ratingsAverage || book.vote}
              bookQuantity={book.book_quantity}
            ></CardBook>
          ),
        };
      });

    setListComponentBook(newBooks);
  }, [dataList]);
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
          spaceBetween={spacebetween}
          isHiddenWhenOutOfStock={isHiddenWhenOutOfStock}
          isLoadingData={isLoading}
          dataList={listComponentBook}
          paginationCustomize={paginationCustomize}
          classNameSwiper={classNameSwiper}
          slidesPerView={slideCardPerView}
        ></FreeModeCarousel>
      </Box>
    </Stack>
  );
}
