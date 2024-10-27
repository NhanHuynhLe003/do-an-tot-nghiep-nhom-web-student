import { Box, Stack, Typography } from "@mui/material";
import clsx from "clsx";
import React, { useMemo } from "react";
import FreeModeCarousel from "../ICarousel/FreeModeCarousel";
import CardBook from "./cardBook";
import style from "./listBookView.module.css";

export default function ListBookView({
  title = "",
  dataList = [],
  paginationCustomize,
  classNameSwiper,
  slideCardPerView,
  isLoading = false,
  isHiddenWhenOutOfStock = true,
  spaceBetween = 30,
}) {
  const listComponentBook = useMemo(() => {
    return dataList.map((book, index) => {
      const currentId =
        book._id || index;
      return {
        id: currentId,
        bookQuantity: book.book_quantity,
        component: (
          <CardBook
            isHiddenWhenOutOfStock={isHiddenWhenOutOfStock}
            idBook={currentId}
            img={book?.book_thumb || book.img}
            title={book?.book_name || book.title}
            rating={book?.book_ratingsAverage || book.vote}
            bookQuantity={book?.book_quantity}
            author={book?.book_author}
            yearRelease={new Date(book?.book_publish_date).getFullYear()}    
          />
        ),
      };
    });
  }, [dataList, isHiddenWhenOutOfStock]);

  if (dataList?.length === 0) {
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
  }

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
          spaceBetween={spaceBetween}
          isHiddenWhenOutOfStock={isHiddenWhenOutOfStock}
          isLoadingData={isLoading}
          dataList={listComponentBook}
          paginationCustomize={paginationCustomize}
          classNameSwiper={classNameSwiper}
          slidesPerView={slideCardPerView}
        />
      </Box>
    </Stack>
  );
}
