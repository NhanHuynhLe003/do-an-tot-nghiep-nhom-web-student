import { Button, Grid, Pagination, Stack, Typography } from "@mui/material";
import clsx from "clsx";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import CardBook from "../../../components/book/cardBook";
import ButtonSortType from "../../../components/bookSearch/buttonSortType";
import IMenuListFloat from "../../../components/IMenuListFloat";
import {
  listCategoryType,
  listSortType,
  listStatusType,
} from "../../../data/arrays";
import { useGetListSearchBook } from "../../../hooks/apis/books/useGetListSearchBook";
import { useGetCategoriesPublished } from "../../../hooks/apis/category";
import style from "./bookSearch.module.css";

export default function BookSearchPage() {
  const [payloadFilter, setPayloadFilter] = useState({});
  const {
    data: bookFilterData,
    isLoading: isLoadingBookFilter,
    error: errorBookFilter,
  } = useGetListSearchBook(payloadFilter);

  const {
    data: categoryData,
    isLoading: isLoadingCategory,
    error: errorCategory,
  } = useGetCategoriesPublished();

  const [booksFilter, setBooksFilter] = useState([]);
  const [listCategory, setListCategory] = useState([]);

  useEffect(() => {
    console.log("bookFilterData::::", bookFilterData?.data?.metadata);
    if (bookFilterData) {
      setBooksFilter(bookFilterData?.data?.metadata);
    }
  }, [bookFilterData]);

  useEffect(() => {
    console.log("categoryData::::", categoryData?.data?.metadata);
    if (categoryData && categoryData?.data && categoryData?.data?.metadata) {
      const cateList = categoryData?.data?.metadata.map((item) => ({
        id: item._id,
        content: item.name,
        tag: item.tag,
      }));
      cateList.unshift({
        id: "all",
        content: "Thể Loại",
        tag: "the-loai",
      });
      setListCategory(cateList);
    }
  }, [categoryData]);

  // thêm query trang hiện tại của pagination vào url

  const [currentPage, setCurrentPage] = useState(1);

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

  function handleFilter() {
    console.log("selectContent", selectContent);
    if (selectContent.sortType) {
      switch (selectContent.sortType.toLocaleLowerCase()) {
        case "sắp xếp":
          console.log("sort");
          setPayloadFilter({
            ...payloadFilter,
            sortType: "all",
          });
          break;
        case "mới nhất":
          console.log("newest");
          setPayloadFilter({
            ...payloadFilter,
            sortType: "newest",
          });
          break;
        case "xem nhiều":
          console.log("read");
          setPayloadFilter({
            ...payloadFilter,
            sortType: "read",
          });
          break;
        case "đánh giá":
          console.log("rating");
          setPayloadFilter({
            ...payloadFilter,
            sortType: "rating",
          });
          break;
        default:
          // Code xử lý mặc định nếu không có case nào khớp
          setPayloadFilter({
            ...payloadFilter,
            sortType: "all",
          });
          break;
      }
    }

    if (selectContent.categoryType) {
      if (selectContent.categoryType.toLocaleLowerCase !== "thể loại") {
        setPayloadFilter({
          ...payloadFilter,
          categoryId: listCategory.find(
            (cate) => cate.content === selectContent.categoryType
          ).id,
        });
      } else {
        setPayloadFilter({
          ...payloadFilter,
          categoryId: "all",
        });
      }
    }

    if (selectContent.statusType) {
      console.log("statusType", selectContent.statusType);
    }

    if (selectContent.statusType) {
      switch (selectContent.statusType.toLocaleLowerCase()) {
        case "tình trạng":
          console.log("all");
          setPayloadFilter({
            ...payloadFilter,
            instockType: "all",
          });
          break;
        case "còn hàng":
          console.log("instock");
          setPayloadFilter({
            ...payloadFilter,
            instockType: "instock",
          });
          break;

        default:
          // Code xử lý mặc định nếu không có case nào khớp
          setPayloadFilter({
            ...payloadFilter,
            instockType: "all",
          });
          break;
      }
    }
  }

  if (isLoadingBookFilter) {
    return <div>Loading...</div>;
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
          menuListItems={listCategory}
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

        {/* Nut Loc */}
        <Button
          className={style.filterButton}
          onClick={handleFilter}
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
        {booksFilter?.result &&
          booksFilter?.result.map((book) => (
            <Grid key={book?._id} item xs={6} sm={4} md={3}>
              <CardBook
                idBook={book?._id}
                bookQuantity={book?.book_quantity}
                isHiddenWhenOutOfStock={false}
                author={book?.book_author}
                img={book?.book_thumb}
                rating={book?.book_ratingsAverage}
                title={book?.book_name}
                yearRelease={format(
                  new Date(book?.book_publish_date),
                  "dd-MM-yyyy"
                )}
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
