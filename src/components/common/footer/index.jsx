import { Box } from "@mui/material";
import React from "react";
import style from "./footer.module.css";

export default function Footer() {
  return (
    <Box>
      <h5 className={style.license}>
        © 2024 BM Điện tử Viễn thông - CĐ Kỹ thuật Cao Thắng
      </h5>
    </Box>
  );
}
