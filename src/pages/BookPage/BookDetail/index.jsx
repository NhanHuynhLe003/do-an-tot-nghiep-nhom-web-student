import React, { useEffect, useState } from "react";
import { BsCart2 } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { RxShare1 } from "react-icons/rx";
import { commentList } from "../../../data/arrays";
import style from "./book_detail.module.css";

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Rating,
  Stack,
  Typography
} from "@mui/material";
import clsx from "clsx";
import { format } from "date-fns";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FreeModeCarousel from "../../../components/ICarousel/FreeModeCarousel";
import CardBook from "../../../components/book/cardBook";
import CommentBook from "../../../components/bookDetail/commentBook";
import TextShowMore from "../../../components/bookDetail/textShowMore";
import { useWindowSize } from "../../../hooks";
import { useGetBookPublishDetailById } from "../../../hooks/apis/books/useGetBookPublishDetailById";
import { useGetBooksByCategoryId } from "../../../hooks/apis/books/useGetBooksByCategoryId";
import { useAddBookToCartStudent } from "../../../hooks/apis/cart";
import { useCreateComment } from "../../../hooks/apis/comment/useCreateComment";
import { useGetComment } from "../../../hooks/apis/comment/useGetComment";
import { convertISO, roundNumber } from "../../../utils";
import { useGetRatings } from "../../../hooks/apis/comment/useGetRatings";
import RatingRankBoard from "../../../components/bookDetail/ratingRankBoard";
export default function BookDetailPage({
  comments = commentList,
}) {
  const dataStudent = JSON.parse(localStorage.getItem("studentData"));
  const { bookId } = useParams();
  const navigate = useNavigate();

  const { width: windowWidth } = useWindowSize();
  const [commentsSize, setCommentsSize] = useState(0);
  const [currentBtnComment, setCurrentBtnComment] = React.useState(0);
  // Sử dụng useState để quản lý số lượng comment đã hiển thị
  const [dataComments, setDataComments] = useState(comments);
  const [limitComments, setLimitComments] = useState(5);
  const [showLoadingCmt, setShowLoadingCmt] = useState(false);
  const [booksRelated, setBooksRelated] = useState([]);
  const [bookDetail, setBookDetail] = useState({});
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(
    "667bb9c1f159a0af59debd15"
  );
  const [contentReply, setContentReply] = React.useState("");
  const [isRatingMode, setIsRatingMode] = React.useState(false);
  const [userRating, setUserRating] = React.useState(0);
  const [ratingRankData, setRatingRankData] = React.useState({});

  const contentBoxRef = React.useRef(null);

  const { mutate: createComment } = useCreateComment();
  const { data: commentListData } = useGetComment({
    bookId: bookId,
    parentCommentId: null,
    limit: limitComments,
    isRating: isRatingMode,
  });
  const {data: listRatingOfBook} = useGetRatings({bookId: bookId});

  const {
    data: bookPublishDetail,
    isLoading: isLoadingBookPublishDetail,
    error: errorBookPublishDetail,
  } = useGetBookPublishDetailById({ bookId: bookId });
  // Lấy ra list các cuốn sách có cùng thể loại
  const {
    data: bookListCategory,
    isLoading: isLoadingData,
  } = useGetBooksByCategoryId({
    categoryId: currentCategory,
  });
  const { mutate: addBook } = useAddBookToCartStudent();

  const handleSubmitComment = () => {
    if(isRatingMode && userRating === 0) {
      toast.warning("Vui lòng chọn số sao đánh giá !", {
        position: "top-right",
      });
      return;
    }

    setIsLoadingComment(true);

    createComment(
      {
        bookId,
        userId: dataStudent?._id,
        content: contentReply,
        parentId: null,
        rating: userRating,
        isRating: isRatingMode,
      },
      {
        onSuccess: () => {
          setIsLoadingComment(false);
          handleHideCommentBox();
        },
        onError: () => {
          toast.error(
            "Có lỗi xảy ra khi phản hồi bình luận, vui lòng thử lại !"
          );
          setIsLoadingComment(false);
        },
      }
    );
  };

  const handleCommentInputKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleHideCommentBox();
    }
  }

  useEffect(() => {
    if(listRatingOfBook){
      const ratingData = {...listRatingOfBook?.data?.metadata};
      console.log("ratingData:::::", ratingData);
      setRatingRankData(ratingData);
    }
  },[listRatingOfBook]);

  useEffect(() => {
    // Kiểm tra xem sách hiện tại đã có dữ liệu chưa
    if (
      bookPublishDetail &&
      bookPublishDetail.data &&
      bookPublishDetail.data.metadata
    ) {
      const dataBook = bookPublishDetail.data.metadata;
      if (
        dataBook &&
        dataBook.categoryBookList &&
        dataBook.categoryBookList.length > 0
      ) {
        // lấy category của cuốn sách
        setCurrentCategory(dataBook.categoryBookList[0]._id);
      }
      setBookDetail(dataBook);
    }
  }, [bookPublishDetail]);

  //================FUNCTION HANDLER=================

  const handleChangeBtnComment = (mode = "comment") => {
    return () => {
      if (mode === "comment") {
        setCurrentBtnComment(0);
        setIsRatingMode(false);
      } else {
        setCurrentBtnComment(1);
        setIsRatingMode(true);
      }
    };
  };

  const handleHideCommentBox = () => {
    setContentReply("");
    setUserRating(0);
  };

  const handleChangeContentReply = (e) => {
    const textarea = contentBoxRef.current;
    // Đặt chiều cao về auto để reset trước khi tính toán kích thước
    textarea.style.height = "auto";

    // Đặt chiều cao mới dựa trên chiều cao cuộn (scrollHeight)
    textarea.style.height = `${textarea.scrollHeight}px`;
    setContentReply(e.target.value);
  };

  // Hàm để xử lý sự kiện bấm vào nút "xem thêm"

  const handleShowMoreComments = async (e) => {
    setShowLoadingCmt(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setShowLoadingCmt(false);
    const newLimit = limitComments + 5;
    setLimitComments(newLimit);
  };

  const handleChangeRating = (e) => {
    const value = e.target.value;
    setUserRating(value);
  }

  const handleBorrowBookNow = (mode = 'borrow_now') => {
    const payload = {
      userId: dataStudent?._id,
      book: {
        bookId: bookDetail?._id,
        quantity: 1,
      },
    };
    addBook(payload, {
      onSuccess: () => {
        toast.success("Thêm sách thành công");
        if(mode==='borrow_now') navigate(`/checkout/${dataStudent?._id}`);
      },
    });
  };

  useEffect(() => {
    if (commentListData) {
      const totalComments = commentListData?.data?.metadata?.total;

      const newCommentList = commentListData?.data?.metadata?.comments?.map(
        (cmt) => {
          const date = cmt?.createdAt ? new Date(cmt?.createdAt) : new Date();
          return {
            ...cmt,
            createdAt: format(date, "dd-MM-yyyy"),
          };
        }
      );
      setCommentsSize(totalComments);
      setDataComments(newCommentList);
    }
  }, [commentListData]);

  useEffect(() => {
    if (
      bookListCategory &&
      bookListCategory.data &&
      bookListCategory.data.metadata
    ) {
      const dataRelatedBooks = bookListCategory.data.metadata.map((book) => ({
        id: book?._id,
        bookQuantity: book.book_quantity,
        component: (
          <CardBook
            isHiddenWhenOutOfStock={true}
            idBook={book?._id}
            img={book?.book_thumb}
            title={book?.book_name}
            rating={book?.book_ratingsAverage}
            bookQuantity={book?.book_quantity}
          ></CardBook>
        ),
      }));

      setBooksRelated(dataRelatedBooks);
    }
  }, [bookListCategory, bookId]);

  const paginationCustomize = {
    clickable: true,
    renderBullet: function (index, className) {
      //className nằm ở src/styles/swiper-slider.css
      return `<span class="${className} book-quotes-pagination"> </span>`;
    },
  };

  if (errorBookPublishDetail)
    return (
      <Stack
        width={"100%"}
        minHeight={"80vh"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Typography
          component={"h1"}
          variant={"h3"}
          textAlign={"center"}
          fontWeight={"bold"}
          sx={{
            color: "var(--color-primary2)",
            opacity: 0.7,
          }}
        >
          Sách không tồn tại
        </Typography>
      </Stack>
    );

  if (isLoadingBookPublishDetail || isLoadingData)
    return (
      <Stack
        width={"100%"}
        minHeight={"80vh"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <CircularProgress size={48}></CircularProgress>
      </Stack>
    );

  return (
    <Stack direction={"column"}>
      {/* Section sach va thong tin chi tiet sach + comment */}
      <Grid
        container
        spacing={{
          sm: 4, // kích cỡ màn hình >600px
          xs: 0, // kích cỡ màn hình <= 600px
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
          md={4} // 600<kích cỡ màn hình <960
          sm={5}
          xs={12}
          mb={{
            xs: 6,
          }}
        >
          <Box className={style.imgBookContainer}>
            <img
              src={`${bookDetail?.book_thumb}`}
              alt={`anh-sach-${bookDetail?.book_name}`}
            />
          </Box>
        </Grid>

        {/* Thong tin sach */}
        <Grid
          item
          direction={"column"}
          className={style.bookInformation}
          md={7}
          sm={7}
          xs={12}
        >
          <Typography
            component={"h1"}
            variant="h3"
            className={style.titleBook}
            fontWeight={500}
            mt={6}
            mb={2}
            textAlign={{ xs: "center", sm: "left", fontSize: "2.75rem" }}
            sx={{
              mb: 4,
            }}
          >
            {/* Lấy ra tên quyển sách */}
            {bookDetail?.book_name}
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
                {roundNumber(bookDetail?.book_ratingsAverage || 4.5).toFixed(1)}
              </Box>
              {/* Hiển thị các ngôi sao */}
              <Rating
                name="read-only"
                value={roundNumber(bookDetail?.book_ratingsAverage || 4.5)}
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
              <b>{ratingRankData?.ratingCount || 0}</b> {" "} Đánh Giá
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
                {bookDetail?.book_author}
              </Typography>
            </Stack>

            {/* The Loai */}
            <Stack direction={"column"} className={style.infoText}>
              <Typography component={"p"} className={clsx(style.blurText)}>
                Thể Loại
              </Typography>
              <Typography component={"p"}>
                {bookDetail?.categoryBookList?.map((genre, index) => (
                  <Link
                    key={genre?._id}
                    to={"/book"}
                    className={clsx(
                      style.cateItemListContent,
                      style.contentTextInfo
                    )}
                  >
                    {genre?.name}
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
                {bookDetail?.book_publisher}
              </Typography>
            </Stack>

            {/* Năm Phát Hành */}
            <Stack direction={"column"} className={style.infoText}>
              <Typography component={"p"} className={clsx(style.blurText)}>
                Năm Phát Hành
              </Typography>
              <Typography
                component={"p"}
                className={style.contentTextInfo}
                textAlign={"center"}
              >
                {convertISO(
                  bookDetail?.book_publish_date || new Date().toISOString(),
                  "yyyy"
                ) || "unknown"}
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
                onClick={() => handleBorrowBookNow('borrow_now')}
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
                onClick={() => handleBorrowBookNow('add_to_cart')}
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
            <TextShowMore
              text={bookDetail?.book_desc || ""}
              textAlign="left"
            ></TextShowMore>
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
              onClick={handleChangeBtnComment("comment")}
            >
              Bình Luận ({dataComments?.length || 0})
            </Button>
            <Button
              variant="outlined"
              sx={{
                border: "none",
                color: currentBtnComment !== 1 && "var(--color-primary2)",
                opacity: currentBtnComment !== 1 && 0.6,

                "&:hover": { border: "none" },
              }}
              onClick={handleChangeBtnComment("rating")}
            >
              Đánh Giá và Nhận Xét ({ratingRankData?.ratingCount || 0})
            </Button>
          </Stack>
          <br />
          <Divider></Divider>
          <br />
          {isRatingMode && <RatingRankBoard rating={ratingRankData?.bookRating?.book_ratingsAverage} ratingCount={ratingRankData?.ratingCount} ratingDetail={ratingRankData?.ratings}/>}
          <Box width={"100%"} mt={2}>
            <Stack direction={"row"} gap={1}>
              <Avatar
                alt="Nguyen Van A"
                src={dataStudent?.profileImage}
                sx={{ width: 40, height: 40, marginRight: "0.25rem" }}
              />
              <Box width={'100%'} sx={{display: 'flex', flexDirection: 'column'}}>
              
              <h3>{dataStudent?.name}</h3>
              {isRatingMode && <Rating value={userRating} sx={{alignSelf: 'flex-end', my: '0.5rem',":hover": {
                opacity: 0.4
              }}} precision={0.5} onChange={handleChangeRating}/>}
              <textarea

                ref={contentBoxRef}
                style={{
                  marginTop: !isRatingMode && '1rem',
                  width: "100%",
                  resize: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderTop: "none",
                  background: "transparent",
                  outline: "none",
                  paddingBottom: "0",
                  lineHeight: "14px",
                  overflow: "hidden",
                }}
                value={contentReply}
                onKeyDown={handleCommentInputKeyDown}
                onChange={handleChangeContentReply}
                placeholder="Nhập nội dung phản hồi...."
              />
              </Box>
            </Stack>
            <Stack direction={"row"} mt={3} justifyContent={"flex-end"}>
              <Button
                onClick={handleHideCommentBox}
                type="button"
                variant="outlined"
                color="inherit"
                sx={{ borderRadius: 8, outline: "none", border: "none" }}
              >
                Hủy
              </Button>
              <Button
                type="button"
                variant="contained"
                color={contentReply ? "primary" : "inherit"}
                disabled={contentReply?.length === 0}
                sx={{ borderRadius: 8, outline: "none", border: "none" }}
                onClick={handleSubmitComment}
              >
                {isRatingMode ? "Đánh giá" : "Bình luận"}
              </Button>
            </Stack>
          </Box>
          {/* Comment List*/}
          <Box>
            <Stack direction={"column"} spacing={2} mt={4}>
              {isLoadingComment && (
                <Box className={style.loadingCmt} textAlign={"center"} pt={4}>
                  <CircularProgress size={50} />
                </Box>
              )}
              {!isLoadingComment && dataComments?.length ? (
                dataComments.map((cmt) => (
                  <CommentBook
                    commentId={cmt?._id}
                    rating={cmt?.rating}
                    key={cmt?._id}
                    parentId={cmt?._id}
                    bookId={bookId}
                    userId={dataStudent?._id || ""}
                    content={cmt?.comment_content}
                    date={cmt?.createdAt}
                    img={cmt?.comment_userId?.profileImage}
                    name={cmt?.comment_userId?.name}
                    isRatingMode={isRatingMode}
                  ></CommentBook>
                ))
              ) : (
                <Typography
                  component={"h3"}
                  variant="h6"
                  sx={{
                    color: "var(--color-primary2)",
                    opacity: 0.5,
                    textAlign: "center",
                  }}
                >
                  Chưa có bình luận
                </Typography>
              )}
            </Stack>
            {showLoadingCmt && (
              <Box className={style.loadingCmt} textAlign={"center"} pt={4}>
                <CircularProgress size={50} />
              </Box>
            )}

            {limitComments < commentsSize && (
              <Button sx={{ my: 4 }} onClick={handleShowMoreComments}>
                xem thêm bình luận
              </Button>
            )}
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
        {booksRelated && booksRelated?.length <= 0 ? (
          <Typography
            component={"h2"}
            variant="h5"
            textAlign={"center"}
            sx={{
              opacity: 0.6,
              textTransform: "capitalize",
            }}
          >
            Không có sách liên quan
          </Typography>
        ) : (
          <FreeModeCarousel
            spaceBetween={30} // khoang cách giữa các item
            isHiddenWhenOutOfStock={true}
            isLoadingData={isLoadingData}
            dataList={booksRelated}
            paginationCustomize={paginationCustomize}
            classNameSwiper={"Detail_Book_Swiper"}
            slidesPerView={windowWidth > 600 ? 4.4 : 2.6}
          ></FreeModeCarousel>
        )}
      </Stack>
    </Stack>
  );
}
