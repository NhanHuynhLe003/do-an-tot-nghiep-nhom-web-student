/**
 * Selector dùng quản lý dữ liệu trả về từ root reducer
 */

import { createSelector } from "@reduxjs/toolkit";

const cvEditorContentSelector = (state) => state.cvs.editorContent;
const cvIdEditorSelector = (state) => state.cvs.idEditor;
// const cvStateChangeSelector = (state) => state.cvs.stateChange;
const cvTextSelector = (state) => state.cvs.textEditor;
const positionPointerSelector = (state) => state.cvs.coordPointer;
const sizeEditorSelector = (state) => state.cvs.sizeEditor;
const sizeAndDegItemDraggableSelector = (state) =>
  state.cvs.itemDraggableSizeAndDeg;
//Combine với các selector khác(nếu có)
const remainingSelector = createSelector(
  cvEditorContentSelector,
  (cvs) => cvs.editorContent
);

const clickOutsideDragItemSelector = (state) => state.cvs.isClickOutside;

const cvZoomScaleSelector = (state) => state.cvs.control.zoomScale;

const itemsSelectorDragSelect = (state) => state.cvs.itemsDragSelect;

const listCvUserSelector = (state) => state.cvs.listCvUser;

const currentBoardInViewSelector = (state) => state.cvs.currentBoardInView;

const stateCvHistorySelector = (state) => state.cvs.history;

const listIdItemResizingOrRotatingSelector = (state) =>
  state.cvs.listIdItemResizingOrRotating;

//===========================COMMON SELECTOR===========================
const commonGetScrollProperty = (state) => state.common.scrollProperty;

export {
  listIdItemResizingOrRotatingSelector,
  stateCvHistorySelector,
  currentBoardInViewSelector,
  listCvUserSelector,
  itemsSelectorDragSelect,
  clickOutsideDragItemSelector,
  cvTextSelector,
  cvZoomScaleSelector,
  sizeAndDegItemDraggableSelector,
  cvEditorContentSelector,
  cvIdEditorSelector,
  positionPointerSelector,
  sizeEditorSelector,
  remainingSelector,

  //COMMON SELECTOR
  commonGetScrollProperty,
};
