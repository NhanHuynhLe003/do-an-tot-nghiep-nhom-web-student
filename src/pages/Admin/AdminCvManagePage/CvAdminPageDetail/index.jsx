import { Box, Stack } from "@mui/material";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import IDraggableFree from "../../../../components/IDraggable/IDraggableFree";
import IEmptyComponent from "../../../../components/IEmptyComponent";
import IShapeElement from "../../../../components/IShapeElement";
import ITipTapEditor from "../../../../components/ITipTapEditor";
import IWrapperResizeRotate from "../../../../components/IWrapperResizeRotate";
import {
  cvZoomScaleSelector,
  listCvUserSelector,
} from "../../../../redux/selector";
import CvSlice from "../../../../redux/slices/CvSlice";
import { useParams } from "react-router-dom";
import IDndImage from "../../../../components/IDndImage";

export default function CvAdminPageDetail() {
  const { id: currentCvPageId } = useParams();
  const [isExistCvPage, setIsExistCvPage] = useState(false);
  const listCvUsers = useSelector(listCvUserSelector);

  useLayoutEffect(() => {
    const isExistCv = listCvUsers.some((cv) => cv.cvId === currentCvPageId);
    setIsExistCvPage(isExistCv);
  }, []);

  const [listBoardCv, setListBoardCv] = useState([...listCvUsers[0].boards]);
  const [listBoardCvConvert, setListBoardCvConvert] = useState([]);
  const [listBoardRefs, setListBoardRefs] = useState(
    listBoardCv.map((board) => ({
      boardId: board.boardId,
      id: board.boardId,
      name: board.name,
      type: board.type,
      layer: board.layer,
      color: board.color,
      ChildComponentProps: board.ChildComponentProps
        ? board.ChildComponentProps
        : {},
      position: board.position,
      boardRef: React.createRef(),
      cvWrapperRef: React.createRef(),
    }))
  );

  const [scale, setScale] = useState(1);
  const [CurrentPageActive, setCurrentPageActive] = useState(-1);

  const [keyPressed, setKeyPressed] = useState("");
  // Board bao bên ngoài
  const containerBoardRef = useRef(null);

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

    // Vị trí chuột khi bắt đầu kéo
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

    //Vị trí chuột mới khi di chuyển
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
    //(*)Chuyển CV sang dạng Hiển thị được trong BOARD
    const newBoardDataConvert = listBoardCv.map((board, index) => {
      const newItemDataConvert = board.listDataItem.map((item) => {
        //Component sẽ được truyền xuống Board
        let ChildComponent = IEmptyComponent;
        switch (item.type) {
          case "editor":
            ChildComponent = ITipTapEditor;
            break;
          case "shape":
            ChildComponent = IShapeElement;
            break;
          case "image":
            ChildComponent = IDndImage;
            break;
          default:
            ChildComponent = IEmptyComponent;
            break;
        }

        return {
          boardId: item.boardId,
          id: item.id,
          type: item.type,
          color: item.color, // Màu của item áp dụng cho shape
          ChildComponentProps: item.ChildComponentProps
            ? item.ChildComponentProps
            : {},
          component: (
            <IWrapperResizeRotate
              childContent={item.type === "editor" && item.content}
              dataResize={item.sizeItem}
              color={item.color}
              layer={item.layer} // layer level hiện tại của item
              id={item.id}
              typeChildren={item.type}
              cvId={currentCvPageId}
              boardId={board.boardId}
              ChildComponentProps={{
                ...item?.ChildComponentProps,
                sizeControl: item.sizeItem,
                styleValue: {
                  ...item?.ChildComponentProps,

                  fill: item.color ? item.color : "var(--color-primary1)",
                },
              }}
              ChildComponent={ChildComponent}
            ></IWrapperResizeRotate>
          ),
          coordinate: { ...item.coordinate },
          sizeItem: item.sizeItem,
          layer: item.layer,
        };
      });

      return {
        ...board,
        listDataItem: newItemDataConvert,
        position: { top: index * 80, left: 0 },
      };
    });

    setListBoardCvConvert(newBoardDataConvert);
  }, [listBoardCv]);

  useEffect(() => {
    console.log("[LIST_CV_USERS]", listCvUsers);

    const newListBoard = [...listCvUsers[0].boards];

    //Update BoardRef
    setListBoardRefs((prev) =>
      newListBoard.map((board) => {
        const boardRef = prev.find(
          (item) => item.boardRef && item.id === board.boardId
        );
        if (boardRef) {
          //Có rồi thì trả về luôn
          return boardRef;
        } else {
          //Chưa có thì tạo mới Ref
          return {
            id: board.boardId,
            name: board.name,
            type: board.type,
            ChildComponentProps: board.ChildComponentProps
              ? board.ChildComponentProps
              : {},
            position: board.position,
            boardRef: React.createRef(),
            cvWrapperRef: React.createRef(),
          };
        }
      })
    );

    // console.log("[NEW_LIST_BOARD_CV_UPDATED]", newListBoard);
    //Update Board
    setListBoardCv(newListBoard);
  }, [listCvUsers]);

  //===========Tính Toán vị trí của thanh cuộn Y Để thêm Text vào item==================
  useEffect(() => {
    /**
     *@description Hàm tính toán vị trí để thêm item vào Board
     */
    const handleCalculatePositionDragItemAdd = () => {
      if (!containerBoardRef.current) return;

      const rectContainer = containerBoardRef.current.getBoundingClientRect();
      const scrollTop = containerBoardRef.current.scrollTop;

      /**
       *@description Tính toán vị trí của Board
       */
      const calculateBoardPosition = (boardRef) => {
        const boardRect =
          boardRef.cvWrapperRef.current?.getBoundingClientRect();
        const topBoard = boardRect?.top + scrollTop;
        const bottomBoard = topBoard + boardRect?.height;
        return { topBoard, bottomBoard };
      };

      const startViewport = scrollTop + rectContainer.top;
      const endViewport = startViewport + rectContainer.height;

      listBoardRefs.forEach((boardRef, index) => {
        const { topBoard, bottomBoard } = calculateBoardPosition(boardRef);
        const nextBoardRef = listBoardRefs[index + 1];

        if (startViewport >= topBoard && endViewport <= bottomBoard) {
          //CASE 1: View nằm trong Board
          dispatch(
            CvSlice.actions.setCurrentBoardInView({
              id: boardRef.id,
              name: boardRef.name,
              position: boardRef.position,
            })
          );
        } else if (startViewport <= bottomBoard && nextBoardRef) {
          const { topBoard: topNextBoard } =
            calculateBoardPosition(nextBoardRef);

          if (endViewport <= topNextBoard) {
            //CASE 2: StartView nằm trong Board, EndView chưa thuộc Board tiếp theo

            dispatch(
              CvSlice.actions.setCurrentBoardInView({
                id: boardRef.id,
                name: boardRef.name,
                position: boardRef.position,
              })
            );
          } else if (endViewport >= topNextBoard) {
            //CASE 3 - Giữa 2 Board: StartView nằm trong Board, EndView thuộc Board tiếp theo thì tính khoảng cách Y1,Y2
            /**
             * Y
             * ^
             * |
             * |              A1----------------------B1
             * |              |          Board1       |
             * |              |                       |
             * |              |                       |
             * |--------------|-----------------------|------------------|--->(cạnh trên của Viewport)
             * |      Y1 ↕    |                       |                  |
             * |--------------D1----------------------C1---------------------->(bottom của board1)
             * |                                                         |
             * |                                                         |
             * |--------------A2----------------------B2---------------------->(top của board2)
             * |      Y2 ↕    |                       |         |--------|
             * |              |                       |         |Viewport|
             * |--------------|-----------------------|---------|--------|--->(cạnh dưới của Viewport)
             * |              |           Board2      |
             * |              |                       |
             * |              D2----------------------C2
             * |
             */

            const distanceY1 = Math.abs(bottomBoard - startViewport);
            const distanceY2 = Math.abs(endViewport - topNextBoard);

            //Board nào có khoảng cách lớn hơn thì chọn Board đó để fill Text
            if (distanceY1 > distanceY2) {
              dispatch(
                CvSlice.actions.setCurrentBoardInView({
                  id: boardRef.id,
                  name: boardRef.name,
                  position: boardRef.position,
                })
              );
            } else {
              dispatch(
                CvSlice.actions.setCurrentBoardInView({
                  id: nextBoardRef.id,
                  name: nextBoardRef.name,
                  position: nextBoardRef.position,
                })
              );
            }
          }
        } else if (startViewport > bottomBoard && !nextBoardRef) {
          //CASE 4: View nằm ngoài tất cả Board => Chọn Board đầu tiên

          dispatch(
            CvSlice.actions.setCurrentBoardInView({
              id: listBoardRefs[0].id,
              name: listBoardRefs[0].name,
              position: listBoardRefs[0].position,
            })
          );
        }
      });
    };

    // Thêm event listener để theo dõi sự kiện scroll
    const element = containerBoardRef.current;
    if (element) {
      element.addEventListener("scroll", handleCalculatePositionDragItemAdd);
    }

    // Cleanup: Gỡ bỏ event listener khi component unmount
    return () => {
      if (element) {
        element.removeEventListener(
          "scroll",
          handleCalculatePositionDragItemAdd
        );
      }
    };
  }, []);

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
    //Set SCale value lên ngược lên footer
    dispatch(CvSlice.actions.setZoomScale(scale));
    centerScrollX(containerBoardRef.current);
  }, [scale]);

  //=================== Hàm xử lý khi hover vào page===============
  const handleHoverPage = (id) => {
    setCurrentPageActive(id);
  };

  // Hàm xử lý sự kiện zoom to nhỏ, tìm cách xử lý 2 ngón tay
  const handleWheel = (event) => {
    //Dùng để kiểm tra khi nào nhấn ctrl thì mới zoom, khi tabpad dùng 2 ngón tay mở rộng trình duyệt tự hiểu là đang nhấn ctrl
    if (event.ctrlKey) {
      event.preventDefault(); // Ngăn hành vi zoom mặc định của trình duyệt

      // Tính toán delta để thay đổi zoom
      const delta = event.deltaY > 0 ? -0.02 : 0.02;

      setScale((prevScale) => {
        let newScale = prevScale + delta;
        if (newScale < 0.1) newScale = 0.1;
        if (newScale > 5) newScale = 5;
        return newScale;
      });
    }
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
      {isExistCvPage ? (
        <Box
          // Phải dùng Box này chứa để các item bên trong có thể ăn theo flex của board_container_cv
          className="board_pages_cv"
          sx={{
            mt: "3rem",
            position: "relative",
            transform: `scale(${scale})`, //Scale toàn bộ board khi zoom-in, zoom-out => nếu ko có đoạn code này tỉ lệ sẽ bị lệch
            transformOrigin: "top left",
          }}
        >
          {listBoardCvConvert ? (
            listBoardCvConvert.map((board, index) => {
              return (
                <Box
                  key={"BOARD_" + board.boardId}
                  ref={(node) => {
                    listBoardRefs[index].cvWrapperRef.current = node;
                    return node;
                  }}
                  className={"page_cv_wrapper_" + board.boardId}
                  sx={{
                    position: "absolute",
                    top: `${board.position?.top}rem`,
                    left: `${board.position?.left}rem`,
                  }}
                >
                  <Stack
                    ref={(node) => {
                      listBoardRefs[index].boardRef.current = node;
                      return node;
                    }}
                    onMouseEnter={() => handleHoverPage(board.boardId)}
                    //=======Vẽ hình chữ nhật select=======
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    //====
                    className={"page_cv_" + board.boardId}
                    direction={"column"}
                    // CV SIZE
                    width={"800px"}
                    height={"1122px"}
                    bgcolor={"#fff"}
                    boxShadow={"0 0 10px rgba(0,0,0,0.1)"}
                    overflow={"hidden"} //Ẩn nội dung khi vượt quá page
                    position={"relative"}
                    marginRight={`${
                      listBoardRefs[
                        index
                      ].cvWrapperRef?.current?.getBoundingClientRect().left
                    }px`}
                  >
                    <IDraggableFree
                      idCurrentCv={currentCvPageId}
                      zoomScale={scale}
                      IdPageActive={CurrentPageActive}
                      boardInformation={{
                        boardId: board.boardId,
                        name: board.name,
                        position: board.position,
                      }}
                      listChildData={board.listDataItem}
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
              );
            })
          ) : (
            <FaSpinner></FaSpinner>
          )}
        </Box>
      ) : (
        <Box>CV Không tồn tại</Box>
      )}
    </Box>
  );
}
