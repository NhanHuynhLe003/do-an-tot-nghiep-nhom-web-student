import { Stack } from "@mui/material";
import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";

import Draggable from "../../../components/IDraggables/IDraggable";
import Droppable from "../../../components/IDraggables/IDroppable";

export default function AdminCvManagePage() {
  const [isDropped, setIsDropped] = useState(false);
  const draggableMarkup = <Draggable>Drag me</Draggable>;

  function handleDragEnd(event) {
    if (event.over && event.over.id === "droppable") {
      setIsDropped(true);
    }
  }
  return (
    <Stack
      direction={"column"}
      width={"95%"}
      minHeight={"80vh"}
      borderRadius={"2rem"}
      margin={"1rem auto"}
      bgcolor={"#fff"}
    >
      <DndContext onDragEnd={handleDragEnd}>
        {!isDropped ? draggableMarkup : null}
        <br />
        <br />
        <br />
        <Droppable>{isDropped ? draggableMarkup : "Drop here"}</Droppable>
      </DndContext>
    </Stack>
  );
}
