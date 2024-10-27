import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoMdReturnLeft } from "react-icons/io";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import IQuantityInput from "../../../components/IQuantityInput";
import {
  useDeleteBookInCart,
  useUpdateBookQuantiyInCart,
} from "../../../hooks/apis/cart";
import { useGetCheckoutReview } from "../../../hooks/apis/checkout_order";
import { useOrderBookStudent } from "../../../hooks/apis/checkout_order/useOrderBookStudent";
import styles from "./BookCheckout.module.css";
import SubmitDialog from "../../../components/IDialog/SubmitDialog";

export default function BookCheckout() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const studentData = JSON.parse(localStorage.getItem("studentData"));

  const [checkoutInformation, setCheckoutInformation] = useState([]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { mutate: orderBook } = useOrderBookStudent();

  const { data: checkoutData, isLoading: isLoadingCheckoutData } =
    useGetCheckoutReview({
      cartUserId: studentData?._id,
      userInfo: {
        name: studentData?.name,
        email: studentData?.email,
        userId: studentData?._id,
        class: studentData?.classStudent,
      },
      dateReturnBook: "06-30-2024",
    });
  const { mutate: updateBookQuantityInCart } = useUpdateBookQuantiyInCart();
  const { mutate: deleteBookInCart, data: dataDeleteBookInCartData } =
    useDeleteBookInCart();

  function handleDeleteBookInCart(bookId) {
    deleteBookInCart({
      userId: studentData._id,
      bookId: bookId,
    });
  }

  useEffect(() => {
    setCheckoutInformation(checkoutData?.data?.metadata || []);
  }, [checkoutData]);

  useEffect(() => {
    const email = checkoutInformation?.userInfo?.email;
    const name = checkoutInformation?.userInfo?.name;
    const classStudent = checkoutInformation?.userInfo?.class;

    setValue("email", email);
    setValue("fullName", name);
    setValue("class", classStudent);
  }, [checkoutInformation, setValue]);

  const currentDate = dayjs();
  const onSubmit = (data) => {
    const newData = { ...data };
    newData.borrowDate = dayjs(newData.borrowDate).format("DD/MM/YYYY");
    newData.returnDate = dayjs(newData.returnDate).format("DD/MM/YYYY");

    orderBook(
      {
        userId: studentData?._id,
        cartId: studentData?._id,
        userInfo: { ...newData },
        dateReturnBook: newData.returnDate,
        dateBorrowBook: newData.borrowDate,
      },
      {
        onSuccess: (data) => {
          navigate("/book/my-bookshelf");
          toast.success("Xác nhận thông tin mượn sách thành công!", {
            position: "top-center",
          });
        },
      }
    );
  };

  if (studentData && userId !== studentData?._id)
    return <Navigate to="/login"></Navigate>;

  if (isLoadingCheckoutData)
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={"large"}></CircularProgress>
      </Box>
    );

  if (!checkoutData) {
    return <Navigate to="/book"></Navigate>;
  }

  return (
    <Box>
      <Stack direction={"row"} sx={{ my: "2rem" }} className={styles.returnBtn}>
        <Button
          size="small"
          type="text"
          sx={{
            color: "var(--color-primary2)",
            fontSize: "1.25rem",
            fontWeight: "bold",
            opacity: "0.6",
          }}
        >
          <IoMdReturnLeft></IoMdReturnLeft>
        </Button>
        <Typography
          component={"h1"}
          variant="h6"
          sx={{
            opacity: "0.6",
            color: "var(--color-primary2)",
          }}
        >
          Checkout
        </Typography>
      </Stack>
      <Stack
        id={styles.BookCheckout}
        sx={{
          width: "90%",
          margin: "3rem auto",
        }}
        direction={"row"}
        justifyContent={"space-between"}
      >
        <Stack className={styles.left} direction={"column"} gap={"1rem"}>
          {checkoutInformation &&
            checkoutInformation?.booksInCart?.map((book, index) => (
              <Stack
                className={styles.cardBookCheckout}
                direction={"row"}
                gap={"1rem"}
                key={book.bookId}
              >
                <Box className={styles.imgContainer}>
                  <img
                    src={
                      book.bookThumb || "https://via.placeholder.com/150x200"
                    }
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                    alt="img-book-01"
                  ></img>
                </Box>
                <Stack
                  direction={"row"}
                  className={styles.contentBookCheckout}
                  justifyContent={"space-between"}
                >
                  <Stack direction={"column"} gap={"0.25rem"}>
                    <Typography
                      component={"h3"}
                      fontSize={"1.25rem"}
                      mb={"0"}
                      fontWeight={"600"}
                      title={book.bookName}
                      sx={{
                        color: "var(--color-primary2)",
                        whiteSpace: "wrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "15rem",
                        fontSize: "1.5rem",
                        "@media (max-width: 960px)": {
                          fontSize: "1.1rem",
                          width: "12rem",
                        },

                        "@media (max-width: 560px)": {
                          fontSize: "0.75rem",
                          width: "7rem",
                        },
                      }}
                    >
                      {book.bookName}
                    </Typography>
                    <Typography
                      component={"p"}
                      fontSize={"1rem"}
                      sx={{
                        opacity: 0.4,

                        "@media (max-width: 960px)": {},
                        "@media (max-width: 560px)": {
                          fontSize: "0.7rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "80%",
                        },
                      }}
                    >
                      {book?.bookCategory[0]?.name}
                    </Typography>
                  </Stack>
                  <Stack alignItems={"flex-start"} pt={2}>
                    <Box
                      component={"span"}
                      title="Không thể chỉnh sửa số lượng sách trong checkout, bấm vào giỏ hàng để thay đổi!"
                      sx={{
                        border: '1px solid #ccc',
                        bgcolor: '#d1d5db',
                        cursor: 'not-allowed',
                        width: "fit-content",
                        height: "fit-content",
                        borderRadius: "1rem",
                        minWidth: '3rem',
                        textAlign: 'center',
                        color: "#9ca3af",
                        p: "0.15rem 0.5rem",
                      }}
                    >{book?.bookQuantity}</Box>
                  </Stack>

                  <SubmitDialog
                    propsButtonShowInfo={{
                      size: "small",
                    }}
                    buttonShowInfo={{
                      variant: "text",
                      color: "error",
                      title: "X",
                    }}
                    styleBtnShowInfo={{
                      borderRadius: 8,
                      height: "2rem",
                      mt: "0.75rem",
                      fontSize: "0.8rem",
                      ":hover": {
                        color: "#fff",
                        backgroundColor: "red",
                      },
                    }}
                    acceptButtonInfo={{
                      title: "Xác nhận",
                      color: "error",
                    }}
                    cancelButtonInfo={{
                      title: "Hủy",
                      color: "inherit",
                    }}
                    dialogInfo={{
                      contentDialogTitle: "Xác nhận xóa",
                      contentDialogDesc:
                        "Bạn có chắc chắn xóa quyển sách  này khỏi giỏ hàng chứ? ",
                    }}
                    fncHandleClickAccept={(status) => {
                      if (status === 1) {
                        handleDeleteBookInCart(book?.bookId);
                      }
                    }}
                  />
                </Stack>
              </Stack>
            ))}
        </Stack>

        <Stack
          className={styles.right}
          sx={{
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            borderRadius: "0.5rem",
            overflow: "hidden",
          }}
          direction={"column"}
        >
          <Typography
            component={"h2"}
            className={styles.titleFormBook}
            variant="h5"
            sx={{
              textAlign: "center",
              color: "#fff",
              padding: "0.25rem",
              textTransform: "capitalize",
              mb: "1.5rem",
            }}
          >
            Thông tin mượn sách
          </Typography>
          <Box
            component={"form"}
            className={styles.formContainer}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Stack direction={"row"} gap={"1rem"}>
              <Controller
                name="fullName"
                control={control}
                defaultValue={checkoutInformation?.userInfo?.name || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    sx={{ width: "65%" }}
                    label="Họ và Tên"
                    error={!!errors.fullName}
                    helperText={errors.fullName ? errors.fullName.message : ""}
                  />
                )}
                rules={{ required: "Họ và Tên không thể bỏ trống" }}
              />
              <Controller
                name="class"
                control={control}
                defaultValue={checkoutInformation?.userInfo?.class || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    sx={{ width: "35%" }}
                    label="Lớp"
                    error={!!errors.class}
                    helperText={errors.class ? errors.class.message : ""}
                  />
                )}
                rules={{ required: "Không thể bỏ trống Lớp" }}
              />
            </Stack>
            <Controller
              name="email"
              control={control}
              defaultValue={
                checkoutInformation?.userInfo?.email || "abc@123.com"
              }
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  fullWidth
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                />
              )}
              rules={{
                required: "Email không thể bỏ trống",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Email không hợp lệ",
                },
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="borrowDate"
                control={control}
                defaultValue={currentDate}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Ngày mượn sách"
                    value={field.value}
                    disabled
                    readOnly
                  />
                )}
              ></Controller>
              <Controller
                name="returnDate"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Ngày trả sách"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    slotProps={{
                      textField: {
                        error: !!errors.returnDate,
                        helperText: errors.returnDate
                          ? errors.returnDate.message
                          : "",
                      },
                    }}
                  />
                )}
                rules={{
                  required: "Ngày trả sách là bắt buộc",
                  validate: (value) => {
                    const today = dayjs();
                    const minReturnDate = today.add(1, "day");
                    const maxReturnDate = today.add(6, "month");

                    if (!value) {
                      return "Ngày trả sách là bắt buộc";
                    } else if (dayjs(value).isBefore(today, "day")) {
                      return "Ngày trả sách không thể ít hơn ngày hiện tại";
                    } else if (dayjs(value).isBefore(minReturnDate, "day")) {
                      return "Ngày trả sách phải tối thiểu hơn ngày hiện tại 1 ngày";
                    } else if (dayjs(value).isAfter(maxReturnDate, "day")) {
                      return "Ngày trả sách không được vượt quá 6 tháng";
                    }
                    return true;
                  },
                }}
              />
            </LocalizationProvider>
            <br />
            <Button variant="text" type="submit" fullWidth>
              Xác nhận thông tin
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
