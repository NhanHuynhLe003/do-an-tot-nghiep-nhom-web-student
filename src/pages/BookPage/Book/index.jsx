import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import CardUserRank from "../../../components/book/cardUserRank";
import CarouselCard from "../../../components/book/carouselCard";
import ListBookView from "../../../components/book/listBookView";
import ListCardViewHorizontal from "../../../components/book/listCardViewHorizontal";

import { Link } from "react-router-dom";
import axiosInstance from "../../../apis/axiosConfig";
import { famouseQuotes, ratingBooks } from "../../../data/arrays";
import listTopUserRank from "../../../data/jsons/top-user-read-book.json";
import {
  useGetListBooks,
  useGetListNewestBook,
} from "../../../hooks/apis/books";
import { useGetListRecommendBooks } from "../../../hooks/apis/books/useGetListRecommendBook";
import { useGetListSortBookReads } from "../../../hooks/apis/books/useGetListSortBookReads";
import { useGetCategoriesPublished } from "../../../hooks/apis/category/useGetCategoriesPublished";
import { useWindowSize } from "../../../hooks/useWindowSize";
import theme from "../../../theme";
import { shuffleArray } from "../../../utils";
import style from "./book.module.css";
import { BREAK_POINTS } from "../../../constants";

export default function Book() {
  const { width, height } = useWindowSize();

  const { data: dataListNewestBook } = useGetListNewestBook();

  const { data: dataListRecomendBooks } = useGetListRecommendBooks();

  const { data: dataListCategories } = useGetCategoriesPublished();

  const flagDataFirst = useRef(true);

  // Lấy ra kích thước màn hình hiện tại, để responsive
  const [categoryBooks, setCategoryBooks] = useState({});
  const [listCategories, setListCategories] = useState([]);
  const [listBookCateInView, setListBookCateInView] = useState([]);

  const mainPageRef = React.useRef(null);
  const listBookCateRef = React.useRef([]);

  const { data, error, isLoading } = useGetListBooks();

  const {
    data: dataListSortBookReads,
    error: errSortBookReads,
    isLoading: loadingSortBookReads,
  } = useGetListSortBookReads();

  useEffect(() => {
    setListCategories(dataListCategories?.data?.metadata);

    dataListCategories?.data?.metadata.forEach(async (category, index) => {
      const listBookCategory = await axiosInstance.get(
        `/v1/api/book/category/${category._id}`
      );

      setCategoryBooks((prevObjCate) => ({
        ...prevObjCate,
        [category._id]: {
          isLoading: false,
          categoryName: category?.name,
          dataList: listBookCategory?.data?.metadata,
        },
      }));
    });

    // Thêm các quyển sách vào từng thể loại
  }, [dataListCategories]);

  if (isLoading)
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress></CircularProgress>
      </Box>
    );

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
      ref={mainPageRef}
      className={clsx(
        "book-main-page",
        style.contentBookContainer,
        "animate__animated animate__fadeIn"
      )}
    >
      <h1 className={style.heading01}>Book Store Home</h1>
      <br />
      <br />
      <Stack
        className={clsx(style.section1, "animate__animated animate__zoomIn")}
        direction={"row"}
        justifyContent={"space-between"}
        px={{ sm: 6, xs: 2 }}
      >
        {width > BREAK_POINTS.xs && (
          <CarouselCard
            dataList={famouseQuotes}
            dotCustomize={paginationCustomize}
            swiperClassName={"book-quotes-carousel"}
          ></CarouselCard>
        )}

        {/* Sach mới nhất  */}
        <ListCardViewHorizontal
          spacebetween={width < BREAK_POINTS.xs ? 10 : 30}
          paginationCustomize={paginationCustomize}
          classNameSwiper={"book-newest-carousel"}
          slideCardPerView={width < BREAK_POINTS.md ? 2.4 : 3.4}
          dataList={dataListNewestBook?.data?.metadata}
        ></ListCardViewHorizontal>
      </Stack>

      <Stack
        className={clsx(style.section2, "animate__animated animate__fadeIn")}
        direction={"column"}
        gap={"1rem"}
        px={{ sm: 6, xs: 2 }}
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

      <Stack
        className={style.section3}
        mt={"3rem"}
        px={{ sm: 6, xs: 2 }}
        direction={"column"}
      >
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
          dataList={dataListRecomendBooks?.data?.metadata}
          classNameSwiper={"book-recommend-carousel"}
          slideCardPerView={width < BREAK_POINTS.xs ? 2.6 : 4.6}
        ></ListBookView>
      </Stack>

      <Stack
        className={style.section4}
        mt={"3rem"}
        px={{ sm: 6, md: 2 }}
        direction={"column"}
      >
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
          // dataList={shuffleArray(recentlyBooks)}

          classNameSwiper={"book-recommend-carousel"}
          slideCardPerView={width < BREAK_POINTS.xs ? 2.6 : 4.6}
        ></ListBookView>
      </Stack>

      <Stack
        className={style.section5}
        mt={"3rem"}
        px={{ sm: 6, xs: 2 }}
        direction={"column"}
      >
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
          dataList={dataListSortBookReads?.data?.metadata}
          classNameSwiper={"book-recommend-carousel"}
          slideCardPerView={width < BREAK_POINTS.xs ? 2.6 : 4.6}
        ></ListBookView>
      </Stack>

      {/* Rating */}
      <Stack
        className={style.section6}
        mt={"3rem"}
        px={{ sm: 6, xs: 2 }}
        direction={"column"}
      >
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
          slideCardPerView={width < BREAK_POINTS.xs ? 2.6 : 4.6}
        ></ListBookView>
      </Stack>

      {/* Map ra các sách đúng với thể loại */}
      {categoryBooks &&
        Object.keys(categoryBooks).length > 0 &&
        Object.keys(categoryBooks).map((keyCate, index) => {
          return (
            <Stack
              ref={(el) => (listBookCateRef.current[index] = el)}
              className={style[`section${index + 7}`]}
              mt={"3rem"}
              px={{ sm: 6, xs: 2 }}
              direction={"column"}
              key={keyCate}
            >
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography component={"h2"} variant="h5">
                  {categoryBooks[keyCate]?.categoryName}
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
                isLoading={categoryBooks[keyCate]?.isLoading}
                paginationCustomize={paginationCustomize}
                dataList={categoryBooks[keyCate]?.dataList}
                classNameSwiper={"book-recommend-carousel"}
                slideCardPerView={width < BREAK_POINTS.xs ? 2.6 : 4.6}
              ></ListBookView>
            </Stack>
          );
        })}
    </Box>
  );
}
