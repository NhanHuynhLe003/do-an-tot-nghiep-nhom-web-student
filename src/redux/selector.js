/**
 * Selector dùng quản lý dữ liệu trả về từ root reducer
 */

import { createSelector } from "@reduxjs/toolkit";

const cvEditorContentSelector = (state) => state.cvs.editorContent;
const cvIdSelector = (state) => state.cvs.id;
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

export {
  itemsSelectorDragSelect,
  clickOutsideDragItemSelector,
  cvTextSelector,
  cvZoomScaleSelector,
  sizeAndDegItemDraggableSelector,
  cvEditorContentSelector,
  cvIdSelector,
  positionPointerSelector,
  sizeEditorSelector,
  remainingSelector,
};
