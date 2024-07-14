import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import logo from "../../assets/images/logo-dtvt.png";
import css from "./logo-title-access.module.css";
export default function LogoTitleAccess({
  title = "Chào mừng quay lại",
  desc = "Đăng Nhập Để Xem Thư Viện Của Bạn",
}) {
  return (
    <Stack className={css.container} direction={"column"} alignItems={"center"}>
      <img width={"100%"} height={"auto"} alt="logo-access" src={logo}></img>
      <Typography className={css.title} component={"h1"} variant="h6">
        {title}
      </Typography>
      <Box className={css.desc} component={"p"}>
        {desc}
      </Box>
    </Stack>
  );
}
