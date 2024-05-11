import { Typography } from "@mui/material";
import React from "react";
import style from "./textShowMore.module.css";

export default function TextShowMore({ text, textAlign = "center" }) {
  const [showTextDesc, setShowTextDesc] = React.useState(text.slice(0, 240));
  const showMoreDescBtnRef = React.useRef(null);

  const handleShowMoreDesc = () => {
    if (showMoreDescBtnRef.current.textContent === ".....xem thêm") {
      showMoreDescBtnRef.current.textContent = "Rút gọn";
      setShowTextDesc(text);
    } else {
      showMoreDescBtnRef.current.textContent = ".....xem thêm";
      setShowTextDesc(text.slice(0, 240));
    }
  };
  return (
    <Typography component={"p"} mt={"1rem"} mb={"1rem"} textAlign={textAlign}>
      {showTextDesc}
      <button
        className={style.viewMoreTextDesc}
        ref={showMoreDescBtnRef}
        onClick={handleShowMoreDesc}
      >
        .....xem thêm
      </button>
    </Typography>
  );
}
