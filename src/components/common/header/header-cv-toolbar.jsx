import { Stack } from "@mui/material";
import clsx from "clsx";
import React, { useEffect } from "react";
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
    // console.log("Component Changed");
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
        {editorSelector && (
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
        )}
        <IMenuListFloat
          ListButtonContent={<AccountInfo></AccountInfo>}
        ></IMenuListFloat>
      </Stack>
    </header>
  );
}

//=========================================================================
