import { Box, Stack, Typography } from "@mui/material";
import clsx from "clsx";
import React, { useRef } from "react";
import CardUserRank from "../../../components/book/cardUserRank";
import CarouselCard from "../../../components/book/carouselCard";
import ListCardViewHorizontal from "../../../components/book/listCardViewHorizontal";
import ListBookView from "../../../components/book/listBookView";

import {
  famouseQuotes,
  recomendBooks,
  recentlyBooks,
  rankViewBooks,
  ratingBooks,
} from "../../../data/arrays";
import listTopUserRank from "../../../data/jsons/top-user-read-book.json";
import style from "./book.module.css";
import { Link } from "react-router-dom";
import theme from "../../../theme";
import { shuffleArray } from "../../../utils";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { usePositionDefParent } from "../../../hooks";

export default function Book() {
  // Lấy ra kích thước màn hình hiện tại, để responsive
  const sizeScreen = useWindowSize();

  const paginationCustomize = {
    clickable: true,
    renderBullet: function (index, className) {
      //className nằm ở src/styles/swiper-slider.css
      return `<span class="${className} book-quotes-pagination"> </span>`;
    },
  };

  function getValueCateSearch(value) {
    console.log(value);
  }

  return (
    <Box
      className={clsx(
        "book-main-page",
        style.contentBookContainer,
        "animate__animated animate__fadeIn"
      )}
    >
      <h1 className={style.heading01}>Book Store Home</h1>

      <h3>
        Nơi đây sẽ là Carousel chứa nội dung của Event , đồng thời sẽ chứa pop
        up hiển thị thông báo event mới
      </h3>
      <br />
      <br />
      <Stack
        className={clsx(style.section1, "animate__animated animate__zoomIn")}
        direction={"row"}
        justifyContent={"space-between"}
        px={6}
        gap={"8rem"}
      >
        <CarouselCard
          dataList={famouseQuotes}
          dotCustomize={paginationCustomize}
          swiperClassName={"book-quotes-carousel"}
        ></CarouselCard>
        <ListCardViewHorizontal
          paginationCustomize={paginationCustomize}
          classNameSwiper={"book-newest-carousel"}
          slideCardPerView={3.7}
        ></ListCardViewHorizontal>
      </Stack>

      <Stack
        className={clsx(style.section2, "animate__animated animate__fadeIn")}
        direction={"column"}
        gap={"1rem"}
        px={6}
        mt={"3rem"}
      >
        <Typography component={"h2"} variant="h5">
          Bảng Xếp Hạng
        </Typography>
        <Stack direction={"row"} gap={"1rem"} flexWrap={"wrap"}>
          {listTopUserRank ? (
            listTopUserRank
              .sort((a, b) => b.booksReaded - a.booksReaded) //Sắp xếp số lượng sách giảm dần
              .map((user, index) => {
                return (
                  <CardUserRank
                    key={user}
                    img={user.avatar}
                    userBookReaded={user.booksReaded}
                    userName={user.nameUser}
                  ></CardUserRank>
                );
              })
          ) : (
            <span>Chưa xếp hạng</span>
          )}
        </Stack>
      </Stack>

      <Stack className={style.section3} mt={"3rem"} px={6} direction={"column"}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography component={"h2"} variant="h5">
            Đề Xuất Cho Bạn
          </Typography>
          <Typography component={"h2"} variant="h6">
            <Link
              to={"/"}
              style={{
                color: theme.colors.primary1,
                textDecoration: "none",
              }}
            >
              Xem Tất Cả
            </Link>
          </Typography>
        </Stack>
        <br />

        <ListBookView
          paginationCustomize={paginationCustomize}
          dataList={recomendBooks}
          classNameSwiper={"book-recommend-carousel"}
          slideCardPerView={6.6}
        ></ListBookView>
      </Stack>

      <Stack className={style.section4} mt={"3rem"} px={6} direction={"column"}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography component={"h2"} variant="h5">
            Xem Gần Đây
          </Typography>
          <Typography component={"h2"} variant="h6">
            <Link
              to={"/"}
              style={{
                color: theme.colors.primary1,
                textDecoration: "none",
              }}
            >
              Xem Tất Cả
            </Link>
          </Typography>
        </Stack>
        <br />

        <ListBookView
          paginationCustomize={paginationCustomize}
          dataList={shuffleArray(recentlyBooks)}
          classNameSwiper={"book-recommend-carousel"}
          slideCardPerView={6.6}
        ></ListBookView>
      </Stack>

      <Stack className={style.section5} mt={"3rem"} px={6} direction={"column"}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography component={"h2"} variant="h5">
            Đọc Nhiều Nhất
          </Typography>
          <Typography component={"h2"} variant="h6">
            <Link
              to={"/"}
              style={{
                color: theme.colors.primary1,
                textDecoration: "none",
              }}
            >
              Xem Tất Cả
            </Link>
          </Typography>
        </Stack>
        <br />

        <ListBookView
          paginationCustomize={paginationCustomize}
          dataList={shuffleArray(rankViewBooks)}
          classNameSwiper={"book-recommend-carousel"}
          slideCardPerView={6.6}
        ></ListBookView>
      </Stack>

      {/* Rating */}
      <Stack className={style.section6} mt={"3rem"} px={6} direction={"column"}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography component={"h2"} variant="h5">
            Đánh Giá Cao
          </Typography>
          <Typography component={"h2"} variant="h6">
            <Link
              to={"/"}
              style={{
                color: theme.colors.primary1,
                textDecoration: "none",
              }}
            >
              Xem Tất Cả
            </Link>
          </Typography>
        </Stack>
        <br />

        <ListBookView
          paginationCustomize={paginationCustomize}
          dataList={shuffleArray(ratingBooks)}
          classNameSwiper={"book-recommend-carousel"}
          slideCardPerView={6.6}
        ></ListBookView>
      </Stack>

      {/* Sách phát triển bản thân */}
      <Stack className={style.section7} mt={"3rem"} px={6} direction={"column"}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography component={"h2"} variant="h5">
            Phát Triển Bản Thân
          </Typography>
          <Typography component={"h2"} variant="h6">
            <Link
              to={"/"}
              style={{
                color: theme.colors.primary1,
                textDecoration: "none",
              }}
            >
              Xem Tất Cả
            </Link>
          </Typography>
        </Stack>
        <br />

        <ListBookView
          paginationCustomize={paginationCustomize}
          dataList={shuffleArray(ratingBooks)}
          classNameSwiper={"book-recommend-carousel"}
          slideCardPerView={6.6}
        ></ListBookView>
      </Stack>

      {/* Sách Tâm Lý Học */}
      <Stack className={style.section8} mt={"3rem"} px={6} direction={"column"}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography component={"h2"} variant="h5">
            Sách Tâm Lý Học
          </Typography>
          <Typography component={"h2"} variant="h6">
            <Link
              to={"/"}
              style={{
                color: theme.colors.primary1,
                textDecoration: "none",
              }}
            >
              Xem Tất Cả
            </Link>
          </Typography>
        </Stack>

        <br />
        <ListBookView
          paginationCustomize={paginationCustomize}
          dataList={shuffleArray(ratingBooks)}
          classNameSwiper={"book-recommend-carousel"}
          slideCardPerView={6.6}
        ></ListBookView>
      </Stack>
      <br />
      <Stack>
        <h3>Đánh giá của đọc giả</h3>
      </Stack>
      <br />

      {/* Tiểu Thuyết */}
      <Stack className={style.section9} mt={"3rem"} px={6} direction={"column"}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography component={"h2"} variant="h5">
            Tiểu Thuyết
          </Typography>
          <Typography component={"h2"} variant="h6">
            <Link
              to={"/"}
              style={{
                color: theme.colors.primary1,
                textDecoration: "none",
              }}
            >
              Xem Tất Cả
            </Link>
          </Typography>
        </Stack>
        <br />

        <ListBookView
          paginationCustomize={paginationCustomize}
          dataList={shuffleArray(ratingBooks)}
          classNameSwiper={"book-recommend-carousel"}
          slideCardPerView={6.6}
        ></ListBookView>
      </Stack>

      {/* Sách Sức Khỏe */}
      <Stack
        className={style.section10}
        mt={"3rem"}
        px={6}
        direction={"column"}
      >
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography component={"h2"} variant="h5">
            Sách Sức Khỏe
          </Typography>
          <Typography component={"h2"} variant="h6">
            <Link
              to={"/"}
              style={{
                color: theme.colors.primary1,
                textDecoration: "none",
              }}
            >
              Xem Tất Cả
            </Link>
          </Typography>
        </Stack>
        <br />

        <ListBookView
          paginationCustomize={paginationCustomize}
          dataList={shuffleArray(ratingBooks)}
          classNameSwiper={"book-recommend-carousel"}
          slideCardPerView={6.6}
        ></ListBookView>
      </Stack>

      {/* Sách Chuyên Ngành */}
      <Stack
        className={style.section11}
        mt={"3rem"}
        px={6}
        direction={"column"}
      >
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography component={"h2"} variant="h5">
            Sách Chuyên Ngành
          </Typography>
          <Typography component={"h2"} variant="h6">
            <Link
              to={"/"}
              style={{
                color: theme.colors.primary1,
                textDecoration: "none",
              }}
            >
              Xem Tất Cả
            </Link>
          </Typography>
        </Stack>
        <br />

        <ListBookView
          paginationCustomize={paginationCustomize}
          dataList={shuffleArray(ratingBooks)}
          classNameSwiper={"book-recommend-carousel"}
          slideCardPerView={6.6}
        ></ListBookView>
      </Stack>
    </Box>
  );
}
