import { Stack } from "@mui/material";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import React, { useEffect } from "react";
import { ToolTipTaps } from "./IMenuBarTipTap";
import "./ITipTapEditor.css";
import { useDispatch, useSelector } from "react-redux";
import CvSlice from "../../redux/slices/CvSlice";

// define your extension array
const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
];

export default function ITipTapEditor({
  id = 1,
  content = "Nhập nội dung vào đây",
  tools = [
    ToolTipTaps.COLOR,
    ToolTipTaps.BOLD,
    ToolTipTaps.ITALIC,
    ToolTipTaps.UNDO,
    ToolTipTaps.REDO,
  ],
}) {
  //Truyen data len thanh toolbar tren header
  const dispatch = useDispatch();

  const [showToolBar, setShowToolBar] = React.useState(false);
  const editorTipTap = useEditor({
    content: content,
    extensions: extensions, //nếu dùng [StarterKit.configure()] - this is the default extension
    onUpdate: ({ editor }) => {
      const htmlConvertText = editor.getHTML();
    },
    onFocus: ({ editor }) => {
      /*(*) Quan trọng nhất vì khi focus vào component mới thì editor sẽ được truyền lên header
      , sau khi header nhận được editor sẽ tiến hành khởi tạo ra 1 component IMenuBar mới, đồng
      thời editor này cũng được truyền cho component ITipTapEditor bên dưới nên IMenuBar với
      ITipTapEditor mới có thể kết nối được.
      
      (*)Lưu ý: trong TipTap không có 1 controller quản lý nhiều form mà chỉ có theo quy tắc 1-1,
      có thể khi ITipTapEditor và IMenuBar kết nối thì useEditor thiết lập 2 component này chung ID,
      nên cả 2 mới connect với nhau được. 
      */
      dispatch(CvSlice.actions.setEditorContent(editorTipTap));
      dispatch(CvSlice.actions.setIdEditor(id));

      setShowToolBar(true);
    },
    onTransaction: ({ editor, transaction }) => {
      dispatch(CvSlice.actions.setTextEditorChange(editor.getHTML()));
    },

    onSelectionUpdate: ({ editor }) => {
      const state = editor.state;
      const selection = state.selection;
      const from = selection.from;
      const to = selection.to;
      dispatch(CvSlice.actions.setPositionPointer({ from, to }));
    },
  });

  useEffect(() => {
    //Truyền editor lên menu lần đầu tiên
    if (editorTipTap) {
      dispatch(CvSlice.actions.setEditorContent(editorTipTap));
      dispatch(CvSlice.actions.setIdEditor(id));
    }
  }, [editorTipTap]);

  if (!editorTipTap) {
    return null;
  }
  // dispatch(CvSlice.actions.setEditorContent(editor));
  return (
    // Ý tưởng: Dùng thẳng luôn nhưng dùng bảng nào thì header render ra toolbar bảng đó riêng
    // Dùng onFocus để lắng nghe đang chọn bảng nào, tốt nhất mỗi bảng nên có id
    //id content trùng với id toolbar thì hiển thị toolbar còn ko thì thôi
    <Stack
      className="ITipTapEditor___CustomEditorWrapper"
      direction={"column"}
      height={"100%"}
      width={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {/* {showToolBar && <IMenuBarTipTap editor={editor} tools={tools} />} */}
      <EditorContent
        className="ITipTapEditor___EditorContentWrapper"
        editor={editorTipTap}
      />
    </Stack>
  );
}

//====================================================
