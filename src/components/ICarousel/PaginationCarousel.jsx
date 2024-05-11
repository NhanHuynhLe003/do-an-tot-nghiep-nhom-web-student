import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import style from "./ICarousel.module.css";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination, Autoplay } from "swiper/modules";

export default function PaginationCarousel({
  className = "pagination-carousel",
  dataList = [],
  paginationCustomize = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + "</span>";
    },
  },
  isAutoPlay = true,
  isFreeMode = false,
}) {
  return (
    <>
      <Swiper
        freeMode={isFreeMode}
        autoplay={
          isAutoPlay
            ? {
                delay: 3000,
                disableOnInteraction: false,
              }
            : {}
        }
        pagination={paginationCustomize}
        modules={[Pagination, Autoplay]}
        className={className}
      >
        {dataList &&
          dataList.map((data, index) => (
            <SwiperSlide key={data.component + index}>
              {data.component}
            </SwiperSlide>
          ))}
      </Swiper>
    </>
  );
}
