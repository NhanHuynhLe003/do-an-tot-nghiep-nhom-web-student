import { Typography } from "@mui/material";
import React from "react";
import style from "./textShowMore.module.css";

export default function TextShowMore({ text, textAlign = "center" }) {
  return (
    <Typography
      component={"p"}
      mt={"1rem"}
      mb={"1rem"}
      fontSize={"1.15rem"}
      fontWeight={400}
      color={"var(--color-primary2)"}
      sx={{
        opacity: 0.9,
      }}
      textAlign={textAlign}
    >
      {text}
    </Typography>
  );
}
