import { Box, Button, Stack } from "@mui/material";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingBag4Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import { useAddBookToCartStudent } from "../../hooks/apis/cart";
import style from "./cardBook.module.css";

export default function CardBook({
  idBook,
  img = "https://placehold.co/120x170",
  title = "title book",
  author = "author book",
  yearRelease = "2024",
  rating = 4.5,
}) {
  const [isLoadingData, setIsLoadingData] = useState({
    status: false,
    message: "",
  });

  useEffect(() => {
    isLoadingData.status &&
      toast.update(isLoadingData.message, { position: "top-center" });
  }, [isLoadingData.status, isLoadingData.message]);

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
        toast.error("Thêm vào giỏ hàng thất bại", {
          position: "top-center",
        });
      },
    });
  }
  function handleAddToWishlist() {}
  function handleClickViewDetail() {}
  function handleBorrowBookNow() {}
  return (
    <Box className={style.cardContainer}>
      <div className={style.cover}>
        {/* Danh sách các nút nhấn */}
        <div className={style.circleBtnContainer}>
          <button
            onClick={handleClickViewDetail}
            className={clsx(
              style.circleBtn,
              style.viewDetailtBtn,
              "effect-spread-shadow-click-btn"
            )}
            title="Xem chi tiết"
          >
            <FaEye />
          </button>
          <button
            className={clsx(
              style.circleBtn,
              style.cartBtn,
              "effect-spread-shadow-click-btn"
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
              "effect-spread-shadow-click-btn"
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
