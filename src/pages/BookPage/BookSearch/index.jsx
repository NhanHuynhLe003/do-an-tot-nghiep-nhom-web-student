import {
  Button,
  CircularProgress,
  Grid,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import clsx from "clsx";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import CardBook from "../../../components/book/cardBook";
import ButtonSortType from "../../../components/bookSearch/buttonSortType";
import IMenuListFloat from "../../../components/IMenuListFloat";
import { listSortType, listStatusType } from "../../../data/arrays";
import { useGetListSearchBook } from "../../../hooks/apis/books/useGetListSearchBook";
import { useGetCategoriesPublished } from "../../../hooks/apis/category";
import style from "./bookSearch.module.css";

export default function BookSearchPage() {
  // State quản lý bộ lọc sách
  const [payloadFilter, setPayloadFilter] = useState({
    sortType: "all",
    categoryId: "all",
    instockType: "all",
    skip: 0,
    limit: 20,
  });

  // Lấy dữ liệu sách dựa trên bộ lọc
  const { data: bookFilterData, isLoading: isLoadingBookFilter } =
    useGetListSearchBook(payloadFilter);

  // Lấy danh sách thể loại sách
  const { data: categoryData } = useGetCategoriesPublished();

  // State quản lý danh sách sách và danh mục
  const [booksFilter, setBooksFilter] = useState([]);
  const [listCategory, setListCategory] = useState([]);

  // Cập nhật danh sách sách khi dữ liệu sách thay đổi
  useEffect(() => {
    if (bookFilterData?.data?.metadata) {
      setBooksFilter(bookFilterData.data.metadata);
    }
  }, [bookFilterData]);

  // Cập nhật danh mục khi dữ liệu danh mục thay đổi
  useEffect(() => {
    if (categoryData?.data?.metadata) {
      const cateList = categoryData.data.metadata.map((item) => ({
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

  // State quản lý trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);

  // State quản lý nội dung lựa chọn cho bộ lọc
  const [selectContent, setSelectContent] = useState({
    sortType: "Sắp Xếp",
    categoryType: "Thể Loại",
    statusType: "Tình Trạng",
    ratingType: "Đánh Giá",
  });

  // Hàm xử lý khi chọn loại sắp xếp
  const handleClickSortType = (item) =>
    setSelectContent((prev) => ({ ...prev, sortType: item.content }));
  // Hàm xử lý khi chọn thể loại
  const handleClickCategory = (item) =>
    setSelectContent((prev) => ({ ...prev, categoryType: item.content }));
  // Hàm xử lý khi chọn tình trạng
  const handleClickStatus = (item) =>
    setSelectContent((prev) => ({ ...prev, statusType: item.content }));

  // Hàm xử lý khi thay đổi trang
  const handleChangePagination = (event, page) => {
    setCurrentPage(page);
    setPayloadFilter((prev) => ({
      ...prev,
      skip: (page - 1) * prev.limit, // Cập nhật skip theo trang hiện tại
    }));
  };

  // Hàm xử lý khi lọc sách
  const handleFilter = () => {
    // Hàm chuyển đổi loại sắp xếp
    const getSortType = (type) => {
      switch (type.toLocaleLowerCase()) {
        case "mới nhất":
          return "newest";
        case "xem nhiều":
          return "read";
        case "đánh giá":
          return "rating";
        default:
          return "all";
      }
    };

    // Cập nhật bộ lọc theo nội dung lựa chọn
    const newSortType = getSortType(selectContent.sortType);
    const newCategoryId =
      listCategory.find((cate) => cate.content === selectContent.categoryType)
        ?.id || "all";
    const newInstockType =
      selectContent.statusType.toLocaleLowerCase() === "còn sách"
        ? "instock"
        : "all";

    setPayloadFilter({
      ...payloadFilter,
      sortType: newSortType,
      categoryId: newCategoryId,
      instockType: newInstockType,
      skip: 0, // Reset lại skip khi lọc
    });
    setCurrentPage(1); // Reset lại trang hiện tại
  };

  if (isLoadingBookFilter) {
    return (
      <Stack
        width={"100%"}
        minHeight={"80vh"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <CircularProgress fontSize={40}></CircularProgress>
      </Stack>
    );
  }

  return (
    <Stack className={clsx(style.bookSearchPage)}>
      <Typography component={"h1"} variant="h6" style={{ opacity: 0 }}>
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
            <ButtonSortType content={selectContent.sortType} />
          }
          menuListItems={listSortType}
          itemSelected={selectContent.sortType}
        />
        {/* Sắp xếp thể loại */}
        <IMenuListFloat
          fnClickItem={handleClickCategory}
          ListButtonContent={
            <ButtonSortType content={selectContent.categoryType} />
          }
          menuListItems={listCategory}
          itemSelected={selectContent.categoryType}
        />
        {/* Sắp xếp theo trạng thái */}
        <IMenuListFloat
          fnClickItem={handleClickStatus}
          ListButtonContent={
            <ButtonSortType content={selectContent.statusType} />
          }
          menuListItems={listStatusType}
          itemSelected={selectContent.statusType}
        />
        {/* Nút Lọc */}
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
            "&:hover": { color: "var(--color-primary1)" },
          }}
        >
          Lọc Sách
        </Button>
      </Stack>

      {/* Danh sách các quyển sách */}
      <Grid
        container
        className={style.section2}
        spacing={{ md: 6, xs: 3 }}
        px={{ sm: 6, xs: 2 }}
      >
        {booksFilter?.result?.length <= 0 ? (
          <Typography
            width={"100%"}
            textAlign={"center"}
            color={"var(--color-primary2)"}
            component={"h2"}
            variant="h4"
            fontWeight={500}
            sx={{ opacity: 0.7, mt: 8, textTransform: "capitalize" }}
          >
            Không tìm thấy sách
          </Typography>
        ) : (
          booksFilter?.result?.map((book) => (
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
              />
            </Grid>
          ))
        )}
        <Grid
          className="pagination-book-search"
          item
          sm={12}
          xs={12}
          sx={{ display: "flex", justifyContent: "center", mb: 6, mt: 2 }}
        >
          <Pagination
            onChange={handleChangePagination}
            count={Math.ceil((booksFilter?.total || 0) / payloadFilter.limit)} // Tổng số trang
            page={currentPage} // Trang hiện tại
            color="primary"
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
