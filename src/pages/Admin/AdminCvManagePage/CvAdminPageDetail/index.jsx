import { Box, Button, Input, Stack } from "@mui/material";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../../../apis/axiosConfig";
import SubmitDialog from "../../../../components/IDialog/SubmitDialog";
import IDndImage from "../../../../components/IDndImage";
import IDraggableFree from "../../../../components/IDraggable/IDraggableFree";
import IShapeElement from "../../../../components/IShapeElement";
import ITipTapEditor from "../../../../components/ITipTapEditor";
import IWrapperResizeRotate from "../../../../components/IWrapperResizeRotate";
import { BREAK_POINTS } from "../../../../constants";
import { useWindowSize } from "../../../../hooks";
import { useGetCvById } from "../../../../hooks/apis/admin/useGetCvById";
import {
  cvZoomScaleSelector,
  listCvUserSelector,
} from "../../../../redux/selector";
import CvSlice from "../../../../redux/slices/CvSlice";

export default function CvAdminPageDetail() {
  const { widthScreen, heightScreen } = useWindowSize();
  const studentData = JSON.parse(localStorage.getItem("studentData"));

  const { id: currentCvPageId } = useParams();

  const [isExistCvPage, setIsExistCvPage] = useState(true);

  //Dữ liệu CV từ Store Redux
  const listCvUsers = useSelector(listCvUserSelector);
  const boardCvConvertToDisplay = useRef([]);

  const { data: cvDataDetail } = useGetCvById({
    cvId: currentCvPageId,
    userId: studentData?._id,
  });

  const [listBoardCv, setListBoardCv] = useState([]);
  const [getApiFirstTime, setGetApiFirstTime] = useState(true);

  // Chuyển sang dạng hiển thị được trên IDraggableFree
  const [listBoardCvConvert, setListBoardCvConvert] = useState([]);
  const [listBoardRefs, setListBoardRefs] = useState([]);

  useEffect(() => {
    if (getApiFirstTime && cvDataDetail) {
      console.log("cvDataDetail:::", cvDataDetail);

      const data = cvDataDetail?.data?.metadata;
      const cvDetailConvert = data && {
        ...data,
        boards: data.boards.map((board) => ({
          ...board,
          boardId: board._id,
        })),
        cvId: data._id,
        dateUpdated: data.updatedAt,
        dateCreated: data.createdAt,
      };

      const convertDataBoardFromApi = cvDetailConvert?.boards?.map((board) => ({
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
      }));

      console.log("Convert Data Board From API:::", convertDataBoardFromApi);

      // Set Vị trí CV đầu tiên cho view
      dispatch(
        CvSlice.actions.setCurrentBoardInView({
          id: cvDetailConvert?.boards[0]?.boardId,
          name: cvDetailConvert?.boards[0]?.name,
          position: cvDetailConvert?.boards[0]?.position,
        })
      );

      // ADD CV từ API vào listCVUsers trong Redux để xử lý kéo thả phía client
      dispatch(CvSlice.actions.setDataListCvUser([cvDetailConvert]));

      // Set Giá trị Board cho các state quản lý
      setListBoardCv(cvDetailConvert?.boards);
      setListBoardRefs(convertDataBoardFromApi);

      // Tắt gán giá trị lần đầu tiên
      setGetApiFirstTime(false);
    }
  }, [cvDataDetail, getApiFirstTime]);

  const [scale, setScale] = useState(widthScreen <= BREAK_POINTS.xs ? 0.3 : 1);
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

  //focus input name
  const [currentInputFocus, setCurrentInputFocus] = useState(-1);

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

    //cv userID bằng với id user hiện tại thì cho phép kéo bất kể quyền gì

    //chỉ lấy listBoardCv trong lần đầu tiên từ API, sau khi listCVUsers đã có dữ liệu thì lấy từ board của listCVUsers

    const listCVTemp = getApiFirstTime
      ? [...listBoardCv]
      : [...listCvUsers[0]?.boards];

    const newBoardDataConvert = listCVTemp.map((board, index) => {
      const newItemDataConvert = board.listDataItem.map((item) => {
        console.log("ITEM:::", item);

        // console.log("TYPE ITEM DRAG:::", typeItemDrag);
        //(*)Component sẽ được truyền xuống Board, tìm cách chỉ hiển thị khi có type thôi
        let ChildComponent = ITipTapEditor;
        switch (item?.itemType) {
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
            ChildComponent = ITipTapEditor;
            break;
        }

        return {
          ...item,

          boardId: item.boardId,
          id: item.id || item._id,
          itemType: item.itemType,
          color: item.color, // Màu của item áp dụng cho shape
          ChildComponentProps: item.ChildComponentProps
            ? item.ChildComponentProps
            : {},
          component: (
            <IWrapperResizeRotate
              roleItem={item.role}
              dataRotate={item.rotateDeg}
              dataResize={item.sizeItem}
              childContent={item.content}
              color={item.color}
              layer={item.layer} // layer level hiện tại của item
              id={item.id}
              typeChildren={item.itemType}
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

      const res = {
        ...board,
        listDataItem: newItemDataConvert,
        position: { top: index * 80, left: 0 },
      };

      return res;
    });

    boardCvConvertToDisplay.current = newBoardDataConvert;

    // setListBoardCvConvert(newBoardDataConvert);
  }, [listBoardCv, listCvUsers, getApiFirstTime, boardCvConvertToDisplay]);

  useEffect(() => {
    const newListBoard = listCvUsers[0]?.boards
      ? listCvUsers[0]?.boards
      : [...listBoardCv];
    //Update BoardRef
    const newListBoardRef = newListBoard.map((board) => {
      const boardRef = listBoardRefs.find(
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
    });

    setListBoardRefs(newListBoardRef);

    //vua tat
    // setListBoardCv(newListBoard);
  }, [listCvUsers, listBoardCv]);

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
       *@description Tính toán vị trí của Board => lấy ra board hiện tại đang nhìn thấy
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

      // Lấy ra danh sách các ref của board để so sánh
      listBoardRefs.forEach((boardRef, index) => {
        const { topBoard, bottomBoard } = calculateBoardPosition(boardRef);

        //Lấy ra Board tiếp theo để so sánh
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
  }, [listBoardRefs]);

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

  const handleFoucusInput = useCallback(
    (index) => {
      setCurrentInputFocus(index);
    },
    [currentInputFocus]
  );

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

  const handleChangeInputNameBoard = useCallback(
    debounce(function (boardId, value) {
      dispatch(
        CvSlice.actions.setNameBoard({
          cvId: currentCvPageId,
          boardId,
          name: value,
        })
      );
    }, 300)
  );

  const handleClickAddPage = useCallback(
    debounce(async () => {
      //fetch API thêm board vào bảng mới
      const res = await axiosInstance.post("/v1/api/cv/add/board", {
        cvId: currentCvPageId,
        userId: studentData?._id,
      });
      const IdBoardApi = res?.data?.metadata?._id;

      dispatch(
        CvSlice.actions.setAddBoardIntoCv({
          cvId: currentCvPageId,
          board: {
            cvId: currentCvPageId,
            cvUserId: studentData?._id,
            boardId: IdBoardApi, //thực tế thay bằng _id của board
            name: "Untitled",
            position: { top: listCvUsers[0]?.boards.length * 80, left: 0 },
            listDataItem: [],
          },
        })
      );

      toast.success("Thêm bảng mới thành công!", {
        position: "top-center",
        autoClose: 1500,
      });
    }, 1000),
    []
  );

  const handleRemovePage = useCallback(
    debounce((isAccept, boardId) => {
      if (!isAccept) return;

      if (listCvUsers[0]?.boards.length <= 1) {
        toast.error(
          "Phải có tối thiểu 1 bảng, hãy tạo 1 bảng trống mới rồi xóa bảng hiện tại!",
          {
            position: "top-center",
          }
        );
        return;
      }

      dispatch(
        CvSlice.actions.setRemoveBoardInCv({
          cvId: currentCvPageId,
          boardId,
        })
      );

      toast.success("Xóa bảng thành công!", {
        position: "top-center",
        autoClose: 1500,
      });
    }, 500)
  );

  // useEffect(() => {
  //   if (listBoardRefs[0]?.cvWrapperRef?.current) {
  //     const rect =
  //       listBoardRefs[0]?.cvWrapperRef?.current.getBoundingClientRect();
  //   }
  // }, [listBoardRefs[0]?.cvWrapperRef?.current]);

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
        // Ẩn thanh scroll khi scale nhỏ hơn 0.4
        overflowX: scale < 0.4 ? "hidden" : "auto",
        scrollBehavior: "unset",

        //Mobile
        "@media (max-width: 600px)": {
          justifyContent: "center",
          minHeight: "100vh",
        },
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
          {boardCvConvertToDisplay.current ? (
            boardCvConvertToDisplay.current.map((board, index) => {
              return (
                <Box
                  key={"BOARD_" + board.boardId}
                  ref={(node) => {
                    if (listBoardRefs[index])
                      listBoardRefs[index].cvWrapperRef.current = node;
                    return node;
                  }}
                  className={"page_cv_wrapper_" + board.boardId}
                  sx={{
                    position: "absolute",
                    top: `${board.position?.top}rem`,
                    left: `${board.position?.left}rem`,
                    "@media (max-width: 600px)": {
                      overflow: "hidden",
                    },
                  }}
                >
                  <Stack
                    direction={"row"}
                    maxWidth={"800px"}
                    mb={1}
                    justifyContent={"space-between"}
                  >
                    <Stack
                      direction={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      <Input
                        defaultValue={board.name || "Untitled"}
                        inputProps={{ "aria-label": "description" }}
                        disableUnderline={
                          currentInputFocus === index ? false : true
                        }
                        onChange={(e) =>
                          handleChangeInputNameBoard(
                            board.boardId,
                            e.target.value
                          )
                        }
                        onFocus={() => handleFoucusInput(index)}
                        onBlur={() => setCurrentInputFocus(-1)}
                        sx={{
                          opacity: currentInputFocus === index ? 1 : 0.7,
                          color: "var(--color-primary2)",
                        }}
                      />
                    </Stack>

                    <Stack
                      direction={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      gap={2}
                    >
                      <Button
                        onClick={handleClickAddPage}
                        type="button"
                        variant="text"
                        sx={{
                          color: "var(--color-primary2)",
                          opacity: 0.5,
                          transition: "all 0.2s",
                          ":hover": {
                            color: "#fff",
                            backgroundColor: "var(--color-primary2)",
                          },
                        }}
                      >
                        Thêm Bảng mới
                      </Button>
                      <SubmitDialog
                        styleBtnShowInfo={{
                          borderRadius: 28,
                          opacity: 0.7,
                          color: "red",
                          backgroundColor: "transparent",
                          transition: "0.2s ease-in-out",
                          ":hover": {
                            backgroundColor: "red",
                            color: "#fff",
                          },
                        }}
                        buttonShowInfo={{
                          variant: "text",

                          title: "X",
                        }}
                        dialogInfo={{
                          contentDialogTitle: "Xác nhận xóa bảng",
                          contentDialogDesc:
                            "Bạn có chắc chắn xóa bảng này chứ",
                        }}
                        fncHandleClickAccept={(isAccept) =>
                          handleRemovePage(isAccept, board.boardId)
                        }
                      ></SubmitDialog>
                    </Stack>
                  </Stack>
                  <Stack
                    ref={(node) => {
                      if (listBoardRefs[index])
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
                    boxShadow={"0 0 14px rgba(0,0,0,0.2)"}
                    overflow={"hidden"} //Ẩn nội dung khi vượt quá page
                    position={"relative"}
                    // Tính khoảng cách bên trái để đẩy ra 1 khoảng để căn giữa thanh bar
                    marginRight={`${
                      listBoardRefs[
                        index
                      ]?.cvWrapperRef?.current?.getBoundingClientRect().left
                    }px`}
                    marginBottom={
                      index === listBoardCvConvert.length - 1 ? 12 : 0
                    }
                    sx={{
                      "@media (max-width: 600px)": {
                        marginRight:
                          scale > 0.8
                            ? `${Math.abs(
                                listBoardRefs[
                                  index
                                ]?.cvWrapperRef?.current?.getBoundingClientRect()
                                  .left
                              )}px`
                            : `${Math.abs(
                                listBoardRefs[
                                  index
                                ]?.cvWrapperRef?.current?.getBoundingClientRect()
                                  .right
                              )}px`,
                      },
                    }}
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
