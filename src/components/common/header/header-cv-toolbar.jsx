import { Box, Stack } from "@mui/material";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  cvEditorContentSelector,
  cvIdSelector,
  cvTextSelector,
  positionPointerSelector,
} from "../../../redux/selector";
import IMenuListFloat from "../../IMenuListFloat";
import IMenuBarTipTap, {
  ToolTipTaps,
} from "../../ITipTapEditor/IMenuBarTipTap";
import AccountInfo from "./components/account-info";
import style from "./header-book.module.css";

export default function CvHeaderToolBar({ ref, topPositon = 0 }) {
  const menuToolBarRef = useRef(null);
  const [isHoverToolBar, setIsHoverToolBar] = React.useState(false);

  function handleMouseEnter(e) {
    setIsHoverToolBar(true);
  }

  //Lấy ra giá trị editor từ componet ITipTapEditor truyền lên
  const editorSelector = useSelector(cvEditorContentSelector);
  //Lấy ID và set cho menu khi change status
  const idEditorSelector = useSelector(cvIdSelector);
  //Lấy ra nội dung text dạng html
  const cvTextEditorSelector = useSelector(cvTextSelector);
  //Lấy ra vị trí con trỏ
  const positionMousePointer = useSelector(positionPointerSelector);

  useEffect(() => {
    //Xử lý khi data change từ editor thì thanh công cụ cũng phải re-render
    // return () => console.log("Component-Unmount");
  }, [
    editorSelector,
    idEditorSelector,
    cvTextEditorSelector,
    positionMousePointer,
  ]);

  return (
    <header
      className={clsx("animate__animated animate__fadeInDown", style.header, {
        [style.headerOrigin]: topPositon <= 35,
      })}
      ref={ref}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        // mt={3}
        py={1}
        pr={1}
        position={"relative"}
        className={style.headerContainer}
      >
        <Box
          sx={{
            minHeight: "1.5rem",
            minWidth: "10%",
          }}
        >
          {/* Chỉ cần đang hover toolbar hoặc đang focus 1 trong 2 điều kiên đúng là tool
          bar vẫn sẽ hiện */}
          {editorSelector /*&& (idEditorSelector !== -1 || isHoverToolBar)*/ && (
            <Box
              ref={menuToolBarRef}
              sx={{
                width: "fit-content",
                height: "fit-content",
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={() => setIsHoverToolBar(false)}
            >
              <IMenuBarTipTap
                id={idEditorSelector}
                editor={editorSelector}
                tools={[
                  ToolTipTaps.COLOR,
                  ToolTipTaps.BOLD,
                  ToolTipTaps.ITALIC,
                  ToolTipTaps.HEADING1,
                  ToolTipTaps.HEADING2,
                  ToolTipTaps.CODE_BLOCK,
                ]}
              />
            </Box>
          )}
        </Box>
        <IMenuListFloat
          ListButtonContent={<AccountInfo></AccountInfo>}
        ></IMenuListFloat>
      </Stack>
    </header>
  );
}

//=========================================================================
