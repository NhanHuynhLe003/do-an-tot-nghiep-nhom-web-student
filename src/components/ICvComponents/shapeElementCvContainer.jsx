import { Box, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { sizeEditorDefault, sizeShapeElementDefault } from "../../constants";
import { currentBoardInViewSelector } from "../../redux/selector";
import { v4 as uuidv4 } from "uuid";
import CvSlice from "../../redux/slices/CvSlice";
import IShapeElement from "../IShapeElement";
import { useParams } from "react-router-dom";
const TRANSLATE_NUM = 0.5;
const initCoordinate = 500;
const listShapeElement = [
  {
    id: "SHAPE001",
    title: "Circle",
    srcSvg: "/svgs/shapeElements/circle-svgrepo-com.svg",
    styleValue: {
      width: "80px",
      height: "80px",
      fill: "var(--color-primary1)",
      cursor: "pointer",
    },
  },
  {
    id: "SHAPE002",
    title: "Rectangle",
    srcSvg: "/svgs/shapeElements/rectangle-svgrepo-com.svg",
    styleValue: {
      width: "120px",
      height: "80px",
      fill: "var(--color-primary1)",
      cursor: "pointer",
    },
  },
  {
    id: "SHAPE003",
    title: "CircleFrame",
    srcSvg: "/svgs/shapeElements/circle-frame.svg",
    styleValue: {
      width: "100px",
      height: "100px",
      fill: "var(--color-primary1)",
      cursor: "pointer",
    },
  },
];
export default function ShapeElementCvContainer() {
  //Lấy id của trang hiện tại tu url
  const { id: idCurrentPageCv } = useParams();
  const dispatch = useDispatch();
  //Vị trí hiện tại của Board, dựa trên thanh scroll
  const currentBoardSelectorInView = useSelector(currentBoardInViewSelector);
  function handleClickAddShapeElement({ title, srcSvg, styleValue }) {
    const cvId = idCurrentPageCv;
    const idItemDrag = uuidv4();
    const boardId = currentBoardSelectorInView.id;

    const dataItem = {
      boardId: boardId,
      id: idItemDrag,
      role: "ALL", //["ONLY_READ", "ONLY_WRITE", "ALL"]
      itemType: "shape",

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
      sizeItem: sizeShapeElementDefault,
      rotateDeg: 0,
      color: "#5496FA",

      layer: 1,
      ChildComponentProps: {
        id: idItemDrag,
        title,
        srcSvg,
        styleValue,
      },
    };

    dispatch(
      CvSlice.actions.setAddDragItemIntoBoard({
        cvId,
        boardId,
        dataItem,
      })
    );
  }

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      flexWrap={"wrap"}
      width={"100%"}
      sx={{
        height: "15rem",
        mt: 4,
      }}
    >
      {listShapeElement ? (
        listShapeElement.map((shapeElement) => (
          <Box
            sx={{
              width: "fit-content",
              height: "fit-content",
            }}
            onClick={() =>
              handleClickAddShapeElement({
                id: shapeElement.id,
                title: shapeElement.title,
                srcSvg: shapeElement.srcSvg,
                styleValue: shapeElement.styleValue,
              })
            }
          >
            <IShapeElement
              id={shapeElement.id}
              title={shapeElement.title}
              key={shapeElement.id}
              srcSvg={shapeElement.srcSvg}
              styleValue={shapeElement.styleValue}
            ></IShapeElement>
          </Box>
        ))
      ) : (
        <div>Loading . . .</div>
      )}
    </Stack>
  );
}
