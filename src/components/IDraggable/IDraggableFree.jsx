import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import React, { useState } from "react";
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

  function handleDragMove(event) {
    const { active } = event;
    // console.log(`[DRAG_MOVING:::${active.id}]`, event);
  }

  function handleDragEnd(event) {
    // console.log("Kết thúc kéo::: ", event);
    const { delta, active } = event;

    setListDataItem((listDataItem) => {
      // Cập nhật vị trí mới của item được kéo
      const newDataListItem = listDataItem.map((data) => {
        //Check xem item đang kéo có phải là active item không
        if (data.id === active.id) {
          const { x, y } = data.coordinate;
          return {
            ...data,
            coordinate: { x: x + delta.x, y: y + delta.y },
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
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      modifiers={modifiers}
    >
      {listDataItem &&
        listDataItem.map((childData, index) => {
          return (
            <IDraggbleItemWrapper
              childId={childData.id}
              key={childData.id}
              axis={axis}
              label={label}
              handle={handle}
              top={childData.coordinate.y}
              left={childData.coordinate.x}
              style={style}
              buttonStyle={buttonStyle}
              childElement={childData.component}
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
  childId, //childId la duy nhat, dung de xac dinh component khi keo tha, nếu ko sẽ kéo thả trùng lặp
  axis,
  label,
  style,
  top,
  left,
  handle,
  childElement,
  buttonStyle,
}) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({
      id: childId, //Id là unique, dùng để xác định component khi kéo thả
    });

  return (
    <IDraggableItem
      ref={setNodeRef}
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
