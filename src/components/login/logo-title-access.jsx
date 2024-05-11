import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import logo from "../../assets/images/logo-dtvt.png";
import css from "./logo-title-access.module.css";
export default function LogoTitleAccess() {
  return (
    <Stack className={css.container} direction={"column"} alignItems={"center"}>
      <img width={"100%"} height={"auto"} alt="logo-access" src={logo}></img>
      <Typography className={css.title} component={"h1"} variant="h6">
        Chào mừng quay lại
      </Typography>
      <Box className={css.desc} component={"p"}>
        Đăng Nhập Để Xem Thư Viện Của Bạn
      </Box>
    </Stack>
  );
}
