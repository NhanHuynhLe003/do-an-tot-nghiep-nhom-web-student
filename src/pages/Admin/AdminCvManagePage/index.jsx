import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { Box, Stack } from "@mui/material";
import React from "react";
import IDraggableFree from "../../../components/IDraggable/IDraggableFree";
import IWrapperResizeRotate from "../../../components/IWrapperResizeRotate";
import ITipTapEditor from "../../../components/ITipTapEditor";

export default function AdminCvManagePage() {
  // Đừng style cứng các item được wrap, các dữ liệu này sau này do mình tạo ra khi nhấn nút them
  const listDataBoardItem = [
    {
      id: 1,
      component: (
        <span>
          <IWrapperResizeRotate>
            <ITipTapEditor id={"001"}></ITipTapEditor>
          </IWrapperResizeRotate>
        </span>
      ),
      coordinate: {
        x: 30,
        y: 30,
      },
    },
  ];

  return (
    <Stack
      className="board_cv_container"
      direction={"column"}
      width={"95%"}
      height={"75vh"}
      // maxHeight={"75vh"}
      margin={"1.75rem auto 0 auto"}
      bgcolor={"#fff"}
      boxShadow={"0 0 10px rgba(0,0,0,0.1)"}
      overflow={
        "auto"
      } /**Dùng mở rộng bảng chứa khi kéo phần tử ra rìa chẳng hạn */
      position={
        "relative"
      } /**(*) Các item bên trong là position:absolute, để cho các item được căn theo container này */
    >
      <IDraggableFree
        listChildData={listDataBoardItem}
        activationConstraint={{
          delay: 200, //thời gian delay khi kéo
          tolerance: 5, // sai số 5px
        }}
      ></IDraggableFree>
    </Stack>
  );
}
