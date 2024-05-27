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

//Combine với các selector khác(nếu có)
const remainingSelector = createSelector(
  cvEditorContentSelector,
  (cvs) => cvs.editorContent
);

export {
  cvTextSelector,
  cvEditorContentSelector,
  cvIdSelector,
  positionPointerSelector,
  sizeEditorSelector,
  remainingSelector,
};
