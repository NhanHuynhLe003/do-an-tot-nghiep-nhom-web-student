import { Box } from "@mui/material";
import React from "react";

export default function IDndImage({ styleValue, src, imgName, size }) {
  //Size truyền từ IWrapperResizeRotate.jsx
  return (
    <Box
      className="dnd-image-container"
      sx={{
        width: size.width || "100px",
        height: size.height || "100px",
      }}
    >
      <img
        className="dragImageItem"
        style={{
          width: "100%",
          height: "100%",
        }}
        crossOrigin="anonymous" //Fix lỗi CORS cho phép upload mọi ảnh lên s3
        loading="lazy"
        src={src}
        alt={"img-" + imgName}
      />
    </Box>
  );
}
