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

export default function FreeModeCarousel({
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
        {dataList &&
          dataList.map((data, index) => {
            return (
              <SwiperSlide key={data.id} className="swiperSlideCard">
                {data.component}
              </SwiperSlide>
            );
          })}
      </Swiper>
    </>
  );
}
