import { Box, Stack } from "@mui/material";
import React from "react";

import { ReactSVG } from "react-svg";
import { sizeShapeElementDefault } from "../../constants";

function IShapeElement({
  id,
  title,
  srcSvg = "/svgs/shapeElements/circle-svgrepo-com.svg",

  styleValue = {
    width: "80px",
    height: "80px",
    fill: "black",
  },
  //Size này được truyền từ IWRAPPER VÀO
  size = { ...sizeShapeElementDefault },
}) {
  const convertStyleStr = (styleValue) => {
    let styleString = "";
    for (const key in styleValue) {
      styleString += `${key}: ${styleValue[key]}; `;
    }
    return styleString;
  };

  return (
    <Stack
      id={`ID_SVG_` + id}
      title={title}
      width={"fit-content"}
      height={"fit-content"}
    >
      <ReactSVG
        src={srcSvg}
        beforeInjection={(svg) => {
          const classNameShape = `shape-element-${title}`;

          svg.classList.add(classNameShape);

          svg.setAttribute(
            "style",
            convertStyleStr({
              ...styleValue,
              width: size.width > 0 ? size.width : 1,
              height: size.height > 0 ? size.height : 1,
            })
          );
        }}
      />
    </Stack>
  );
}
export default React.memo(IShapeElement);
