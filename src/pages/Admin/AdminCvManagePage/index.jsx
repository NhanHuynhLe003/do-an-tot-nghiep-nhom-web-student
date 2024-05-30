import { Stack } from "@mui/material";
import React, { useRef } from "react";
import IDraggableFree from "../../../components/IDraggable/IDraggableFree";
import ITipTapEditor from "../../../components/ITipTapEditor";
import IWrapperResizeRotate from "../../../components/IWrapperResizeRotate";
import { sizeEditorDefault } from "../../../constants";

export default function AdminCvManagePage() {
  // Đừng style cứng các item được wrap, các dữ liệu này sau này do mình tạo ra khi nhấn nút them
  const initCoordinate = useRef(200);
  const listDataBoardItem = [
    {
      id: "001",
      // Nguyên nhân bug là do ITipTapEditor là hàm còn <IWrapperResizeRotate> là component
      component: (
        <IWrapperResizeRotate
          id={"001"}
          typeChildren="editor"
          ChildComponent={ITipTapEditor} //Khôn truyền dạng này <ITipTapEditor></ITipTapEditor> vì props chỉ chấp nhận class hoặc function
        ></IWrapperResizeRotate>
      ),
      coordinate: {
        x: initCoordinate.current,
        y: initCoordinate.current,
        x2: initCoordinate.current + sizeEditorDefault.width,
        y2: initCoordinate.current,
        x3: initCoordinate.current + sizeEditorDefault.width,
        y3: initCoordinate.current + sizeEditorDefault.height,
        x4: initCoordinate.current,
        y4: initCoordinate.current + sizeEditorDefault.height,
        x5: initCoordinate.current + sizeEditorDefault.width / 2,
        y5: initCoordinate.current + sizeEditorDefault.height / 2,
      },
      sizeItem: sizeEditorDefault,
    },
    {
      id: "002",
      component: (
        <IWrapperResizeRotate
          id={"002"}
          typeChildren="editor"
          ChildComponent={ITipTapEditor} //Không truyền dạng này <ITipTapEditor></ITipTapEditor> vì đã có sẵn pattern bên dưới
        ></IWrapperResizeRotate>
      ),
      coordinate: {
        x: initCoordinate.current,
        y: initCoordinate.current,
        x2: initCoordinate.current + sizeEditorDefault.width,
        y2: initCoordinate.current,
        x3: initCoordinate.current + sizeEditorDefault.width,
        y3: initCoordinate.current + sizeEditorDefault.height,
        x4: initCoordinate.current,
        y4: initCoordinate.current + sizeEditorDefault.height,
        x5: initCoordinate.current + sizeEditorDefault.width / 2,
        y5: initCoordinate.current + sizeEditorDefault.height / 2,
      },
      sizeItem: sizeEditorDefault,
    },
    // {
    //   id: "003",
    //   component: (
    //     <IWrapperResizeRotate
    //       id={"003"}
    //       typeChildren="editor"
    //       ChildComponent={ITipTapEditor} //Không truyền dạng này <ITipTapEditor></ITipTapEditor> vì đã có sẵn pattern bên dưới
    //     ></IWrapperResizeRotate>
    //   ),
    //   coordinate: {
    //     x: 10 + initCoordinate.current,
    //     y: 10 + initCoordinate.current,
    //     x2: 10 + initCoordinate.current + sizeEditorDefault.width,
    //     y2: 10 + initCoordinate.current,
    //     x3: 10 + initCoordinate.current + sizeEditorDefault.width,
    //     y3: 10 + initCoordinate.current + sizeEditorDefault.height,
    //     x4: 10 + initCoordinate.current,
    //     y4: 10 + initCoordinate.current + sizeEditorDefault.height,
    //     x5: 10 + initCoordinate.current + sizeEditorDefault.width / 2,
    //     y5: 10 + initCoordinate.current + sizeEditorDefault.height / 2,
    //   },
    // },

    // {
    //   id: "004",
    //   component: (
    //     <IWrapperResizeRotate
    //       id={"004"}
    //       typeChildren="editor"
    //       ChildComponent={ITipTapEditor} //Không truyền dạng này <ITipTapEditor></ITipTapEditor> vì đã có sẵn pattern bên dưới
    //     ></IWrapperResizeRotate>
    //   ),
    //   coordinate: {
    //     x: 20 + initCoordinate.current,
    //     y: 20 + initCoordinate.current,
    //     x2: 20 + initCoordinate.current + sizeEditorDefault.width,
    //     y2: 20 + initCoordinate.current,
    //     x3: 20 + initCoordinate.current + sizeEditorDefault.width,
    //     y3: 20 + initCoordinate.current + sizeEditorDefault.height,
    //     x4: 20 + initCoordinate.current,
    //     y4: 20 + initCoordinate.current + sizeEditorDefault.height,
    //     x5: 20 + initCoordinate.current + sizeEditorDefault.width / 2,
    //     y5: 20 + initCoordinate.current + sizeEditorDefault.height / 2,
    //   },
    // },
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
