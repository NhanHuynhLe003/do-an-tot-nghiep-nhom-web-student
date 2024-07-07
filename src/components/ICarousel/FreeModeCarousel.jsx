import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

// import required modules
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import clsx from "clsx";
import { Box, Skeleton, Stack } from "@mui/material";

export default function FreeModeCarousel({
  isHiddenWhenOutOfStock = true,
  isLoadingData = false,
  classNameSwiper,
  dataList,
  paginationCustomize,
  slidesPerView = 3,
  isFreeMode = true,
  isPagination = false,
  spaceBetween = 30,
}) {
  return (
    <>
      <Swiper
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        freeMode={isFreeMode}
        pagination={isPagination && paginationCustomize}
        modules={[FreeMode, Pagination, Autoplay]}
        className={clsx("free-mode-carousel", classNameSwiper)}
      >
        {!isLoadingData
          ? dataList &&
            dataList
              .filter((data) =>
                isHiddenWhenOutOfStock ? data.bookQuantity > 0 : data
              )
              .map((data, index) => {
                return (
                  <SwiperSlide key={data.id} className="swiperSlideCard">
                    {data.component}
                  </SwiperSlide>
                );
              })
          : new Array(10).fill(0).map((_, index) => {
              return (
                <SwiperSlide
                  key={Date.now() + index}
                  className="swiperSlideCard"
                >
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ position: "relative" }}>
                      {/* Dùng img tạm để lấy height cho skeleton */}
                      <img
                        style={{
                          opacity: 0,
                        }}
                        src="https://placehold.co/120x170"
                        alt="temporary-img-loading"
                        width={"100%"}
                        height={"auto"}
                      ></img>
                      <Skeleton
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 2,
                          width: "100%",
                          height: "100%",
                        }}
                        variant="rectangular"
                      />
                    </Box>
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "13px", width: "80%" }}
                    />
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "11px", width: "50%" }}
                    />
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: "11px", width: "30%" }}
                      />
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: "11px", width: "20%" }}
                      />
                    </Stack>
                  </Box>
                </SwiperSlide>
              );
            })}
      </Swiper>
    </>
  );
}
