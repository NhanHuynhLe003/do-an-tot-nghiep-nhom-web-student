import {
  DndContext,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import React, { useRef, useState } from "react";
import { calculateDistanceByCoordinate } from "../../utils";
import IDraggableItem from "./DraggableItem";

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
  const [listDataItem, setListDataItem] = useState(listChildData);

  //Lưu trữ data lines truyền xuống component con để vẽ đường thẳng
  const [sizeLines, setSizeLines] = useState({
    idItemDragging: -1,
    lines: [],
  });

  // (*)Kỹ thuật setRefs Tạo mảng chứa các Ref cho các item component kéo thả bên trong, vì dữ liệu trả về là ReactDOM nên ta cần chuyển sang DomElement để lấy các kích thước xử lý
  const listChildRefs = useRef(listDataItem.map(() => React.createRef()));

  /**
    * @description Hàm xử lý sự kiện khi kéo item, có tích hợp hỗ trợ kéo thả
     CT tinh khoảng cách dựa trên tọa độ: sqrt((x2-x1)^2 + (y2-y1)^2)
     
      *    Trục Y
      *    ^
      *  6 |   
      *  5 |  
      *  4 |  
      *  3 |  
      *  2 |  ****    ****  
      *  1 |  ****    ****  
      *  0 +-----------------> Trục X
      *    |   (1)     (2)
      *
      * Trường hợp 1: Item 1 và Item 2 trùng nhau theo trục Y, cách nhau 1 khoảng X.     
      
      *    Trục Y
      *    ^
      *  6 |   
      *  5 |  
      *  4 |  
      *  3 |   (1) 
      *  2 |  ****  
      *  1 |  ****  
      *  0 +--****------------------------> Trục X
      *    |     
      *    |  ****  
      *    |  ****  
      *    |   (2)
      *
      * Trường hợp 2: Item 1 và Item 2 trùng nhau theo trục X, cách nhau 1 khoảng Y.
  ======================================================================
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
     
    Các bước thực hiện:
     1. Lấy ra tọa độ của item đang kéo từ active.data.current
     2. forEach qua item có id khác với item
     3. check tọa độ item hiện tại có nằm trong(trùng) tọa độ(x,y) của item khác không theo khoảng
     4. Nếu có thì tính khoảng cách, trùng X thì tính k/c Y, trùng Y thì tính k/c X
     5. so sánh khoảng cách, lấy khoảng cách nhỏ nhất để gán vào mảng lines
     6. Truyền mảng lines xuống component con để vẽ đường thẳng
     */
  function handleDragMove(event) {
    //(*)Sai số cho phép khi so sánh tọa độ
    const TOLERANCE = 0.5;

    const { active, delta } = event;
    const idDragging = active.id;
    const dataComponentDragging = active.data.current;
    // console.log(dataComponentDragging);
    const currentComponentDom = dataComponentDragging.componentRef.current;

    // Lấy ra kích thước item hiện tại để tính tọa độ
    const { width, height } = currentComponentDom.getBoundingClientRect();
    const newCoordinateDragging = {
      x: dataComponentDragging?.coordinate.x + delta.x,
      y: dataComponentDragging?.coordinate.y + delta.y,
      x2: dataComponentDragging?.coordinate.x + delta.x + width,
      y2: dataComponentDragging?.coordinate.y + delta.y,
      x3: dataComponentDragging?.coordinate.x + delta.x + width,
      y3: dataComponentDragging?.coordinate.y + delta.y + height,
      x4: dataComponentDragging?.coordinate.x + delta.x,
      y4: dataComponentDragging?.coordinate.y + delta.y + height,
      x5: dataComponentDragging?.coordinate.x + delta.x + width / 2,
      y5: dataComponentDragging?.coordinate.y + delta.y + height / 2,
    };

    // console.log(newCoordinateDragging);

    //(*Important) Mảng Lines lưu trữ các đường thẳng nối tọa độ của các item, nó sẽ được truyền xuống item con
    const lines = [
      { left: 0, top: 0 },
      { top: 0, right: 0 },
      { right: 0, bottom: 0 },
      { bottom: 0, left: 0 },
      { top: 0, right: 0, bottom: 0, left: 0 },
    ];

    //Tạo biến kiểm tra lines có change không
    let isChangeLine = false;

    listDataItem.forEach((dataItem) => {
      if (idDragging !== dataItem.id) {
        // Gộp Tọa độ của các dataItem trong list đang so sánh (khác với item đang kéo)
        const coordinates = [
          { x: dataItem.coordinate.x, y: dataItem.coordinate.y }, // index 0 là x, y
          { x: dataItem.coordinate.x2, y: dataItem.coordinate.y2 }, // index 1 là x2, y2
          { x: dataItem.coordinate.x3, y: dataItem.coordinate.y3 }, // index 2 là x3, y3
          { x: dataItem.coordinate.x4, y: dataItem.coordinate.y4 }, // index 3 là x4, y4
          { x: dataItem.coordinate.x5, y: dataItem.coordinate.y5 }, // index 4 là x5, y5
        ];

        // Gộp các tọa độ của item đang kéo
        const draggingCoordinates = [
          { x: newCoordinateDragging.x, y: newCoordinateDragging.y },
          { x: newCoordinateDragging.x2, y: newCoordinateDragging.y2 },
          { x: newCoordinateDragging.x3, y: newCoordinateDragging.y3 },
          { x: newCoordinateDragging.x4, y: newCoordinateDragging.y4 },
          { x: newCoordinateDragging.x5, y: newCoordinateDragging.y5 },
        ];

        // Check xem vị trí item trong danh sách để kiểm tra vị trí
        draggingCoordinates.forEach(
          //Duyệt qua tất cả các tọa độ của item đang kéo
          ({ x: draggingX, y: draggingY }, dragIndex) => {
            //Duyệt qua tọa độ item trong listItem đang được so sánh, nhớ là khác với item đang kéo, đã check bên trên r
            coordinates.forEach(({ x, y }, index) => {
              if (draggingX >= x - TOLERANCE && draggingX <= x + TOLERANCE) {
                //Check thấy vị trí đg kéo trùng theo X
                isChangeLine = true;
                // Khoảng cách giữa 2 tọa độ trên trục Y
                const distanceY = calculateDistanceByCoordinate({
                  x1: draggingX,
                  y1: draggingY,
                  x2: x,
                  y2: y,
                });

                /**
                  (*)Quy luật tìm hướng đường thẳng:
                  x trùng lặp thì kq  chỉ có thể là top hoặc bot 
                  => dragY-y > 0 là top(đẩy theo hướng top), và ngược lại <0 là bot
                 */
                const direction = draggingY - y > 0 ? "top" : "bottom";

                if (
                  lines[dragIndex][direction] === 0 ||
                  lines[dragIndex][direction] > distanceY
                ) {
                  //DragIndex lần lượt chạy theo thứ tự top, right, bottom, left, center, tương ứng: 0,1,2,3,4
                  //Chỉ lấy khoảng cách có độ dài nhỏ nhất vì tọa đồ trùng nhau rất nhiều, nếu ko sẽ vẽ luôn nét đứt lên viền của item
                  lines[dragIndex][direction] = distanceY;
                }
              }

              //Kiểm tra y của item đang kéo có thuộc khoảng tọa độ trùng nhau của item khác không
              if (draggingY >= y - TOLERANCE && draggingY <= y + TOLERANCE) {
                //Check thấy vị trí đg kéo trùng theo Y
                isChangeLine = true;

                const distanceX = calculateDistanceByCoordinate({
                  x1: draggingX,
                  y1: draggingY,
                  x2: x,
                  y2: y,
                });

                /**
                 (*) Quy luật tìm hướng khi X trùng nhau:
                 y trùng lặp chỉ có thể là left hoặc right
                 => dragX-x >0 là left, ngược lại là right   
                 */
                const direction = draggingX - x > 0 ? "left" : "right";

                if (
                  lines[dragIndex][direction] === 0 ||
                  lines[dragIndex][direction] > distanceX
                ) {
                  //Chỉ lấy khoảng cách có độ dài nhỏ nhất vì tọa đồ trùng nhau rất nhiều, nếu ko sẽ vẽ luôn nét đứt lên viền của item
                  lines[dragIndex][direction] = distanceX;
                }
              }
            });
          }
        );
        //Nếu có sự thay đổi về lines thì cập nhật lại biến changeLine
        setSizeLines((prev) => ({
          ...prev,
          idItemDragging: idDragging,
          lines,
        }));
      }
    });
  }
  function handleDragStart(event) {
    console.log("Bắt đầu kéo::: ", event);
  }

  function handleDragEnd(event) {
    const { active, delta } = event;

    const dataComponentDragging = active.data.current;
    const currentComponentDom = dataComponentDragging.componentRef.current;

    // Lấy ra kích thước item hiện tại để tính tọa độ
    const { width, height } = currentComponentDom.getBoundingClientRect();

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
              sizeLines={sizeLines}
              childId={childData.id}
              dataIndex={index}
              dataItem={{ ...childData, dataIndex: index }}
              key={childData.id}
              axis={axis}
              label={label}
              handle={handle}
              top={childData.coordinate.y}
              left={childData.coordinate.x}
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
      style={{ ...style, top, left }}
      buttonStyle={buttonStyle}
      transform={transform}
      axis={axis}
      childElement={childElement}
      {...attributes}
    />
  );
};
