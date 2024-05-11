import React from "react";
import style from "./carouselCard.module.css";
import { Box, Stack, Typography } from "@mui/material";
import PaginationCarousel from "../ICarousel/PaginationCarousel";

export default function CarouselCard({
  dataList,
  dotCustomize,
  swiperClassName,
}) {
  return (
    <Box className={style.CarouselCard}>
      <Typography className={style.titleCard} component={"h2"} variant="h6">
        Những Câu Danh Ngôn
      </Typography>

      <PaginationCarousel
        className={swiperClassName}
        dataList={dataList}
        paginationCustomize={dotCustomize}
      ></PaginationCarousel>
    </Box>
  );
}
