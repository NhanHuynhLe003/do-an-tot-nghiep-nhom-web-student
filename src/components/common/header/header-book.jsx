import SearchIcon from "@mui/icons-material/Search";
import {
  Badge,
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Stack,
  styled,
} from "@mui/material";
import { RiShoppingBag4Fill } from "react-icons/ri";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import theme from "../../../theme";
import IMenuListFloat from "../../IMenuListFloat";
import AccountInfo from "./components/account-info";
import style from "./header-book.module.css";
import { useStudentLogout } from "../../../hooks/apis/access";
import { useNavigate } from "react-router-dom";
import { Notifications } from "@mui/icons-material";
import IPopOverBtn from "../../IPopOverBtn";
import CartBookOrder from "./components/cartBookOrder";
import { useGetBooksInCart } from "../../../hooks/apis/cart";

const listMenuItemFloat = [
  {
    id: "menu-item-1",
    content: "Thông tin cá nhân",
    tag: "profile",
  },
  {
    id: "menu-item-2",
    content: "Đăng xuất",
    tag: "logout",
  },
];

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    border: `1px solid ${theme.palette.background.paper}`,
    right: -2,
    top: -2,
  },
}));

export default function HeaderBook({ ref, topPositon = 0 }) {
  const dataStudent = JSON.parse(localStorage.getItem("studentData"));

  const navigate = useNavigate();
  // Trigger API lấy danh sách sách trong giỏ hàng

  const {
    data: dataBooksInCartData,
    isLoading: isBooksInCartLoading,
    error: BooksInCartError,
  } = useGetBooksInCart(
    { cartUserId: dataStudent?._id || null },
    {
      keepPreviousData: true,
    }
  );

  const [cartUser, setCartUser] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const {
    mutate: logout,
    data: logoutResponse,
    isLoading,
    error,
  } = useStudentLogout();
  const [searchBook, setSearchBook] = React.useState("");
  const [cartProductCount, setCartProductCount] = React.useState(0);

  useEffect(() => {
    const userAuth = JSON.parse(localStorage.getItem("studentData"));
    if (userAuth) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    setCartUser(dataBooksInCartData?.data?.metadata);
  }, [dataBooksInCartData]);

  function handleSearchBook(value) {
    setSearchBook(value);
  }

  function handleClickLoginNow() {
    navigate("/login");
  }

  function handleClickMenuItem(mark) {
    if (mark.tag === "logout" && isLoggedIn) {
      // Gỡ Token khỏi localStorage đồng thời gọi API logout để xóa token trên server
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("studentData");
      logout();

      // Chuyển hướng về trang login
      navigate("/login");
    }

    if (mark.tag === "profile") {
      navigate("/student/information");
    }
  }

  function handleGetCartProductCount(count) {
    setCartProductCount(count);
  }

  return (
    <header
      className={clsx("animate__animated animate__fadeInDown", style.header, {
        [style.headerOrigin]: topPositon <= 35,
      })}
      ref={ref}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        // mt={3}
        py={1}
        position={"relative"}
        className={style.headerContainer}
        justifyContent={"space-between"}
      >
        <Paper
          component="form"
          sx={{
            background: "transparent",
            borderRadius: "5rem",
            p: "2px 8px",
            display: "flex",
            alignItems: "center",
            maxHeight: "2.5rem",
            width: "24%",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Tìm kiếm sách, tác giả...."
            inputProps={{ "aria-label": "search" }}
            onChange={handleSearchBook}
          />
          <IconButton
            type="button"
            sx={{ p: "10px", color: theme.colors.primary1 }}
            aria-label="search"
          >
            <SearchIcon
              sx={{
                color: theme,
              }}
            />
          </IconButton>
        </Paper>

        <Stack className={style.timeBox} direction={"row"} gap={"2rem"}>
          <Box className={style.boxHour}>
            <FaRegClock
              color={theme.colors.primary1}
              fontSize={"1.25rem"}
            ></FaRegClock>
            <p className={style.time}>09:00 AM</p>
          </Box>
          <Box className={style.boxDate}>
            <FaRegCalendarAlt
              color={theme.colors.primary1}
              fontSize={"1.25rem"}
            ></FaRegCalendarAlt>
            <p>4-Mar-2023</p>
          </Box>
        </Stack>

        <Stack direction={"row"} gap={"0.25rem"}>
          <IPopOverBtn
            wrapperStyle={{ marginTop: "0.5rem" }}
            ButtonComponent={
              <Button
                sx={{
                  color: theme.colors.primary2,
                }}
              >
                <StyledBadge badgeContent={0} color="error">
                  <Notifications
                    sx={{
                      fontSize: "1.75rem",
                      color: "var(--color-primary2)",
                    }}
                  ></Notifications>
                </StyledBadge>
              </Button>
            }
            ComponentPopOver={<Box>Không có thông báo</Box>}
          ></IPopOverBtn>

          <IPopOverBtn
            wrapperStyle={{ marginTop: "0.5rem" }}
            ButtonComponent={
              <Button
                sx={{
                  color: theme.colors.primary2,
                }}
              >
                <StyledBadge badgeContent={cartUser?.length} color="error">
                  <RiShoppingBag4Fill
                    fontSize={"1.75rem"}
                    color="var(--color-primary2)"
                  ></RiShoppingBag4Fill>
                </StyledBadge>
              </Button>
            }
            ComponentPopOver={
              //=====================Cart Hiển thị khi click vào====================
              <Box>
                <CartBookOrder
                  handleGetCartProductCount={handleGetCartProductCount}
                ></CartBookOrder>
              </Box>
            }
          ></IPopOverBtn>

          {isLoggedIn ? (
            <IMenuListFloat
              fnClickItem={handleClickMenuItem}
              menuListItems={listMenuItemFloat}
              ListButtonContent={
                <AccountInfo
                  nameUser={dataStudent?.name}
                  img={dataStudent?.profileImage}
                ></AccountInfo>
              }
            ></IMenuListFloat>
          ) : (
            <Button
              sx={{
                color: theme.colors.primary1,
                padding: "0.5rem 1rem",
              }}
              onClick={handleClickLoginNow}
              variant="text"
            >
              Đăng Nhập Ngay
            </Button>
          )}
        </Stack>
      </Stack>
    </header>
  );
}
