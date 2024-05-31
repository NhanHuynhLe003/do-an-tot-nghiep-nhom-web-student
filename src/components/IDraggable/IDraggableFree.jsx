import {
  DndContext,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import _, { set } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { sizeAndDegItemDraggableSelector } from "../../redux/selector";
import { calculateDistanceByCoordinate, debounce } from "../../utils";
import IDraggableItem from "./DraggableItem";

//Translate tọa độ => Khi rotate cho nó quay xung quanh tâm
const TRANSLATE_RATE = 50;

export default function IDraggableFree({
  activationConstraint, // Dùng để thiết lập thời gian delay khi kéo, khoảng cách kéo, hoặc cả 2
  axis, // Dùng để thiết lập hướng kéo
  handle, // Dùng để thiết lập handle kéo
  label = "Go ahead, drag me.",
  modifiers, // Dùng để thiết lập các ràng buộc khi kéo
  style, // Dùng để thiết lập style cho component
  buttonStyle, // Dùng để thiết lập style cho button
  listChildData = [], // chứa các element con trong bảng kéo thả
}) {
  const sizeAndRotateItemSelector = useSelector(
    sizeAndDegItemDraggableSelector
  );
  const [listDataItem, setListDataItem] = useState(listChildData);

  //Lưu trữ data lines truyền xuống component con để vẽ đường thẳng
  const [sizeLines, setSizeLines] = useState({
    idItemDragging: -1,
    lines: [],
  });

  // (*)Kỹ thuật setRefs tạo mảng chứa các Ref cho các item component kéo thả bên trong, vì dữ liệu trả về là ReactDOM do ta truyền vào <Item> chứ nếu truyền hàm component:Item ko cần, nên ta cần chuyển sang DomElement để lấy các kích thước xử lý
  const listChildRefs = useRef(listDataItem.map(() => React.createRef()));

  // Xử lý thay đổi độ quay của item
  useEffect(() => {
    handleRotate();
  }, [sizeAndRotateItemSelector]);

  /**
   * @description Hàm xử lý sự kiện khi xoay item
   * Ý tưởng: Khi thẻ wrapperRotateResize bên trong rotate thì browser tự động thay đổi width+height sao cho phù hợp
   * , trùng hợp là kích thước width,height của browser lại chứa vừa đủ kích thước của thẻ Wrapper, nên ta sẽ set kích thước này
   * cho thẻ cha bên ngoài
   */
  function handleRotate() {
    const idActiveRotate = sizeAndRotateItemSelector.id;
    const TRANSLATE_NUM = TRANSLATE_RATE / 100;
    listChildRefs.current.forEach((childRef) => {
      const currentActiveChild = childRef.current.querySelector(
        `.IWrapperResizeRotate-${idActiveRotate}`
      );

      const rectChildActive = currentActiveChild?.getBoundingClientRect();
      if (rectChildActive) {
        setListDataItem((listDataItem) => {
          return listDataItem.map((data) => {
            if (data.id === idActiveRotate) {
              // Cập nhật lại kích thước của item
              const updatedData = {
                ...data,
                sizeItem: {
                  width: rectChildActive.width,
                  height: rectChildActive.height,
                },
              };

              // Đo khoảng cách giữa các item sau khi xoay
              measureDistanceBetweenItems(idActiveRotate, 0.75, {
                x:
                  updatedData.coordinate.x -
                  TRANSLATE_NUM * updatedData.sizeItem.width,
                y:
                  updatedData.coordinate.y -
                  TRANSLATE_NUM * updatedData.sizeItem.height,
                x2:
                  updatedData.coordinate.x +
                  updatedData.sizeItem.width -
                  TRANSLATE_NUM * updatedData.sizeItem.width,
                y2:
                  updatedData.coordinate.y -
                  TRANSLATE_NUM * updatedData.sizeItem.height,
                x3:
                  updatedData.coordinate.x +
                  updatedData.sizeItem.width -
                  TRANSLATE_NUM * updatedData.sizeItem.width,
                y3:
                  updatedData.coordinate.y +
                  updatedData.sizeItem.height -
                  TRANSLATE_NUM * updatedData.sizeItem.height,
                x4:
                  updatedData.coordinate.x -
                  TRANSLATE_NUM * updatedData.sizeItem.width,
                y4:
                  updatedData.coordinate.y +
                  updatedData.sizeItem.height -
                  TRANSLATE_NUM * updatedData.sizeItem.height,
                x5:
                  updatedData.coordinate.x +
                  updatedData.sizeItem.width / 2 -
                  TRANSLATE_NUM * updatedData.sizeItem.width,
                y5:
                  updatedData.coordinate.y +
                  updatedData.sizeItem.height / 2 -
                  TRANSLATE_NUM * updatedData.sizeItem.height,
              });

              return updatedData;
            }
            return data;
          });
        });
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
   *    Trục Y
   *       ^
   *     6 |
   *     5 |
   *     4 |
   *     3 |
   *     2 |  ****    ****
   *     1 |  ****    ****
   *     0 +-----------------> Trục X
   *       |   (1)     (2)
   *
   * -Trường hợp 1: Item 1 và Item 2 trùng nhau theo trục Y, cách nhau 1 khoảng X.
   *
   *       Trục Y
   *       ^
   *     6 |
   *     5 |
   *     4 |
   *     3 |   (1)
   *     2 |  ****
   *     1 |  ****
   *     0 +--****------------------------> Trục X
   *       |
   *       |  ****
   *       |  ****
   *       |   (2)
   *
   * -Trường hợp 2: Item 1 và Item 2 trùng nhau theo trục X, cách nhau 1 khoảng Y.
   *=====================================================================
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
   *   1. Lấy ra tọa độ của item đang kéo từ active.data.current
   *   2. forEach qua item có id khác với item
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
                  //activeIndex lần lượt chạy theo thứ tự top, right, bottom, left, center, tương ứng: 0,1,2,3,4
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

    const idDragging = active.id;
    const dataComponentDragging = active.data.current;

    const currentComponentDom = dataComponentDragging.componentRef.current;

    // Lấy ra kích thước item hiện tại để tính tọa độ
    const { width, height } = currentComponentDom.getBoundingClientRect();

    const newCoordinateDragging = {
      //Do nó sẽ dịch 50% nên phải trừ đi 50% để nó dịch về vị trí cũ tiện so sánh, còn DragEnd vẫn giữ nguyên vì nó là gốc
      x: dataComponentDragging.coordinate.x + delta.x - TRANSLATE_NUM * width,

      y: dataComponentDragging.coordinate.y + delta.y - TRANSLATE_NUM * height,
      x2:
        dataComponentDragging.coordinate.x +
        delta.x +
        width -
        TRANSLATE_NUM * width,
      y2: dataComponentDragging.coordinate.y + delta.y - TRANSLATE_NUM * height,
      x3:
        dataComponentDragging.coordinate.x +
        delta.x +
        width -
        TRANSLATE_NUM * width,
      y3:
        dataComponentDragging.coordinate.y +
        delta.y +
        height -
        TRANSLATE_NUM * height,
      x4: dataComponentDragging.coordinate.x + delta.x - TRANSLATE_NUM * width,
      y4:
        dataComponentDragging.coordinate.y +
        delta.y +
        height -
        TRANSLATE_NUM * height,
      x5:
        dataComponentDragging.coordinate.x +
        delta.x +
        width / 2 -
        TRANSLATE_NUM * width,
      y5:
        dataComponentDragging.coordinate.y +
        delta.y +
        height / 2 -
        TRANSLATE_NUM * height,
    };

    measureDistanceBetweenItems(
      idDragging,
      TOLERANCE,
      newCoordinateDragging,
      event
    );
  }
  function handleDragStart(event) {
    //(*)Sai số cho phép khi so sánh tọa độ
    const TOLERANCE = 0.5;

    //(*) Độ dịch tọa độ translate là 50% kích thước item
    const TRANSLATE_NUM = TRANSLATE_RATE / 100;

    const { active } = event;

    const idActive = active.id;
    const dataComponentActive = active.data.current;

    const currentComponentDom = dataComponentActive.componentRef.current;

    // Lấy ra kích thước item hiện tại để tính tọa độ
    const { width, height } = currentComponentDom.getBoundingClientRect();
    const newCoordinateActive = {
      x: dataComponentActive.coordinate.x - TRANSLATE_NUM * width,
      y: dataComponentActive.coordinate.y - TRANSLATE_NUM * height,
      x2: dataComponentActive.coordinate.x + width - TRANSLATE_NUM * width,
      y2: dataComponentActive.coordinate.y - TRANSLATE_NUM * height,
      x3: dataComponentActive.coordinate.x + width - TRANSLATE_NUM * width,
      y3: dataComponentActive.coordinate.y + height - TRANSLATE_NUM * height,
      x4: dataComponentActive.coordinate.x - TRANSLATE_NUM * width,
      y4: dataComponentActive.coordinate.y + height - TRANSLATE_NUM * height,
      x5: dataComponentActive.coordinate.x + width / 2 - TRANSLATE_NUM * width,
      y5:
        dataComponentActive.coordinate.y + height / 2 - TRANSLATE_NUM * height,
    };

    measureDistanceBetweenItems(
      idActive,
      TOLERANCE,
      newCoordinateActive,
      event
    );
  }

  function handleDragEnd({ active, delta }) {
    const dataComponentDragging = active.data.current;
    const currentComponentDom = dataComponentDragging.componentRef.current;

    // Lấy ra kích thước item hiện tại để tính tọa độ
    const { width, height } = currentComponentDom.getBoundingClientRect();
    const TRANSLATE_NUM = TRANSLATE_RATE / 100;
    // Lọc qua các item để cập nhật vị trí

    setListDataItem((listDataItem) => {
      // Cập nhật vị trí mới của item được kéo
      const newDataListItem = listDataItem.map((data) => {
        //Check xem item đang kéo có phải là active item không, nếu đúng thì cập nhật tọa độ
        if (data.id === active.id) {
          const { x, y } = data.coordinate;

          const newCoordinate = {
            x: x + delta.x,
            y: y + delta.y,
            x2: x + delta.x + width,
            y2: y + delta.y,
            x3: x + delta.x + width,
            y3: y + delta.y + height,
            x4: x + delta.x,
            y4: y + delta.y + height,
            x5: x + delta.x + width / 2,
            y5: y + delta.y + height / 2,
          };

          return {
            ...data,
            coordinate: { ...newCoordinate },
          };
        }

        return data;
      });

      return newDataListItem;
    });
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
      // autoScroll={true}

      modifiers={modifiers}
      collisionDetection={rectIntersection}
    >
      {listDataItem &&
        listDataItem.map((childData, index) => {
          return (
            <IDraggbleItemWrapper
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
              // Truyền Ref xuống component con để lấy dữ liệu
              componentRef={listChildRefs.current[index]}
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
    });

  return (
    <IDraggableItem
      id={childId}
      sizeLines={sizeLines}
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
