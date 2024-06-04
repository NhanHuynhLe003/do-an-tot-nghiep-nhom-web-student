import { Box, Stack } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import IDraggableFree from "../../../../components/IDraggable/IDraggableFree";
import ITipTapEditor from "../../../../components/ITipTapEditor";
import IWrapperResizeRotate from "../../../../components/IWrapperResizeRotate";
import { sizeEditorDefault } from "../../../../constants";
import { cvZoomScaleSelector } from "../../../../redux/selector";
import CvSlice from "../../../../redux/slices/CvSlice";

const TRANSLATE_NUM = 0.5;
const initCoordinate = 300;
const listDataBoardItem = [
  {
    id: "001",
    component: (
      <IWrapperResizeRotate
        id={"001"}
        typeChildren="editor"
        ChildComponent={ITipTapEditor}
      ></IWrapperResizeRotate>
    ),
    coordinate: {
      x: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.width,
      y: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.height,
      x2:
        initCoordinate +
        sizeEditorDefault.width -
        TRANSLATE_NUM * sizeEditorDefault.width,
      y2: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.height,
      x3:
        initCoordinate +
        sizeEditorDefault.width -
        TRANSLATE_NUM * sizeEditorDefault.width,
      y3:
        initCoordinate +
        sizeEditorDefault.height -
        TRANSLATE_NUM * sizeEditorDefault.height,
      x4: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.width,
      y4:
        initCoordinate +
        sizeEditorDefault.height -
        TRANSLATE_NUM * sizeEditorDefault.height,
      x5:
        initCoordinate +
        sizeEditorDefault.width / 2 -
        TRANSLATE_NUM * sizeEditorDefault.width,
      y5:
        initCoordinate +
        sizeEditorDefault.height / 2 -
        TRANSLATE_NUM * sizeEditorDefault.height,
    },
    sizeItem: sizeEditorDefault,
  },
  {
    id: "002",
    component: (
      <IWrapperResizeRotate
        id={"002"}
        typeChildren="editor"
        ChildComponent={ITipTapEditor}
      ></IWrapperResizeRotate>
    ),
    coordinate: {
      x: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.width,
      y: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.height,
      x2:
        initCoordinate +
        sizeEditorDefault.width -
        TRANSLATE_NUM * sizeEditorDefault.width,
      y2: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.height,
      x3:
        initCoordinate +
        sizeEditorDefault.width -
        TRANSLATE_NUM * sizeEditorDefault.width,
      y3:
        initCoordinate +
        sizeEditorDefault.height -
        TRANSLATE_NUM * sizeEditorDefault.height,
      x4: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.width,
      y4:
        initCoordinate +
        sizeEditorDefault.height -
        TRANSLATE_NUM * sizeEditorDefault.height,
      x5:
        initCoordinate +
        sizeEditorDefault.width / 2 -
        TRANSLATE_NUM * sizeEditorDefault.width,
      y5:
        initCoordinate +
        sizeEditorDefault.height / 2 -
        TRANSLATE_NUM * sizeEditorDefault.height,
    },
    sizeItem: sizeEditorDefault,
  },
  {
    id: "003",
    component: (
      <IWrapperResizeRotate
        id={"003"}
        typeChildren="editor"
        ChildComponent={ITipTapEditor}
      ></IWrapperResizeRotate>
    ),
    coordinate: {
      x: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.width,
      y: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.height,
      x2:
        initCoordinate +
        sizeEditorDefault.width -
        TRANSLATE_NUM * sizeEditorDefault.width,
      y2: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.height,
      x3:
        initCoordinate +
        sizeEditorDefault.width -
        TRANSLATE_NUM * sizeEditorDefault.width,
      y3:
        initCoordinate +
        sizeEditorDefault.height -
        TRANSLATE_NUM * sizeEditorDefault.height,
      x4: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.width,
      y4:
        initCoordinate +
        sizeEditorDefault.height -
        TRANSLATE_NUM * sizeEditorDefault.height,
      x5:
        initCoordinate +
        sizeEditorDefault.width / 2 -
        TRANSLATE_NUM * sizeEditorDefault.width,
      y5:
        initCoordinate +
        sizeEditorDefault.height / 2 -
        TRANSLATE_NUM * sizeEditorDefault.height,
    },
    sizeItem: sizeEditorDefault,
  },
];

