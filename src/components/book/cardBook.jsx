import { Box, Button, Stack, Typography } from "@mui/material";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingBag4Fill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useAddBookToCartStudent } from "../../hooks/apis/cart";
import style from "./cardBook.module.css";
import { useNavigate } from "react-router-dom";

export default function CardBook({
  idBook,
  img = "https://placehold.co/120x170",
  title = "title book",
  author = "author book",
  yearRelease = "2024",
  rating = 4.5,
  bookQuantity = 1,
  isSkeletonLoading = false,
  isHiddenWhenOutOfStock = true,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [widthCard, setWidthCard] = useState(0);

  const [isLoadingData, setIsLoadingData] = useState({
    status: false,
    message: "",
  });

  const flagLoading = useRef({ idToast: -1 });

  useEffect(() => {
    if (isLoadingData.status) {
      flagLoading.current.idToast = toast.loading(isLoadingData.message, {
        position: "top-center",
      });
    } else {
      if (flagLoading.current.idToast !== -1) {
        toast.dismiss(flagLoading.current.idToast);
        flagLoading.current.idToast = -1;
      }
    }
  }, [isLoadingData.status, isLoadingData.message]);

  useEffect(() => {
    const rectCard = cardRef.current?.getBoundingClientRect();
    if (rectCard) {
      setWidthCard(rectCard.width);
    }
  }, []);

  const {
    mutate: addBook,
    data: createCartStudentResponse,
    isSuccess,

    isLoading,
    error,
  } = useAddBookToCartStudent();

  async function handleAddToCart() {
    const dataStudent = JSON.parse(localStorage.getItem("studentData"));
    const payload = {
      userId: dataStudent?._id,
      book: {
        bookId: idBook,
        quantity: 1, //order thì lần được 1 cuốn chứ mấy
      },
    };

    setIsLoadingData((prev) => ({
      ...prev,
      status: true,
      message: "Đang thêm vào giỏ hàng...",
    }));

    await addBook(payload, {
      onSuccess: () => {
        setIsLoadingData((prev) => ({ ...prev, status: false, message: "" }));

        toast.success("Đã thêm vào giỏ hàng thành công", {
          position: "top-center",
        });
      },
      onError: () => {
        setIsLoadingData((prev) => ({ ...prev, status: false, message: "" }));
      },
    });
  }
  function handleAddToWishlist() {}
  function handleClickViewDetail() {
    navigate(`/book/${idBook}`);
  }
  function handleBorrowBookNow() {}

  if (isHiddenWhenOutOfStock && bookQuantity === 0) return <></>;

  return (
    <Box
      ref={cardRef}
      className={clsx(style.cardContainer, {
        [style.outOfStock]: bookQuantity === 0,
      })}
    >
      {bookQuantity === 0 && (
        <div className={clsx(style.coverOutOfStock)}>
          <Typography
            className={style.titleOutOfStock}
            component={"h3"}
            variant="h5"
          >
            Hết
          </Typography>
        </div>
      )}
      <div
        className={clsx(style.cover, { [style.hidden]: bookQuantity === 0 })}
      >
        {/* Danh sách các nút nhấn */}
        <div className={style.circleBtnContainer}>
          <button
            onClick={handleClickViewDetail}
            className={clsx(
              style.circleBtn,
              style.viewDetailtBtn,
              "effect-spread-shadow-click-btn",
              { [style.smallBtn]: widthCard < 150 }
            )}
            title="Xem chi tiết"
          >
            <FaEye />
          </button>
          <button
            className={clsx(
              style.circleBtn,
              style.cartBtn,
              "effect-spread-shadow-click-btn",
              {
                [style.smallBtn]: widthCard < 150,
              }
            )}
            onClick={handleAddToCart}
            title="Thêm vào giỏ hàng"
          >
            <RiShoppingBag4Fill></RiShoppingBag4Fill>
          </button>

          <button
            className={clsx(
              style.circleBtn,
              style.wishlistBtn,
              "effect-spread-shadow-click-btn",
              { [style.smallBtn]: widthCard < 150 }
            )}
            onClick={handleAddToWishlist}
            title="Thêm vào danh sách yêu thích"
          >
            <FaRegHeart />
          </button>
        </div>
        <Button
          sx={{
            color: "var(--color-primary2)",
            background: "#fff",
          }}
          className={clsx({
            [style.smallBtnBuyNow]: widthCard < 150,
          })}
          onClick={handleBorrowBookNow}
        >
          Mượn Sách Ngay
        </Button>
      </div>
      <Box className={style.bookcard}>
        <Box className={style.cardImg}>
          <img
            loading="lazy"
            alt={`hinh-anh-${title}`}
            src={img}
            width={"100%"}
            height={"auto"}
          ></img>
        </Box>
        <Box className={style.contentContainer}>
          <p className={style.title}>{title}</p>
          <p className={style.author}>{author},</p>

          <Stack direction={"row"} justifyContent={"space-between"} mt={"4px"}>
            <Stack direction={"row"} gap={"2px"}>
              <p className={style.rating}>{rating}</p>
              <p
                style={{
                  fontSize: "10px",
                  color: "#a7a7a7",
                }}
              >
                /5
              </p>
            </Stack>

            <p className={style.releaseYear}> {yearRelease}</p>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
