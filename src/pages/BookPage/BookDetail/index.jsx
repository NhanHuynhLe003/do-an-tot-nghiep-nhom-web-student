import React, { useEffect, useState } from "react";
import { BsCart2 } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { RxShare1 } from "react-icons/rx";
import { commentList, dataListBooks, ratingBooks } from "../../../data/arrays";
import style from "./book_detail.module.css";

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import clsx from "clsx";
import { Link } from "react-router-dom";
import ListBookView from "../../../components/book/listBookView";
import CommentBook from "../../../components/bookDetail/commentBook";
import TextShowMore from "../../../components/bookDetail/textShowMore";
import { useGetBooksByCategoryId } from "../../../hooks/apis/books/useGetBooksByCategoryId";
import { roundNumber } from "../../../utils";
import { useWindowSize } from "../../../hooks";
import { BREAK_POINTS } from "../../../constants";
export default function BookDetailPage({
  img,
  title = "book title",
  author = "book author",
  description = `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nulla
  amet rerum earum commodi eum tempora culpa dolores molestiae, enim
  in labore dolore architecto quas consequuntur error blanditiis
  quis? Molestias, quibusdam! Iusto similique doloribus dolorum
  laborum quia in totam nihil delectus magnam voluptas, molestias
  deserunt pariatur culpa autem nemo voluptatem eius vel tenetur!
  Quod facere illum cupiditate aliquam veniam modi dolor. Cum
  voluptatibus eum reprehenderit eos saepe sequi at quis, nostrum
  voluptas adipisci sapiente iusto fugit? Fuga voluptates at
  nesciunt quo ad ex sunt, sapiente consectetur? Corrupti distinctio
  nostrum aliquid! Natus. Perferendis minus omnis veritatis quod
  quasi quis magnam voluptatibus fugit aspernatur vitae! Mollitia
  non numquam obcaecati vel, earum, officia eveniet molestiae
  dolorem magni qui optio aliquid eligendi quas delectus commodi.
  Fugit, temporibus sed error nesciunt maiores esse et iste quam
  amet asperiores corporis quos, quis mollitia perspiciatis ipsam
  nemo, provident repudiandae. Officia voluptas nesciunt
  consequuntur! Iure quis facilis ratione. Ea?`,
  publisher = "Nhà xuất bản Tổng hợp thành phố Hồ Chí Minh",
  yearPublic = "2024",
  rating = 4.5,
  comments = commentList,
  ratingList = [
    {
      id: 1,
      avatar: "/imgs/avatar-user.jpg",
      userName: "user0001",
      datePublic: "03-05-2024",
    },
    {
      id: 2,
      avatar: "/imgs/avatar-user.jpg",
      userName: "user0002",
      datePublic: "08-05-2024",
    },
  ],
  categories = [
    { content: "Tâm Lý", tag: "psychology" },
    { content: "Tiểu Thuyết", tag: "novel" },
    { content: "Tự Truyện", tag: "self-help" },
  ],
}) {
  const { width, height } = useWindowSize();

  const [currentBtnComment, setCurrentBtnComment] = React.useState(0);
  // Sử dụng useState để quản lý số lượng comment đã hiển thị
  const [visibleCount, setVisibleCount] = useState(7);
  const [showLoadingCmt, setShowLoadingCmt] = useState(false);
  const [booksRelated, setBooksRelated] = useState([]);

  const {
    data: bookListCategory,
    isLoading: isLoadingData,
    error: errorData,
  } = useGetBooksByCategoryId({ categoryId: "667bb9d4f159a0af59debd19" });

  //================FUNCTION HANDLER=================

  const handleChangeBtnComment = () => {
    setCurrentBtnComment((prev) => (prev === 0 ? 1 : 0));
  };

  // Hàm để xử lý sự kiện bấm vào nút "xem thêm"

  const handleShowMoreComments = async (e) => {
    setShowLoadingCmt(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setShowLoadingCmt(false);
    setVisibleCount((prev) => (prev <= 7 ? comments.length : 7));
  };

  useEffect(() => {
    if (
      bookListCategory &&
      bookListCategory.data &&
      bookListCategory.data.metadata
    ) {
      const dataRelatedBooks = bookListCategory.data.metadata;
      setBooksRelated(dataRelatedBooks);
    }
  }, [bookListCategory]);

  const paginationCustomize = {
    clickable: true,
    renderBullet: function (index, className) {
      //className nằm ở src/styles/swiper-slider.css
      return `<span class="${className} book-quotes-pagination"> </span>`;
    },
  };

  return (
    <Stack direction={"column"}>
      {/* Section sach va thong tin chi tiet sach + comment */}
      <Grid
        container
        spacing={{
          sm: 4,
          xs: 0,
        }}
        className={style.section1}
        sx={{
          position: "relative",
          "& > .book-img-detail-container": {
            pl: 0,
            pt: 0,
            mt: 4,
          },
          mt: 6,
        }}
        px={{
          sm: 12,
          xs: 4,
        }}
      >
        {/* Anh cua sach */}
        <Grid
          item
          className={clsx("book-img-detail-container")}
          md={4}
          sm={5}
          xs={12}
          mb={{
            xs: 6,
          }}
        >
          <Box className={style.imgBookContainer}>
            <img src="/imgs/books/book_1.png" alt="anh-chi-tiet-sach" />
          </Box>
        </Grid>

        {/* Thong tin sach */}
        <Grid
          item
          direction={"column"}
          className={style.bookInformation}
          md={8}
          sm={7}
          xs={12}
        >
          <Typography
            component={"h1"}
            variant="h4"
            className={style.titleBook}
            fontWeight={500}
            mt={6}
            mb={2}
            textAlign={{ xs: "center", sm: "left" }}
          >
            {title}
          </Typography>
          <Stack
            direction={"row"}
            spacing={"2rem"}
            mb={4}
            alignItems={"center"}
          >
            {/* Rating */}
            <Stack
              className={style.ratingAndVote}
              direction={"row"}
              gap={1}
              alignItems={"center"}
            >
              <Box
                component={"p"}
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 500,
                  mt: "6px",
                  color: "var(--color-primary2)",
                }}
              >
                {roundNumber(rating).toFixed(1)}
              </Box>
              <Rating
                name="read-only"
                value={roundNumber(rating)}
                readOnly
                precision={0.5}
              />
            </Stack>
            {/* Rating Count */}
            <Typography
              component={"p"}
              variant={"body1"}
              className={style.ratingCount}
            >
              {ratingList.length} Đánh Giá
            </Typography>
          </Stack>

          {/* ---------Thong Tin Cua Sach, ... ----*/}
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            flexWrap={"wrap"}
            gap={1.5}
          >
            {/* Tac Gia */}
            <Stack direction={"column"} className={style.infoText}>
              <Typography component={"p"} className={clsx(style.blurText)}>
                Tác giả
              </Typography>
              <Typography component={"p"} className={style.contentTextInfo}>
                {author}
              </Typography>
            </Stack>

            {/* The Loai */}
            <Stack direction={"column"} className={style.infoText}>
              <Typography component={"p"} className={clsx(style.blurText)}>
                Thể Loại
              </Typography>
              <Typography component={"p"}>
                {categories.map((cate, index) => (
                  <Link
                    key={cate.tag}
                    to={"/"}
                    className={clsx(
                      style.cateItemListContent,
                      style.contentTextInfo
                    )}
                  >
                    {cate.content}
                  </Link>
                ))}
              </Typography>
            </Stack>

            {/* Nha Xuat Ban */}
            <Stack direction={"column"} className={style.infoText}>
              <Typography component={"p"} className={clsx(style.blurText)}>
                Nhà Xuất Bản
              </Typography>
              <Typography
                component={"p"}
                className={clsx(style.contentTextInfo, style.publisher)}
              >
                {publisher}
              </Typography>
            </Stack>

            {/* Năm Phát Hành */}
            <Stack direction={"column"} className={style.infoText}>
              <Typography component={"p"} className={clsx(style.blurText)}>
                Năm Phát Hành
              </Typography>
              <Typography component={"p"} className={style.contentTextInfo}>
                {yearPublic}
              </Typography>
            </Stack>
            <Divider></Divider>

            {/* Các control sách */}
            <Stack
              direction={"row"}
              justifyContent={"center"}
              className={style.infoText}
              width={"100%"}
              gap={"1rem"}
              flexWrap={"wrap"}
              my={4}
            >
              <Button
                className={style.borrowBookBtn}
                sx={{
                  color: "var(--color-white1)",
                  backgroundColor: "var(--color-primary1)",
                  borderRadius: "5rem",
                  width: "15rem",

                  "&:hover": {
                    color: "var(--color-primary1)",
                    backgroundColor: "var(--color-white1)",
                  },

                  "@media (max-width: 600px)": {
                    width: "100%",
                  },
                }}
                fullWidth={{
                  xs: true,
                  sm: false,
                }}
              >
                <MdOutlineShoppingBag
                  fontSize={"1.75rem"}
                  style={{ marginRight: "0.5rem" }}
                ></MdOutlineShoppingBag>
                Mượn Sách
              </Button>

              <IconButton
                className={clsx(style.favouriteBtn, style.btnControlGroup)}
                sx={{
                  color: "var(--color-primary1)",
                  border: "1px solid var(--color-primary1)",
                  ":hover": {
                    color: "var(--color-white1)",
                    backgroundColor: "var(--color-primary1)",
                  },
                }}
              >
                <FaRegHeart fontSize={"1.3rem"}></FaRegHeart>
              </IconButton>
              <IconButton
                className={style.btnControlGroup}
                sx={{
                  color: "var(--color-primary1)",
                  border: "1px solid var(--color-primary1)",
                  ":hover": {
                    color: "var(--color-white1)",
                    backgroundColor: "var(--color-primary1)",
                  },
                }}
              >
                <BsCart2 fontSize={"1.3rem"}></BsCart2>
              </IconButton>
              <IconButton
                className={style.btnControlGroup}
                sx={{
                  color: "var(--color-primary1)",
                  border: "1px solid var(--color-primary1)",
                  ":hover": {
                    color: "var(--color-white1)",
                    backgroundColor: "var(--color-primary1)",
                  },
                }}
              >
                <RxShare1 fontSize={"1.3rem"}></RxShare1>
              </IconButton>
            </Stack>

            {/* Mô tả sách */}
            <TextShowMore text={description} textAlign="left"></TextShowMore>
          </Stack>

          {/* Comment Select Control */}
          <Stack direction={"row"} gap={"1rem"} mt={8}>
            <Button
              variant="outlined"
              sx={{
                border: "none",
                color: currentBtnComment !== 0 && "var(--color-primary2)",
                opacity: currentBtnComment !== 0 && 0.6,
                "&:hover": { border: "none" },
              }}
              onClick={handleChangeBtnComment}
            >
              Bình Luận <span>(3)</span>
            </Button>
            <Button
              variant="outlined"
              sx={{
                border: "none",
                color: currentBtnComment !== 1 && "var(--color-primary2)",
                opacity: currentBtnComment !== 1 && 0.6,

                "&:hover": { border: "none" },
              }}
              onClick={handleChangeBtnComment}
            >
              Đánh Giá và Nhận Xét <span>(5)</span>
            </Button>
          </Stack>
          <br />
          <Divider></Divider>
          <br />

          {/* Comment List*/}
          <Box>
            <Stack direction={"column"} spacing={2} mt={4}>
              {comments.slice(0, visibleCount).map((cmt) => (
                <CommentBook
                  key={cmt.id}
                  content={cmt.content}
                  date={cmt.date}
                  img={cmt.img}
                  name={cmt.name}
                ></CommentBook>
              ))}
            </Stack>
            {showLoadingCmt && (
              <Box className={style.loadingCmt} textAlign={"center"} pt={4}>
                <CircularProgress size={50} />
              </Box>
            )}

            <Button sx={{ my: 4 }} onClick={handleShowMoreComments}>
              xem thêm bình luận
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Stack
        direction={"column"}
        className={style.section2}
        px={{ sm: 12, xs: 2 }}
        mt={{ sm: 8, xs: 6 }}
        mb={8}
      >
        <Typography
          component={"h2"}
          variant="h4"
          sx={{
            fontWeight: "500",
            fontSize: "2rem",
            color: "var(--color-primary2)",
            opacity: 0.7,
            textTransform: "capitalize",
            mb: 4,
          }}
        >
          Sách liên quan
        </Typography>
        <ListBookView
          paginationCustomize={paginationCustomize}
          dataList={booksRelated}
          classNameSwiper={"book-recommend-carousel"}
          spacebetween={width < BREAK_POINTS.xs ? 5 : 20}
          slideCardPerView={width < BREAK_POINTS.xs ? 2.6 : 4.6}
        ></ListBookView>
      </Stack>
    </Stack>
  );
}
