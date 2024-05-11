import React from "react";
import style from "./cardBook.module.css";
import { Box, Stack } from "@mui/material";

export default function CardBook({
  img = "https://placehold.co/120x170",
  title = "title book",
  author = "author book",
  yearRelease = "2024",
  rating = 4.5,
}) {
  return (
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
  );
}
