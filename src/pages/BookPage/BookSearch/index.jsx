import React, { useEffect, useState } from "react";
import style from "./bookSearch.module.css";
import {
  Box,
  Button,
  Grid,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import IMenuListFloat from "../../../components/IMenuListFloat";
import clsx from "clsx";
import {
  listCategoryType,
  listSortType,
  listStatusType,
  recomendBooks,
  listRatingType,
} from "../../../data/arrays";
import ButtonSortType from "../../../components/bookSearch/buttonSortType";
import CardBook from "../../../components/book/cardBook";
import { useRoutes, useSearchParams } from "react-router-dom";

export default function BookSearchPage() {
  // thêm query trang hiện tại của pagination vào url

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    console.log("current page", currentPage);
    // sau này fetch API bên trong
  }, [currentPage]);

  const [selectContent, setSelectContent] = useState({
    sortType: "Sắp Xếp",
    categoryType: "Thể Loại",
    statusType: "Tình Trạng",
    ratingType: "Đánh Giá",
  });

  function handleClickSortType(item) {
    setSelectContent({
      ...selectContent,
      sortType: item.content,
    });
  }

  function handleClickCategory(item) {
    setSelectContent({
      ...selectContent,
      categoryType: item.content,
    });
  }

  function handleClickStatus(item) {
    setSelectContent({
      ...selectContent,
      statusType: item.content,
    });
  }

  function handleChangePagination(event, page) {
    setCurrentPage(page);
  }
  return (
    <Stack className={clsx(style.bookSearchPage)}>
      <Typography
        component={"h1"}
        variant="h6"
        style={{
          opacity: 0,
        }}
      >
        Trang Tìm Kiếm Sách
      </Typography>

      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={{ sm: "2rem", xs: "0.5rem" }}
        className={style.section1}
        flexWrap={"wrap"}
        px={{ sm: 6, xs: 2 }}
        mb={6}
      >
        {/* Nút sắp xếp */}
        <IMenuListFloat
          fnClickItem={handleClickSortType}
          ListButtonContent={
            <ButtonSortType content={selectContent.sortType}></ButtonSortType>
          }
          menuListItems={listSortType}
          itemSelected={selectContent.sortType}
        ></IMenuListFloat>

        {/* Sắp xếp thể loại */}
        <IMenuListFloat
          fnClickItem={handleClickCategory}
          ListButtonContent={
            <ButtonSortType
              content={selectContent.categoryType}
            ></ButtonSortType>
          }
          menuListItems={listCategoryType}
          itemSelected={selectContent.categoryType}
        ></IMenuListFloat>

        {/* Sắp xếp theo trạng thái */}
        <IMenuListFloat
          fnClickItem={handleClickStatus}
          ListButtonContent={
            <ButtonSortType content={selectContent.statusType}></ButtonSortType>
          }
          menuListItems={listStatusType}
          itemSelected={selectContent.statusType}
        ></IMenuListFloat>

        {/* Đánh Giá */}
        <IMenuListFloat
          fnClickItem={handleClickStatus}
          ListButtonContent={
            <ButtonSortType content={selectContent.ratingType}></ButtonSortType>
          }
          menuListItems={listRatingType}
          itemSelected={selectContent.ratingType}
        ></IMenuListFloat>

        {/* Nut Loc */}
        <Button
          className={style.filterButton}
          sx={{
            backgroundColor: "var(--color-primary1)",
            color: "#fff",
            borderRadius: "5rem",
            height: { sm: "2.5rem", xs: "1.75rem" },
            padding: { sm: "0.5rem 1rem", xs: "0.3rem 0.8rem" },
            fontSize: { sm: "0.8rem", xs: "0.6em" },
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              color: "var(--color-primary1)",
            },
          }}
        >
          Lọc Sách
        </Button>
      </Stack>

      {/* Danh sách cac quyển sách */}
      <Grid
        container
        className={style.section2}
        spacing={{ md: 6, xs: 3 }}
        px={{ sm: 6, xs: 2 }}
      >
        {recomendBooks &&
          recomendBooks.map((book, index) => (
            <Grid key={book.title + index} item xs={6} sm={4} md={3} lg={2.4}>
              <CardBook
                img={book.img}
                rating={book.rating}
                title={book.title}
                yearRelease={book.datePublish}
              ></CardBook>
            </Grid>
          ))}

        <Grid
          className="pagination-book-search"
          item
          sm={12}
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 6,
            mt: 2,
          }}
        >
          <Pagination
            onChange={handleChangePagination}
            count={10}
            color="primary"
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
