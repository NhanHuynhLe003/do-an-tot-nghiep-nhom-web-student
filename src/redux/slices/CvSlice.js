import { createSlice } from "@reduxjs/toolkit";
import { set } from "react-hook-form";
import { sizeEditorDefault } from "../../constants";

export default createSlice({
  name: "cvs",
  initialState: {
    editorContent: "",
    id: -1,
    textEditor: "",
    coordPointer: {}, //Tọa độ con trỏ trong Editor
    sizeEditor: sizeEditorDefault,
  },
  reducers: {
    // Truyền editorContent từ header xuống tiptapeditor
    setEditorContent: (state, action) => {
      state.editorContent = action.payload;
    },
    setIdEditor: (state, action) => {
      state.id = action.payload;
    },
    setTextEditorChange: (state, action) => {
      state.textEditor = action.payload;
    },
    setPositionPointer: (state, action) => {
      state.coordPointer = action.payload;
    },
    setSizeEditor: (state, action) => {
      state.sizeEditor = action.payload;
    },
  },
});

//====================================================
