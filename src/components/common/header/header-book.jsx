import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, InputBase, Paper, Stack } from "@mui/material";
import clsx from "clsx";
import React from "react";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import theme from "../../../theme";
import IMenuListFloat from "../../IMenuListFloat";
import AccountInfo from "./components/account-info";
import style from "./header-book.module.css";
import { useStudentLogout } from "../../../hooks/apis/access";
import { useNavigate } from "react-router-dom";

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

export default function HeaderBook({ ref, topPositon = 0 }) {
  const navigate = useNavigate();
  const {
    mutate: logout,
    data: logoutResponse,
    isLoading,
    error,
  } = useStudentLogout();
  const [searchBook, setSearchBook] = React.useState("");
  function handleSearchBook(value) {
    setSearchBook(value);
  }

  function handleClickMenuItem(mark) {
    if (mark.tag === "logout") {
      // Gỡ Token khỏi localStorage đồng thời gọi API logout để xóa token trên server
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("studentData");
      logout();

      // Chuyển hướng về trang login
      navigate("/login");
    }
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
            width: "30%",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Tìm kiếm sách, tác giả"
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
        <Box width={"10%"}></Box>

        <Stack className={style.timeBox} direction={"row"} gap={"4rem"}>
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

        <Box width={"2%"}></Box>

        <IMenuListFloat
          fnClickItem={handleClickMenuItem}
          menuListItems={listMenuItemFloat}
          ListButtonContent={<AccountInfo></AccountInfo>}
        ></IMenuListFloat>
      </Stack>
    </header>
  );
}
