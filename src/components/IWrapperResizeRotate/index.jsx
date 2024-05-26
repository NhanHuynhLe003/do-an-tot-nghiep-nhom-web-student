import React, { useState, useRef, useEffect } from "react";
import styles from "./IWrapperResizeRotate.module.css";
import { FaArrowRotateRight } from "react-icons/fa6";
import { Box } from "@mui/material";

const IWrapperResizeRotate = ({ children }) => {
  const [rotate, setRotate] = useState(0);
  const [size, setSize] = useState({ width: 200, height: 30 });

  const paddingWrapperContainer = useRef(8);
  const borderWrapperContainer = useRef(2);
  const elementRef = useRef(null);
  const childrenContainerRef = useRef(null);

  // Xử lý sự kiện khi bắt đầu kéo để xoay
  const handleMouseDownRotate = (e) => {
    e.preventDefault();
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const handleMouseMoveRotate = (e) => {
      /**
      dx và dy đại diện cho sự thay đổi tọa độ theo trục X và Y từ trung tâm của phần tử.
      Math.atan2(dy, dx) tính toán góc (theo radian) từ trục X đến điểm (dx, dy).
      angle = 90 + Math.atan2(dy, dx) * (180 / Math.PI) chuyển đổi góc từ radian sang độ và thêm 90 độ để điều chỉnh góc xoay cho phù hợp với hệ tọa độ màn hình.
       */

      const dx = (e.clientX || e.touches[0].clientX) - centerX;
      const dy = (e.clientY || e.touches[0].clientY) - centerY;
      const angle = 90 + Math.atan2(dy, dx) * (180 / Math.PI);
      setRotate(angle);
    };

    const handleMouseUpRotate = () => {
      window.removeEventListener("mousemove", handleMouseMoveRotate);
      window.removeEventListener("mouseup", handleMouseUpRotate);
      window.removeEventListener("touchmove", handleMouseMoveRotate);
      window.removeEventListener("touchend", handleMouseUpRotate);
    };

    window.addEventListener("mousemove", handleMouseMoveRotate);
    window.addEventListener("mouseup", handleMouseUpRotate);
    window.addEventListener("touchmove", handleMouseMoveRotate);
    window.addEventListener("touchend", handleMouseUpRotate);
  };

  // Xử lý sự kiện khi bắt đầu kéo để thay đổi kích thước
  const handleMouseDownResize = (e) => {
    e.preventDefault();
    /**
      startX = e.clientX || e.touches[0].clientX lưu lại tọa độ X ban đầu của chuột hoặc cảm ứng.
      startY = e.clientY || e.touches[0].clientY lưu lại tọa độ Y ban đầu của chuột hoặc cảm ứng.
     */
    const startX = e.clientX || e.touches[0].clientX;
    const startY = e.clientY || e.touches[0].clientY;
    console.log("[BEFORE:::]", { startX, startY });

    /**
      startWidth = size.width lưu lại chiều rộng ban đầu của phần tử.
      startHeight = size.height lưu lại chiều cao ban đầu của phần tử.
     */
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMouseMoveResize = (e) => {
      //=> newWidth = chiều rộng box ban đầu + tọa độ kết thúc con trỏ - tọa độ ban đầu con trỏ
      const endX = e.clientX || e.touches[0].clientX;
      const endY = e.clientY || e.touches[0].clientY;
      const newWidth = startWidth + (endX - startX);
      const newHeight = startHeight + (endY - startY);
      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUpResize = () => {
      window.removeEventListener("mousemove", handleMouseMoveResize);
      window.removeEventListener("mouseup", handleMouseUpResize);
      window.removeEventListener("touchmove", handleMouseMoveResize);
      window.removeEventListener("touchend", handleMouseUpResize);
    };

    window.addEventListener("mousemove", handleMouseMoveResize);
    window.addEventListener("mouseup", handleMouseUpResize);
    window.addEventListener("touchmove", handleMouseMoveResize);
    window.addEventListener("touchend", handleMouseUpResize);
  };

  return (
    <div
      className={styles.wrapper}
      style={{
        border: `${borderWrapperContainer.current}px dashed var(--color-primary1)`,
        padding: paddingWrapperContainer.current,
        transform: `rotate(${rotate}deg)`, // (*) Xoay item
        // position: "absolute", //(*) Cho các vị trí không liên quan đến nhau dù resize cũng ko ảnh hưởng
      }}
    >
      <div
        ref={elementRef}
        style={{
          width: size.width,
          height: size.height,
        }}
        className={styles["resizable-box"]}
      >
        <Box
          ref={childrenContainerRef}
          component={"div"}
          className={"childrenContainer"}
          sx={{
            width: "100%",
            height: "100%",

            "& *": {
              width: "100%",
              height: "100%",
            },
            "& textarea": {
              padding: 0,
              width: "100%",
              height: "100%",
              border: "none",
              outline: "none",
              resize: "none",
              backgroundColor: "transparent",
            },
          }}
        >
          {/* Co the dung React.clone de clone ra 1 children moi */}
          {children}
        </Box>
        {/* Điều khiển xoay */}
        <div
          className={styles.rotateControl}
          onMouseDown={handleMouseDownRotate}
          onTouchStart={handleMouseDownRotate}
          // STyle cho nút xoay
          style={{
            position: "absolute",
            //Căn item ra giữa
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "1.5rem",
            height: "1.5rem",
            cursor: "pointer",
            top: "-2rem",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "var(--color-white1)",
            borderRadius: "50%",
            cursor: "e-resize",
            border: "1px solid #ccc",
          }}
        >
          <FaArrowRotateRight />
        </div>

        {/* Điều khiển thay đổi kích thước ở góc dưới bên phải */}
        <Box
          component={"div"}
          // Xử lý sự kiện khi bắt đầu kéo để thay đổi kích thước trên cả máy tính và điện thoại
          onMouseDown={handleMouseDownResize}
          onTouchStart={handleMouseDownResize}
          sx={{
            position: "absolute",
            width: "1rem",
            height: "1rem",
            rotate: "90deg",
            background: "var(--color-primary1)",
            borderRadius: "50%",
            cursor: "nwse-resize",

            // ăn góc phải dưới
            bottom: "-0.5rem",
            right: "-0.5rem",
            zIndex: "100",
            transition: "ease 0.3s",
            "&:hover": {
              bottom: "-0.75rem",
              right: "-0.75rem",
              width: "1.5rem",
              height: "1.5rem",
            },
          }}
        ></Box>
      </div>
    </div>
  );
};

export default IWrapperResizeRotate;
