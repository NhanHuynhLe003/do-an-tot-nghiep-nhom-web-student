import {
  DndContext,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Box } from "@mui/material";
import _, { cloneDeep } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clickOutsideDragItemSelector,
  cvIdEditorSelector,
  itemsSelectorDragSelect,
  listIdItemResizingOrRotatingSelector,
  sizeAndDegItemDraggableSelector,
  stateCvHistorySelector,
} from "../../redux/selector";
import CvSlice from "../../redux/slices/CvSlice";
import { calculateDistanceByCoordinate } from "../../utils";
import IDraggableItem from "./DraggableItem";

//Translate tọa độ => Khi rotate cho nó quay xung quanh tâm
const TRANSLATE_RATE = 50;

export default function IDraggableFree({
  isDragDisabled = true,
  idCurrentCv = "1234", //Id của CV hiện tại lấy từ url
  zoomScale,
  IdPageActive, //Id của page đang active(Đang được mouseEnter)
  activationConstraint, // Dùng để thiết lập thời gian delay khi kéo, khoảng cách kéo, hoặc cả 2
  axis, // Dùng để thiết lập hướng kéo
  handle, // Dùng để thiết lập handle kéo
  label = "Go ahead, drag me.",
  modifiers, // Dùng để thiết lập các ràng buộc khi kéo
  style, // Dùng để thiết lập style cho component
  buttonStyle, // Dùng để thiết lập style cho button
  listChildData = [], // chứa các element con trong bảng kéo thả

  startPositionRect,
  currentPositionRect,
  isDrawingRectangle,
  boardInformation,
}) {
  const { boardId } = boardInformation;
  const studentData = JSON.parse(localStorage.getItem("studentData"));
  //Cờ dùng update Lịch sử lần đầu tiên khi component được mount
  const flagUpdateHistoryRefFirstTime = useRef(false);

  const dispatch = useDispatch();

  //danh sách các item đang được resize hoặc rotate
  const listIdItemResizeOrRotateSelector = useSelector(
    listIdItemResizingOrRotatingSelector
  );

  //Kiểm tra có click ra ngoài item hay không(click vào board)
  const isClickOutsideItemSelector = useSelector(clickOutsideDragItemSelector);

  //Lấy ra các item đang được chọn từ store
  const itemsSelectedSelector = useSelector(itemsSelectorDragSelect);

  //kiểm tra editor đg focus
  const idEditorSelector = useSelector(cvIdEditorSelector);

  //Lấy ra size và độ quay của item đang kéo từ store
  const sizeAndRotateItemSelector = useSelector(
    sizeAndDegItemDraggableSelector
  );
  //Lấy ra lịch sử lưu item hiện tại
  const listStateDataItemHistory = useSelector(stateCvHistorySelector);

  const [keyPressed, setKeyPressed] = useState("");

  const [listKeyPressed, setListKeyPressed] = useState([]);

  const [isRotating, setIsRotating] = useState(false);

  //Xử lý kiểm tra item có đang kéo hay không
  const [isDragging, setIsDragging] = useState(false);

  //Lưu trữ data của các child data
  const [listDataItem, setListDataItem] = useState(listChildData);

  //Lưu trữ data lines truyền xuống component con để vẽ đường thẳng
  const [sizeLines, setSizeLines] = useState({
    idItemDragging: -1,
    lines: [],
  });

  //Lưu trữ tọa độ góc của Draw Rect Select
  const [drawRectCoordinate, setDrawRectCoordinate] = useState({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    x3: 0,
    y3: 0,
    x4: 0,
    y4: 0,
  });

  //Khi CV User Store có sự thay đổi thì cập nhật lại listDataItem
  // useEffect(() => {
  //   const newChildRefs = listChildData.map(() => React.createRef());

  //   setListChildRefs(newChildRefs);

  //   setListDataItem(listChildData);
  // }, [listChildData]);

  // (*)Kỹ thuật setRefs tạo mảng chứa các Ref cho các item component kéo thả bên trong, vì dữ liệu trả về là ReactDOM do ta truyền vào <Item> chứ nếu truyền hàm component:Item ko cần, nên ta cần chuyển sang DomElement để lấy các kích thước xử lý
  const listChildRefs = useMemo(
    () => listDataItem.map(() => React.createRef()),
    [listDataItem]
  );

  const previousListChildDataRef = useRef(listChildData);
  useEffect(() => {
    if (previousListChildDataRef.current !== listChildData) {
      setListDataItem(listChildData);
      previousListChildDataRef.current = listChildData;
    }
  }, [listChildData]);

  useEffect(() => {
    //Ngăn chặn việc update lịch sử khi past không còn item nào => Gây ra bug không thể Undo mà phải kéo 2 step mới undo
    if (!!listStateDataItemHistory.past[0]) return;
    const newObjectUpdate = {
      cvId: idCurrentCv,
      boardId: boardId,
      listDataItem: cloneDeep(listDataItem),
    };

    //Cập nhật lich sử
    const newUpdateStateHistory = {
      cvId: idCurrentCv || "1234",
      historyState: cloneDeep(newObjectUpdate),
      limit: 20,
    };

    dispatch(CvSlice.actions.setHistoryState(newUpdateStateHistory));

    flagUpdateHistoryRefFirstTime.current = true;
  }, [listDataItem]);

  //====================Xử lý Lịch Sử==================================
  useEffect(() => {
    if (
      !_.isEqual(listStateDataItemHistory.present?.listDataItem, listDataItem)
    ) {
      dispatch(
        CvSlice.actions.setUpdateListDataItemInBoard(
          listStateDataItemHistory.present
        )
      );
    }
  }, [listStateDataItemHistory]);
  //=====================Xử lý sự kiện  khi nhấn phím =====================
  useEffect(() => {
    //Xử lý xoá item khi nhấn phím delete hoặc backspace
    if (keyPressed === "Backspace" || keyPressed === "Delete") {
      handleDeleteItemsSelected(boardId, IdPageActive);
    }
  }, [keyPressed]);

  useEffect(() => {
    //Xử lý khi nhấn phím ctrl+z, Cẩn thận vì đứng ở window nên nó sẽ chạy tất cả bảng cùng lúc
    if (
      listKeyPressed.includes("Control") &&
      !listKeyPressed.includes("Shift") &&
      (listKeyPressed.includes("z") || listKeyPressed.includes("Z"))
    ) {
      if (boardId === IdPageActive) {
        console.log("Undo", boardId, IdPageActive);
        dispatch(CvSlice.actions.setUndoHistoryState());
      }
    }

    //Xử lý khi nhấn phím redo: ctrl+shift+z hoặc ctrl+y
    if (
      listKeyPressed.includes("Control") &&
      listKeyPressed.includes("Shift") &&
      (listKeyPressed.includes("z") || listKeyPressed.includes("Z"))
    ) {
      if (boardId === IdPageActive) {
        console.log("Redo", boardId, IdPageActive);
        dispatch(CvSlice.actions.setRedoHistoryState());
      }
    }
  }, [listKeyPressed]);

  useEffect(() => {
    if (IdPageActive === boardId) console.log({ IdPageActive, boardId });
  }, [IdPageActive]);

  // Lắng nghe sự kiện nhấn phím
  useEffect(() => {
    const handleKeyDown = (event) => {
      setKeyPressed(event.key);

      setListKeyPressed((prev) =>
        prev.includes(event.key) ? prev : [...prev, event.key]
      );
    };

    const handleKeyUp = (event) => {
      setKeyPressed(null);

      //Xóa nút vừa thả ra khỏi list
      setListKeyPressed((prev) => prev.filter((key) => key !== event.key));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Xử lý thay đổi độ quay của item
  useEffect(() => {
    handleRotateResize();
  }, [sizeAndRotateItemSelector]);

  //  xử lý select area
  useEffect(() => {
    updatePositionRectangleSelect();
    selectItemsInRectangle(boardId, IdPageActive, isClickOutsideItemSelector);
  }, [startPositionRect, currentPositionRect, isClickOutsideItemSelector]);

  useEffect(() => {
    //Nếu click ra ngoài ITEM(click vào BOARD) thì reset lại các item đã chọn
    isClickOutsideItemSelector &&
      dispatch(
        CvSlice.actions.setPropertyItemsDragSelect({
          mode: "single",
          items: [],
        })
      );
  }, [isClickOutsideItemSelector]);

  useEffect(() => {
    //Không có item nào đang resize hoặc rotate thì mới update History trong store
    const listIdResizeOrRotate = Object.keys(listIdItemResizeOrRotateSelector);
    const isIncludesItemResizeOrRotateInBoard = Object.values(
      listIdItemResizeOrRotateSelector
    ).some((valueItem) => !!valueItem);

    listIdResizeOrRotate.forEach((idItem) => {
      //Kiểm tra xem có đúng board hiện tại đg chứa item đang rotate không
      const isBoardContainRotateResize = listDataItem.some(
        (dataItem) =>
          `${idCurrentCv}-${dataItem.boardId}-${dataItem.id}` === idItem
      );
      if (isBoardContainRotateResize && !isIncludesItemResizeOrRotateInBoard) {
        const newObjectUpdate = {
          cvId: idCurrentCv,
          boardId: boardId,
          listDataItem: cloneDeep(listDataItem),
        };

        //Cập nhật lich sử, Chỉ cập nhật ở board đang chọn

        const newUpdateStateHistory = {
          cvId: idCurrentCv || "1234",
          past: [],
          future: [],
          historyState: cloneDeep(newObjectUpdate),
          limit: 20,
        };

        console.log("[newUpdateStateHistoryResize:::]", newUpdateStateHistory);
        dispatch(CvSlice.actions.setHistoryState(newUpdateStateHistory));
      }
    });

    // listIdItemResizeOrRotateSelector có 2 board nên chạy 2 lần, mà trong 2 lần thì listDataItem mỗi lần là khác nhau, do vậy cần phải checkId của item đang resize hoặc rotate đúng thì mới update ListDataItem vào lich su
  }, [listIdItemResizeOrRotateSelector]);

  // Hàm xử lý format data trước khi update
  // function formatDataBeforeUpdate(listDataItem = []) {
  //   return listDataItem.map((dataItem) => {
  //     delete dataItem.component;
  //     return dataItem;
  //   });
  // }

  //====================Hàm xử lý updateListDataItem vào Store Redux=========================
  function handleUpdateListDataItemIntoStore(
    newListDataItem,
    typeUpdate = "normal"
  ) {
    // const convertObjPayload = formatDataBeforeUpdate(newListDataItem);
    const convertObjPayload = newListDataItem;

    //Cập nhật lại listDataItem trong Store
    const newObjectUpdate = {
      cvId: idCurrentCv,
      boardId: boardId,
      listDataItem: cloneDeep(convertObjPayload),
    };
    dispatch(CvSlice.actions.setUpdateListDataItemInBoard(newObjectUpdate));

    //Nếu đang resize hoặc rotate thì không cần cập nhật lịch sử, khi nào xong mới cập nhật lịch sử sau, cập nhật trong quá trình kéo sẽ có quá nhiều lịch sử sinh ra
    if (typeUpdate !== "resize_rotate") {
      //Cập nhật lich sử
      const newUpdateStateHistory = {
        cvId: idCurrentCv || "1234",
        historyState: cloneDeep(newObjectUpdate),
        limit: 20,
      };
      dispatch(CvSlice.actions.setHistoryState(newUpdateStateHistory));
    }
  }
  /**
   * @description Hàm xử lý xoá các items đã chọn
   */
  function handleDeleteItemsSelected(boardId, idActiveBoard) {
    if (boardId !== idActiveBoard) return;
    //Kiểm tra xemx có item nào hiện tại có đg focus không, nếu ko ktra bấm xóa nó xóa luôn item
    if (idEditorSelector !== -1) return;

    const listItemsSelected = cloneDeep(itemsSelectedSelector.items);
    const newListDataDeleted = listDataItem.filter((dataItem) => {
      return !listItemsSelected.some((item) => item.id === dataItem.id);
    });

    handleUpdateListDataItemIntoStore(cloneDeep(newListDataDeleted));
  }

  // Update vị trí coord của rectangle
  function updatePositionRectangleSelect() {
    if (startPositionRect && currentPositionRect) {
      //Góc trái trên của hình chữ nhật select
      let angleTopLeft = {
        x: Math.min(startPositionRect.x, currentPositionRect.x),
        y: Math.min(startPositionRect.y, currentPositionRect.y),
      };

      //Góc phải dưới của hình chữ nhật select
      let angleBotRight = {
        x: Math.max(startPositionRect.x, currentPositionRect.x),
        y: Math.max(startPositionRect.y, currentPositionRect.y),
      };

      setDrawRectCoordinate({
        x1: angleTopLeft.x,
        y1: angleTopLeft.y,
        x2: angleBotRight.x,
        y2: angleTopLeft.y,
        x3: angleBotRight.x,
        y3: angleBotRight.y,
        x4: angleTopLeft.x,
        y4: angleBotRight.y,
      });
    }
  }

  /**
   * @description Hàm dùng để thêm các item nằm trong khu vực của rectangle select vào
   */
  function selectItemsInRectangle(boardId, idActiveBoard, isClickOutside) {
    if (isDragging) return; // Nếu đang kéo thì không chọn được
    if (boardId !== idActiveBoard) return; // Nếu không phải board đang active thì không chọn được

    //Diện tích select Rectangle phải > 100 thì mới chọn được item
    if (
      (drawRectCoordinate.x2 - drawRectCoordinate.x1) *
        (drawRectCoordinate.y3 - drawRectCoordinate.y1) <
      100
    ) {
      return;
    }

    let selectItemIds = [];
    const TRANSLATE_NUM = TRANSLATE_RATE / 100;
    listDataItem.forEach((dataItem) => {
      const { x, y, x3, y3 } = dataItem.coordinate;

      //Kiểm tra 2 hình chữ nhật có giao nhau không
      if (
        // Rectangle nằm phía bên trái item
        drawRectCoordinate.x3 < x - TRANSLATE_NUM * dataItem.sizeItem.width ||
        // Rectangle nằm bên phải item
        drawRectCoordinate.x1 > x3 - TRANSLATE_NUM * dataItem.sizeItem.width ||
        // Rectangle nằm phía trên item
        drawRectCoordinate.y3 < y - TRANSLATE_NUM * dataItem.sizeItem.height ||
        // Rectangle nằm phía dưới item
        drawRectCoordinate.y1 > y3 - TRANSLATE_NUM * dataItem.sizeItem.height
      ) {
        //Các hình chữ nhật không giao nhau
        return;
      }

      //Sau khi kiểm tra thấy thỏa mãn
      selectItemIds.push({ id: dataItem.id });
    });

    //Update kho chứa items Drag chung, nếu có nhiều hơn 1 item thì chuyển sang chế độ multiple
    dispatch(
      CvSlice.actions.setPropertyItemsDragSelect({
        mode: selectItemIds.length > 1 ? "multiple" : "single",
        items: [...selectItemIds],
      })
    );
  }

  /**
   * @description Hàm xử lý sự kiện khi xoay item
   * Ý tưởng: Khi thẻ wrapperRotateResize bên trong rotate thì browser tự động thay đổi width+height sao cho phù hợp
   * , trùng hợp là kích thước width,height của browser lại chứa vừa đủ kích thước của thẻ Wrapper, nên ta sẽ set kích thước này
   * cho thẻ cha bên ngoài
   */
  function handleRotateResize() {
    const idActiveRotate = sizeAndRotateItemSelector.id;
    const TRANSLATE_NUM = TRANSLATE_RATE / 100;

    listChildRefs &&
      listChildRefs.forEach((childRef) => {
        //Lấy ra thẻ wrapperItem bên trong DragItem để tiến hành lấy kích thước
        const currentActiveChild = childRef.current?.querySelector(
          `.IWrapperResizeRotate-${idActiveRotate}`
        );

        //Lấy ra kích thước của wrapper-drag-item sau khi rotate
        const rectChildActive = currentActiveChild?.getBoundingClientRect();

        //Lưu lại width, height của item vào redux để khi lấy ra vẫn ở trạng thái xoay, resize và nội dung content không bị thay đổi

        if (rectChildActive) {
          const newListDataItemRotateResize = [...listDataItem].map((data) => {
            if (data.id === idActiveRotate) {
              // Cập nhật lại kích thước của item sau khi rotate chứa vừa đủ wrapper bên trong, đính kèm thêm scale hiện tại
              const updatedData = {
                ...data,
                sizeItem: {
                  width: rectChildActive.width / zoomScale,
                  height: rectChildActive.height / zoomScale,
                },
                rotateDeg: sizeAndRotateItemSelector.deg,
              };

              // Đo khoảng cách giữa các item sau khi xoay, x = tọa độ tại X gốc - độ dịch * width Item
              measureDistanceBetweenItems(idActiveRotate, 0.5, {
                x:
                  updatedData.coordinate.x -
                  (TRANSLATE_NUM * updatedData.sizeItem.width) / zoomScale,
                y:
                  updatedData.coordinate.y -
                  (TRANSLATE_NUM * updatedData.sizeItem.height) / zoomScale,
                x2:
                  updatedData.coordinate.x +
                  (updatedData.sizeItem.width -
                    TRANSLATE_NUM * updatedData.sizeItem.width) /
                    zoomScale,
                y2:
                  updatedData.coordinate.y -
                  (TRANSLATE_NUM * updatedData.sizeItem.height) / zoomScale,
                x3:
                  updatedData.coordinate.x +
                  (updatedData.sizeItem.width -
                    TRANSLATE_NUM * updatedData.sizeItem.width) /
                    zoomScale,
                y3:
                  updatedData.coordinate.y +
                  (updatedData.sizeItem.height -
                    TRANSLATE_NUM * updatedData.sizeItem.height) /
                    zoomScale,
                x4:
                  updatedData.coordinate.x -
                  (TRANSLATE_NUM * updatedData.sizeItem.width) / zoomScale,
                y4:
                  updatedData.coordinate.y +
                  (updatedData.sizeItem.height -
                    TRANSLATE_NUM * updatedData.sizeItem.height) /
                    zoomScale,
                x5:
                  updatedData.coordinate.x +
                  (updatedData.sizeItem.width / 2 -
                    TRANSLATE_NUM * updatedData.sizeItem.width) /
                    zoomScale,
                y5:
                  updatedData.coordinate.y +
                  (updatedData.sizeItem.height / 2 -
                    TRANSLATE_NUM * updatedData.sizeItem.height) /
                    zoomScale,
              });

              return updatedData;
            }
            return data;
          });

          handleUpdateListDataItemIntoStore(
            cloneDeep(newListDataItemRotateResize),
            "resize_rotate"
          );

          setListDataItem(newListDataItemRotateResize);
        }
      });
  }

  /**
   * @description Hàm xử lý sự kiện khi kéo item, có tích hợp hỗ trợ kéo thả
   * @param {Number} idActiveItem - Id của item đang kéo
   * @param {Number} TOLERANCE - Sai số cho phép khi so sánh tọa độ
   * @param {Object} boardCoordinateItemsActive - Tọa độ của item đang kéo
   * @returns {void} Không có giá trị trả về
   * CT tinh khoảng cách dựa trên tọa độ: sqrt((x2-x1)^2 + (y2-y1)^2)
   *
   * Hình minh họa cho việc tính các góc của item
   *                top                 top
   *                |                   |
   *                |                   |
   *                |         (w)       |
   *     left-----(x, y) ----------- (x2, y2)--------right
   *                |                   |
   *                |                   |
   *            (h) |       (x5,y5)     |
   *                |                   |
   *                |                   |
   *                |                   |
   *    right----(x4, y4) ----------- (x3, y3)-------right
   *                |                   |
   *                |                   |
   *                |                   |
   *              botton               botton
   *
   *Các bước thực hiện:
   *  1. Lấy ra tọa độ của item đang kéo từ active.data.current
   *  2. forEach qua item có id khác với item
   *  3. check tọa độ item hiện tại có nằm trong(trùng) tọa độ(x,y) của item khác không theo khoảng
   *  4. Nếu có thì tính khoảng cách, trùng X thì tính k/c Y, trùng Y thì tính k/c X
   *  5. so sánh khoảng cách, lấy khoảng cách nhỏ nhất để gán vào mảng lines
   *  6. Truyền mảng lines xuống component con để vẽ đường thẳng
   **/

  //V2 sẽ update lấy tọa độ các điểm bên trong item, so sánh 2 điểm trong item xem k/c nào lớn hơn thì lấy
  async function measureDistanceBetweenItems(
    idActiveItem,
    TOLERANCE = 0.75,
    boardCoordinateItemsActive,
    event
  ) {
    // Thật ra là nếu sau khi thấy nó khớp ta có thể dùng map sau đó return về luôn

    //(*Important) Mảng Lines lưu trữ các đường thẳng nối tọa độ của các item, nó sẽ được truyền xuống item con
    const lines = [
      { left: 0, top: 0 },
      { top: 0, right: 0 },
      { right: 0, bottom: 0 },
      { bottom: 0, left: 0 },
      { top: 0, right: 0, bottom: 0, left: 0 },
    ];

    let isAutoFitLine = false;

    listDataItem.forEach((dataItem) => {
      // ID đang kéo phải khác với id của item đang so sánh
      if (idActiveItem !== dataItem.id) {
        const sizeItem = dataItem.sizeItem;
        //(*!Important)Độ lệch khi translate, khi dịch 50% chẳng hạn thì phải dời về vị trí cũ của nó để so sánh
        const deviationHeight = (TRANSLATE_RATE * sizeItem.height) / 100;
        const deviationWidth = (TRANSLATE_RATE * sizeItem.width) / 100;
        // Gộp Tọa độ của các dataItem trong list đang so sánh (khác với item đang kéo)
        const coordinates = [
          {
            x: dataItem.coordinate.x - deviationWidth,
            y: dataItem.coordinate.y - deviationHeight,
          }, // index 0 là x, y
          {
            x: dataItem.coordinate.x2 - deviationWidth,
            y: dataItem.coordinate.y2 - deviationHeight,
          }, // index 1 là x2, y2
          {
            x: dataItem.coordinate.x3 - deviationWidth,
            y: dataItem.coordinate.y3 - deviationHeight,
          }, // index 2 là x3, y3
          {
            x: dataItem.coordinate.x4 - deviationWidth,
            y: dataItem.coordinate.y4 - deviationHeight,
          }, // index 3 là x4, y4
          {
            x: dataItem.coordinate.x5 - deviationWidth,
            y: dataItem.coordinate.y5 - deviationHeight,
          }, // index 4 là x5, y5
        ];

        // Gộp các tọa độ của item đang active
        const draggingCoordinates = [
          { x: boardCoordinateItemsActive.x, y: boardCoordinateItemsActive.y },
          {
            x: boardCoordinateItemsActive.x2,
            y: boardCoordinateItemsActive.y2,
          },
          {
            x: boardCoordinateItemsActive.x3,
            y: boardCoordinateItemsActive.y3,
          },
          {
            x: boardCoordinateItemsActive.x4,
            y: boardCoordinateItemsActive.y4,
          },
          {
            x: boardCoordinateItemsActive.x5,
            y: boardCoordinateItemsActive.y5,
          },
        ];

        // Check xem vị trí item trong danh sách để kiểm tra vị trí

        draggingCoordinates.forEach(
          //Duyệt qua tất cả các tọa độ của item đang kéo
          ({ x: activeX, y: activeY }, activeIndex) => {
            //Duyệt qua tọa độ item trong listItem
            coordinates.forEach(({ x, y }, index) => {
              //X,Y là tọa độ của item trong bảng đang so sánh

              if (activeX >= x - TOLERANCE && activeX <= x + TOLERANCE) {
                isAutoFitLine = true;
                //Check thấy vị trí đg kéo trùng theo X

                // Khoảng cách giữa 2 tọa độ trên trục Y
                const distanceY = calculateDistanceByCoordinate({
                  x1: activeX,
                  y1: activeY,
                  x2: x,
                  y2: y,
                });

                /**
                  (*)Quy luật tìm hướng đường thẳng:
                  x trùng lặp thì kq  chỉ có thể là top hoặc bot 
                  => dragY-y > 0 là top(đẩy theo hướng top), và ngược lại <0 là bot
                 */
                const direction = activeY - y > 0 ? "top" : "bottom";

                if (
                  lines[activeIndex][direction] === 0 ||
                  lines[activeIndex][direction] < distanceY
                ) {
                  //activeIndex lần lượt chạy theo thứ tự top-left, top-right, bottom-right, bottom-left, center, tương ứng: 0,1,2,3,4
                  //Lấy khoảng cách lớn nhất giữa 2 item
                  lines[activeIndex][direction] = distanceY;
                }
              }

              //Kiểm tra y của item đang kéo có thuộc khoảng tọa độ trùng nhau của item khác không
              if (activeY >= y - TOLERANCE && activeY <= y + TOLERANCE) {
                //TRÙNG Y KHÁC X
                isAutoFitLine = true;
                //Check thấy vị trí đg kéo trùng theo Y
                const distanceX = calculateDistanceByCoordinate({
                  x1: activeX,
                  y1: activeY,
                  x2: x,
                  y2: y,
                });

                /**
                 (*) Quy luật tìm hướng khi X trùng nhau:
                 y trùng lặp chỉ có thể là left hoặc right
                 => dragX-x >0 là left, ngược lại là right   
                 */
                const direction = activeX - x > 0 ? "left" : "right";

                if (
                  lines[activeIndex][direction] === 0 ||
                  lines[activeIndex][direction] < distanceX
                ) {
                  //Lấy khoảng cách theo X lớn nhất giữa 2 item
                  lines[activeIndex][direction] = distanceX;
                }
              }
            });
          }
        );
      }
    });

    //Chỉ khi kéo va chạm với item khác thì mới cập nhật lại mảng lines
    if (_.isEqual(sizeLines.lines, lines) === false) {
      setSizeLines((prev) => ({
        ...prev,
        idItemDragging: idActiveItem,
        lines,
      }));
    }
  }

  function handleDragMove(event) {
    //(*)Sai số cho phép khi so sánh tọa độ
    const TOLERANCE = 0.5;
    const TRANSLATE_NUM = TRANSLATE_RATE / 100;

    const { active, delta } = event;

    if (!active) return;

    const idDragging = active.id;
    const dataComponentDragging = active.data.current;

    const currentComponentDom = dataComponentDragging.componentRef.current;

    // Lấy ra kích thước item hiện tại để tính tọa độ
    if (!currentComponentDom && !currentComponentDom?.getBoundingClientRect())
      return;

    const { width, height } = currentComponentDom.getBoundingClientRect();

    //Do nó sẽ dịch 50% nên phải trừ đi 50% để nó dịch về vị trí cũ tiện so sánh, đồng thời bên trong hàm measureDistanceBetweenItems cũng sẽ dịch 50% => cùng gốc mới so sánh được
    const newCoordinateDragging = {
      x:
        dataComponentDragging.coordinate.x +
        delta.x -
        (TRANSLATE_NUM * width) / zoomScale,

      y:
        dataComponentDragging.coordinate.y +
        delta.y -
        (TRANSLATE_NUM * height) / zoomScale,
      x2:
        dataComponentDragging.coordinate.x +
        delta.x +
        (width - TRANSLATE_NUM * width) / zoomScale,
      y2:
        dataComponentDragging.coordinate.y +
        delta.y -
        (TRANSLATE_NUM * height) / zoomScale,
      x3:
        dataComponentDragging.coordinate.x +
        delta.x +
        (width - TRANSLATE_NUM * width) / zoomScale,
      y3:
        dataComponentDragging.coordinate.y +
        delta.y +
        (height - TRANSLATE_NUM * height) / zoomScale,
      x4:
        dataComponentDragging.coordinate.x +
        delta.x -
        (TRANSLATE_NUM * width) / zoomScale,
      y4:
        dataComponentDragging.coordinate.y +
        delta.y +
        (height - TRANSLATE_NUM * height) / zoomScale,
      x5:
        dataComponentDragging.coordinate.x +
        delta.x +
        (width / 2 - TRANSLATE_NUM * width) / zoomScale,
      y5:
        dataComponentDragging.coordinate.y +
        delta.y +
        (height / 2 - TRANSLATE_NUM * height) / zoomScale,
    };

    measureDistanceBetweenItems(
      idDragging,
      TOLERANCE,
      newCoordinateDragging,
      event
    );
  }
  function handleDragStart(event) {
    console.log("Event STart:::", event);

    setIsDragging(true);

    //(*)Sai số cho phép khi so sánh tọa độ
    const TOLERANCE = 0.5;

    //(*) Độ dịch tọa độ translate là 50% kích thước item
    const TRANSLATE_NUM = TRANSLATE_RATE / 100;

    const { active } = event;

    const idActive = active.id;
    const dataComponentActive = active.data.current;

    const currentComponentDom = dataComponentActive.componentRef.current;

    if (!currentComponentDom && !currentComponentDom?.getBoundingClientRect())
      return;

    // Lấy ra kích thước item hiện tại để tính tọa độ
    const { width, height } = currentComponentDom.getBoundingClientRect();
    const newCoordinateActive = {
      x: dataComponentActive.coordinate.x - (TRANSLATE_NUM * width) / zoomScale,
      y:
        dataComponentActive.coordinate.y - (TRANSLATE_NUM * height) / zoomScale,
      x2:
        dataComponentActive.coordinate.x +
        (width - TRANSLATE_NUM * width) / zoomScale,
      y2:
        dataComponentActive.coordinate.y - (TRANSLATE_NUM * height) / zoomScale,
      x3:
        dataComponentActive.coordinate.x +
        (width - TRANSLATE_NUM * width) / zoomScale,
      y3:
        dataComponentActive.coordinate.y +
        (height - TRANSLATE_NUM * height) / zoomScale,
      x4:
        dataComponentActive.coordinate.x - (TRANSLATE_NUM * width) / zoomScale,
      y4:
        dataComponentActive.coordinate.y +
        (height - TRANSLATE_NUM * height) / zoomScale,
      x5:
        dataComponentActive.coordinate.x +
        (width / 2 - TRANSLATE_NUM * width) / zoomScale,
      y5:
        dataComponentActive.coordinate.y +
        (height / 2 - TRANSLATE_NUM * height) / zoomScale,
    };

    measureDistanceBetweenItems(
      idActive,
      TOLERANCE,
      newCoordinateActive,
      event
    );
  }

  function handleDragEnd(event) {
    console.log("EVENT DRAG END:::", event);

    const { active, delta } = event;

    if (!active) return;

    setIsDragging(false);

    const dataComponentDragging = active.data.current;

    console.log("DATA: CURRENT:::", dataComponentDragging);
    const currentComponentDom = dataComponentDragging.componentRef.current;

    if (!currentComponentDom && !currentComponentDom?.getBoundingClientRect())
      return;
    // Lấy ra kích thước item hiện tại để tính tọa độ
    const { width, height } = currentComponentDom.getBoundingClientRect();

    // Lọc qua các item để cập nhật vị trí

    // Cập nhật vị trí mới của item được kéo
    const newDataListItemPositionDragEnd = listDataItem.map((data) => {
      const TRANSLATE_NUM = TRANSLATE_RATE / 100;
      //Check xem item đang kéo có phải là active item không, nếu đúng thì cập nhật tọa độ
      if (data.id === active.id) {
        const { x, y } = data.coordinate;

        //(*) Do khi scale thì tỉ lệ width height của item cũng sẽ thay đổi, nên ta phải chia cho zoomScale để nó về tọa độ gốc
        //Vd: width: 200 => scale 0.8 là còn 160 => 160/0.8 về lại 200
        const newCoordinate = {
          x: x + delta.x / zoomScale,
          y: y + delta.y / zoomScale,
          x2: x + width + delta.x / zoomScale,
          y2: y + delta.y / zoomScale,
          x3: x + width + delta.x / zoomScale,
          y3: y + height + delta.y / zoomScale,
          x4: x + delta.x / zoomScale,
          y4: y + height + delta.y / zoomScale,
          x5: x + width / 2 + delta.x / zoomScale,
          y5: y + height / 2 + delta.y / zoomScale,
        };

        return {
          ...data,
          coordinate: { ...newCoordinate },
        };
      }

      return data;
    });

    handleUpdateListDataItemIntoStore(
      newDataListItemPositionDragEnd,
      "drag_end"
    );

    setListDataItem(newDataListItemPositionDragEnd);
  }

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  });

  // const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor);
  return (
    <DndContext //dnd-context là nơi chứa các component có thể kéo thả
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      autoScroll={true}
      modifiers={modifiers}
      collisionDetection={rectIntersection}
    >
      {/* Rectangle Select Box - Chỉ xuất hiện ở page đg select và khi ko kéo hay ko xoay*/}
      {boardId === IdPageActive && !isDragging && !isRotating && (
        <Box
          sx={{
            position: "absolute",

            left: Math.min(startPositionRect?.x, currentPositionRect?.x),
            top: Math.min(startPositionRect?.y, currentPositionRect?.y),
            width: Math.abs(currentPositionRect?.x - startPositionRect?.x),
            height: Math.abs(currentPositionRect?.y - startPositionRect?.y),
            border: "2px dashed var(--color-primary1)",
            backgroundColor: "rgba(0,0,0,0.3)",
            display:
              isDrawingRectangle &&
              // Có tình trạng select area qua trái hoặc phải điểm start
              Math.abs(currentPositionRect?.x - startPositionRect?.x) > 1
                ? "block"
                : "none",
            opacity:
              isDrawingRectangle &&
              Math.abs(currentPositionRect?.y - startPositionRect?.y) > 1
                ? 1
                : 0,
          }}
        ></Box>
      )}
      {listDataItem &&
        listDataItem.map((childData, index) => {
          return (
            <IDraggbleItemWrapper
              isDragDisabled={
                // Chỉ có Author mới được kéo dù cho disabled
                isDragDisabled && studentData?.id !== childData.cvUserId
              }
              zoomScale={zoomScale}
              layer={childData.layer}
              typeDragItem={childData.type}
              sizeItem={childData.sizeItem}
              sizeLines={sizeLines}
              childId={childData.id}
              dataIndex={index}
              dataItem={{ ...childData, dataIndex: index }}
              key={childData.id}
              axis={axis}
              label={label}
              handle={handle}
              left={childData.coordinate.x}
              top={childData.coordinate.y}
              style={style}
              buttonStyle={buttonStyle}
              childElement={childData.component}
              // (*)Truyền Ref xuống component con để lấy dữ liệu
              componentRef={listChildRefs[index]}
            ></IDraggbleItemWrapper>
          );
        })}
    </DndContext>
  );
}

/**
 * @description Component Bọc toàn bộ ITem kéo thả bên trong, nó sẽ truyền các tham số từ dndcontext vào,
 * sau đó truyền tham số và các attribute,listener vào component IDraggableItem
 *
 * @param {Object} props
 * @param {String} props.axis Hướng kéo
 * @param {String} props.label Label cho component
 * @param {Object} props.style Style cho component
 * @param {Number} props.top Vị trí top của component
 * @param {Number} props.left Vị trí left của component
 * @param {Object} props.handle Handle kéo
 * @param {Object} props.buttonStyle Style cho button
 * @returns {React.ReactElement} Component bọc toàn bộ Item kéo thả bên trong
 *
 **/
export const IDraggbleItemWrapper = ({
  layer = 1,
  sizeItem,
  sizeLines, //Mảng chứa các đường thẳng nối giữa các item
  dataItem, //Truyền dataItem vào để xác định data hiện tại của component khi kéo thả
  dataIndex,
  childId, //childId la duy nhat, dung de xac dinh component khi keo tha, nếu ko sẽ kéo thả trùng lặp
  axis,
  label,
  style,
  top,
  left,
  handle,
  childElement,
  buttonStyle,
  componentRef,
  typeDragItem,
  isDragDisabled,
  zoomScale,
}) => {
  /**
   useDraggable chỉ chạy khi component được kéo
   */
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({
      id: childId, //Id là unique, dùng để xác định component khi kéo thả
      data: {
        ...dataItem,
        componentRef, //Sau khi gán xong Ref component con sẽ lưu trữ vào trong data dưới dạng domElement
      }, //Gán data vào trong component khi kéo thả
      disabled: isDragDisabled,
    });

  return (
    <IDraggableItem
      id={childId}
      sizeLines={sizeLines}
      zoomScale={zoomScale}
      ref={(node) => {
        //Ref nhận vào 1 agr là node, ta setNodeRef cho item kéo thả bên trong, còn lại ta sẽ lưu lại HTMLDOM trong componentRef
        componentRef.current = node; //Gán giá trị Dom vào ref component
        return setNodeRef(node);
      }}
      dragging={isDragging}
      handle={handle}
      label={label}
      listeners={listeners}
      style={{
        ...style,

        top: top,
        left: left,
        // Set chiều rộng và cao của item khi rotate cho vừa với nội dung
        width: sizeItem?.width,
        height: sizeItem?.height,

        zIndex: layer,
        // Set transform để xoay item khi xoay sẽ quay xung quanh tâm
        transform: `translate3d(-${TRANSLATE_RATE}%,-${TRANSLATE_RATE}%, 0)`,
      }}
      buttonStyle={buttonStyle}
      transform={transform}
      axis={axis}
      childElement={childElement}
      {...attributes}
    />
  );
};
