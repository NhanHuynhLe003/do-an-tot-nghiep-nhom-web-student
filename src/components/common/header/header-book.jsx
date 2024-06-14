import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, InputBase, Paper, Stack } from "@mui/material";
import clsx from "clsx";
import React from "react";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import theme from "../../../theme";
import IMenuListFloat from "../../IMenuListFloat";
import AccountInfo from "./components/account-info";
import style from "./header-book.module.css";

export default function HeaderBook({ ref, topPositon = 0 }) {
  const [searchBook, setSearchBook] = React.useState("");
  function handleSearchBook(value) {
    setSearchBook(value);
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
          ListButtonContent={<AccountInfo></AccountInfo>}
        ></IMenuListFloat>
      </Stack>
    </header>
  );
}
