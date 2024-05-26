import { createSlice } from "@reduxjs/toolkit";

export default createSlice({
  name: "cvs",
  initialState: {
    editorContent: "",
    id: 0,
    textEditor: "",
    coordPointer: {}, //Tọa độ con trỏ trong Editor
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
  },
});

//====================================================