export default function CvAdminPageDetail() {
  const [scale, setScale] = useState(1);
  const [CurrentPageActive, setCurrentPageActive] = useState(-1);

  const [keyPressed, setKeyPressed] = useState("");
  // Board bao bên ngoài
  const containerBoardRef = useRef(null);
  const CvWrapperRef = useRef(null);

  const [initialTouchDistance, setInitialTouchDistance] = useState(null);
  const [lastTouchPositions, setLastTouchPositions] = useState(null);

  //Vẽ hình chữ nhật select
  const [isDrawingRectangle, setIsDrawingRectangle] = useState(false);
  // Vị trí bắt đầu của hình chữ nhật select
  const [startPositionRect, setStartPositionRect] = useState({ x: 0, y: 0 });
  // Vị trí hiện tại(kết thúc) của hình chữ nhật select
  const [currentPositionRect, setCurrentPositionRect] = useState({
    x: 0,
    y: 0,
  });

  const scaleCvSelector = useSelector(cvZoomScaleSelector);
  const dispatch = useDispatch();

  //==============================Xử lý vẽ hình chữ nhật Select Area==================
  const handleMouseDown = (event) => {
    //Nhấn ra ngoài thì tự động xóa toàn bộ items select hiện tại, với điều kiện không phải nhấn ctrl vì ctrl dùng để multi select nhấn vào sẽ gây xung đột
    keyPressed !== "Control" &&
      dispatch(CvSlice.actions.setClickOutsideDragItem(true));

    const boundingRect = event.currentTarget.getBoundingClientRect();

    const relativeX = (event.clientX - boundingRect.left) / scale;
    const relativeY = (event.clientY - boundingRect.top) / scale;

    setIsDrawingRectangle(true);
    setStartPositionRect({
      x: relativeX,
      y: relativeY,
    });
    setCurrentPositionRect({
      x: relativeX,
      y: relativeY,
    });
  };

  const handleMouseMove = (event) => {
    if (!isDrawingRectangle) return;

    const boundingRect = event.currentTarget.getBoundingClientRect();

    const relativeX = (event.clientX - boundingRect.left) / scale;
    const relativeY = (event.clientY - boundingRect.top) / scale;

    setCurrentPositionRect({
      x: relativeX,
      y: relativeY,
    });
  };

  const handleMouseUp = () => {
    setIsDrawingRectangle(false);
    dispatch(CvSlice.actions.setClickOutsideDragItem(false));
  };

  const handleMouseLeave = () => {
    setIsDrawingRectangle(false);
  };

  // ==================Xử lý căn giữa thanh scrollX khi zoom==================
  const centerScrollX = (container) => {
    if (container) {
      const { scrollWidth, clientWidth } = container;
      container.scrollLeft = (scrollWidth - clientWidth) / 2;
    }
  };

  useEffect(() => {
    //Xử lý nhấn nút xem có phải đang nhấn ctrl để chọn nhiều item không
    const handleKeyDown = (event) => {
      setKeyPressed(event.key);
    };

    const handleKeyUp = () => {
      setKeyPressed(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  //=======================Xử lý Event Zoom với chuột và touch==================
  useEffect(() => {
    const container = containerBoardRef.current;

    container.addEventListener("wheel", handleWheel);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  //==============Xử lý setScale từ Slider từ footerCv===================
  useEffect(() => {
    setScale(scaleCvSelector);
  }, [scaleCvSelector]);

  //=======================Xử lý setScale khi zoom==================
  useEffect(() => {
    const CvWrapper = CvWrapperRef.current;

    const size = CvWrapper?.getBoundingClientRect();

    dispatch(CvSlice.actions.setZoomScale(scale));
    centerScrollX(containerBoardRef.current);
  }, [scale]);

  //=================== Hàm xử lý khi hover vào page===============
  const handleHoverPage = (id) => {
    setCurrentPageActive(id);
  };

  // Hàm xử lý sự kiện cuộn chuột
  const handleWheel = (event) => {
    event.preventDefault();

    // Tính toán delta để thay đổi zoom
    const delta = event.deltaY > 0 ? -0.02 : 0.02;

    setScale((prevScale) => {
      let newScale = prevScale + delta;
      if (newScale < 0.1) newScale = 0.1;
      if (newScale > 5) newScale = 5;
      return newScale;
    });
  };

  // Hàm xử lý sự kiện chạm hai ngón tay
  const handleTouchMove = (event) => {
    if (event.touches.length === 2) {
      event.preventDefault();
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];

      const currentTouchDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );

      if (!initialTouchDistance) {
        setInitialTouchDistance(currentTouchDistance);
        setLastTouchPositions([
          { x: touch1.clientX, y: touch1.clientY },
          { x: touch2.clientX, y: touch2.clientY },
        ]);
        return;
      }

      const delta = currentTouchDistance - initialTouchDistance;
      const movementX =
        (touch1.clientX + touch2.clientX) / 2 -
        (lastTouchPositions[0].x + lastTouchPositions[1].x) / 2;
      const movementY =
        (touch1.clientY + touch2.clientY) / 2 -
        (lastTouchPositions[0].y + lastTouchPositions[1].y) / 2;

      if (Math.abs(delta) > 10) {
        // Zoom
        setScale((prevScale) => {
          let newScale = prevScale + delta / 500;
          if (newScale < 0.1) newScale = 0.1;
          if (newScale > 5) newScale = 5;
          return newScale;
        });
        setInitialTouchDistance(currentTouchDistance);
      } else {
        // Scroll
        containerBoardRef.current.scrollBy(-movementX, -movementY);
        setLastTouchPositions([
          { x: touch1.clientX, y: touch1.clientY },
          { x: touch2.clientX, y: touch2.clientY },
        ]);
      }
    }
  };

  // Hàm reset khoảng cách chạm khi kết thúc chạm
  const handleTouchEnd = () => {
    setInitialTouchDistance(null);
    setLastTouchPositions(null);
  };

  return (
    <Box
      className="board_container_cv"
      ref={containerBoardRef}
      sx={{
        width: "100%",
        height: "88%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        overflowY: "auto",
        // Ẩn thanh scroll khi scale nhỏ hơn 0.44
        overflowX: scale < 0.44 ? "hidden" : "auto",
        scrollBehavior: "unset",
      }}
    >
      <Box
        // Phải dùng Box này chứa để các item bên trong có thể ăn theo flex của board_container_cv
        className="board_pages_cv"
        sx={{
          position: "relative",
          transform: `scale(${scale})`, //Scale toàn bộ board khi zoom-in, zoom-out => nếu ko có đoạn code này tỉ lệ sẽ bị lệch
          transformOrigin: "top left",
        }}
      >
        <Box
          ref={CvWrapperRef}
          className={"page_cv_wrapper"}
          sx={{
            position: "absolute",
            top: "0",
            left: "0",
          }}
        >
          <Stack
            onMouseEnter={() => handleHoverPage("BOARD_001")}
            //=======Vẽ hình chữ nhật select=======
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            //====
            className="page_cv"
            direction={"column"}
            width={"800px"}
            height={"1122px"}
            bgcolor={"#fff"}
            boxShadow={"0 0 10px rgba(0,0,0,0.1)"}
            overflow={"hidden"} //Ẩn nội dung khi vượt quá page
            position={"relative"}
            marginRight={`${
              CvWrapperRef.current?.getBoundingClientRect().left
            }px`}
          >
            <IDraggableFree
              zoomScale={scale}
              IdPageActive={CurrentPageActive}
              BoardId={"BOARD_001"}
              listChildData={listDataBoardItem}
              activationConstraint={{
                delay: 200,
                tolerance: 5,
              }}
              startPositionRect={startPositionRect}
              currentPositionRect={currentPositionRect}
              isDrawingRectangle={isDrawingRectangle}
            ></IDraggableFree>
          </Stack>
        </Box>

        <Box
          onMouseEnter={() => handleHoverPage("BOARD_002")}
          className={"page_cv_wrapper"}
          sx={{
            position: "absolute",
            top: "80rem",
            left: "0",
          }}
        >
          <Stack
            //Vẽ hình chữ nhật select
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            //====
            className="page_cv"
            direction={"column"}
            width={"800px"}
            height={"1122px"}
            bgcolor={"#fff"}
            boxShadow={"0 0 10px rgba(0,0,0,0.1)"}
            overflow={"hidden"} //Ẩn nội dung khi vượt quá page
            position={"relative"}
            // Đẩy margin right của page sang phải để cân bằng thanh scroll ở giữa khi kéo
            marginRight={`${
              CvWrapperRef.current?.getBoundingClientRect().left
            }px`}
          >
            <IDraggableFree
              zoomScale={scale}
              IdPageActive={CurrentPageActive}
              BoardId={"BOARD_002"}
              listChildData={listDataBoardItem}
              activationConstraint={{
                delay: 200,
                tolerance: 5,
              }}
              startPositionRect={startPositionRect}
              currentPositionRect={currentPositionRect}
              isDrawingRectangle={isDrawingRectangle}
            ></IDraggableFree>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
