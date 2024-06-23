import React, { useState } from "react";
import { BsCart2 } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { FiBookOpen } from "react-icons/fi";
import { MdOutlineShoppingBag } from "react-icons/md";
import { RxShare1 } from "react-icons/rx";
import { commentList } from "../../../data/arrays";
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
import CommentBook from "../../../components/bookDetail/commentBook";
import TextShowMore from "../../../components/bookDetail/textShowMore";
import { roundNumber } from "../../../utils";
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
  //================HOOKS=================

  const [currentBtnComment, setCurrentBtnComment] = React.useState(0);
  // Sử dụng useState để quản lý số lượng comment đã hiển thị
  const [visibleCount, setVisibleCount] = useState(7);
  const [showLoadingCmt, setShowLoadingCmt] = useState(false);

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

  return (
    <Stack direction={"column"}>
      {/* Section sach va thong tin chi tiet sach + comment */}
      <Grid
        container
        spacing={4}
        className={style.section1}
        sx={{
          "& > .book-img-detail-container": {
            pl: 0,
            pt: 0,
            mt: 4,
          },
          mt: 6,
        }}
        px={12}
      >
        {/* Anh cua sach */}
        <Grid
          item
          className={clsx("book-img-detail-container")}
          md={3}
          sm={4}
          xs={12}
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
          md={6}
          sm={5}
          xs={12}
        >
          <Typography
            component={"h1"}
            variant="h4"
            className={style.titleBook}
            fontWeight={500}
            mb={2}
          >
            {title}
          </Typography>
          <Stack direction={"row"} spacing={"2rem"} mb={4}>
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
                }}
              >
                <MdOutlineShoppingBag
                  fontSize={"1.75rem"}
                  style={{ marginRight: "0.5rem" }}
                ></MdOutlineShoppingBag>
                Mượn Sách
              </Button>
              <Button
                className={style.readBookBtn}
                title={"Hiện tại sách vẫn chưa có dữ liệu"}
                sx={{
                  color: "var(--color-white1)",
                  backgroundColor: "var(--color-secondary2)",
                  borderRadius: "5rem",
                  width: "15rem",
                  "&:hover": {
                    color: "var(--color-secondary2)",
                    backgroundColor: "var(--color-white1)",
                  },
                }}
              >
                <FiBookOpen
                  fontSize={"1.75rem"}
                  style={{ marginRight: "0.5rem" }}
                ></FiBookOpen>
                Đọc Sách
              </Button>
              <IconButton
                className={clsx(style.favouriteBtn, style.btnControlGroup)}
                sx={{
                  color: "var(--color-primary1)",
                  border: "1px solid var(--color-primary1)",
                }}
              >
                <FaRegHeart fontSize={"1.3rem"}></FaRegHeart>
              </IconButton>
              <IconButton
                className={style.btnControlGroup}
                sx={{
                  borderRadius: "50%",
                  color: "var(--color-primary1)",
                  border: "1px solid var(--color-primary1)",
                }}
              >
                <BsCart2 fontSize={"1.3rem"}></BsCart2>
              </IconButton>
              <IconButton
                className={style.btnControlGroup}
                sx={{
                  borderRadius: "50%",
                  color: "var(--color-primary1)",
                  border: "1px solid var(--color-primary1)",
                }}
              >
                <RxShare1 fontSize={"1.3rem"}></RxShare1>
              </IconButton>
            </Stack>

            {/* Mô tả sách */}
            <TextShowMore text={description}></TextShowMore>
          </Stack>

          {/* Comment Select Control */}
          <Stack direction={"row"} gap={"1rem"}>
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

        {/* Thong Tin Tac Gia */}
        <Grid item md={3} sm={3} xs={12} className={style.authorInformation}>
          <Stack direction={"column"} spacing={2}>
            <Typography
              component={"h2"}
              variant={"h5"}
              className={style.titleAuthor}
            >
              <span>Thông tin </span> <span>Tác giả</span>
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
