import { Stack } from "@mui/material";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sizeEditorDefault } from "../../constants";
import { sizeEditorSelector } from "../../redux/selector";
import CvSlice from "../../redux/slices/CvSlice";
import { ToolTipTaps } from "./IMenuBarTipTap";
import "./ITipTapEditor.css";

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
  getHTMLContent = (content) => {
    console.log(content);
  },
  //Size này được truyền từ IWRAPPER VÀO
  size = { ...sizeEditorDefault },
  getSizeEditorWhenChangeContent = (size) => {},
}) {
  //Truyen data len thanh toolbar tren header
  const dispatch = useDispatch();
  const selectorSizeEditor = useSelector(sizeEditorSelector);

  const [showToolBar, setShowToolBar] = React.useState(false);
  const [isChangingContent, setIsChangingContent] = React.useState(false);

  //Lấy ra size khi change editor từ redux

  const editorRef = useRef(null);

  const editorTipTap = useEditor({
    content: content,
    extensions: extensions, //nếu dùng [StarterKit.configure()] - this is the default extension
    //Lắng nghe khi text thay đổi
    onUpdate: ({ editor }) => {
      // const htmlConvertText = editor.getHTML();
      const htmlContent = editor.getHTML();

      setIsChangingContent(true);

      getHTMLContent(htmlContent);
      dispatch(CvSlice.actions.setTextEditorChange(editor.getHTML()));
    },
    onFocus: ({ editor }) => {
      /*(*) Quan trọng nhất vì khi focus vào component mới thì editor sẽ được truyền lên header
      , sau khi header nhận được editor sẽ tiến hành khởi tạo ra 1 component IMenuBar mới, đồng
      thời editor này cũng được truyền cho component ITipTapEditor bên dưới nên IMenuBar với
      ITipTapEditor mới có thể kết nối được. => editor sẽ tự động kết nối IMenuBar khi nhận cùng 1 editor
      
      (*)Lưu ý: trong TipTap không có 1 controller quản lý nhiều form mà chỉ có theo quy tắc 1-1,
      có thể khi ITipTapEditor và IMenuBar kết nối thì useEditor thiết lập 2 component này chung ID,
      nên cả 2 mới connect với nhau được. 
      */

      const widthEditor = editor.view.dom.offsetWidth;
      const heightEditor = editor.view.dom.offsetHeight;

      getSizeEditorWhenChangeContent({
        width: widthEditor,
        height: heightEditor,
      });

      dispatch(CvSlice.actions.setEditorContent(editorTipTap));
      dispatch(CvSlice.actions.setIdEditor(id));

      setShowToolBar(true);
    },

    // Lắng nghe sự kiện khi editor thay đổi(moi thu nhu select, noi dung,...)
    onTransaction: ({ editor, transaction }) => {},

    //Lắng nghe sự kiện khi chuột thay đổi
    onSelectionUpdate: ({ editor }) => {
      const state = editor.state;
      const selection = state.selection;
      // Lấy vị trí con trỏ đang chọn trong input from...to
      const from = selection.from;
      const to = selection.to;
      dispatch(CvSlice.actions.setPositionPointer({ from, to }));
    },

    // Xóa id khi blur ra khỏi editor
    onBlur: ({ editor }) => {
      setIsChangingContent(false);
      const widthEditor = editor.view.dom.offsetWidth;
      const heightEditor = editor.view.dom.offsetHeight;

      getSizeEditorWhenChangeContent({
        width: widthEditor,
        height: heightEditor,
      });
      dispatch(CvSlice.actions.setIdEditor(-1));
    },
  });

  //Update editor thanh công cụ lên header mỗi khi mount
  useEffect(() => {
    dispatch(CvSlice.actions.setEditorContent(editorTipTap));
  }, [editorTipTap]);

  if (!editorTipTap) {
    return null;
  }

  return (
    <Stack
      className="ITipTapEditor___CustomEditorWrapper"
      direction={"column"}
      height={"fit-content"}
      width={"fit-content"}
      sx={{
        // Điều chỉnh kích thước cho component editor bên trong
        "& .ITipTapEditor___EditorContentWrapper .ProseMirror": {
          width: !isChangingContent ? size.width : "auto",
          height: !isChangingContent ? size.height : "auto",
        },
      }}
    >
      <EditorContent
        ref={editorRef}
        className="ITipTapEditor___EditorContentWrapper"
        editor={editorTipTap}
      />
    </Stack>
  );
}

//====================================================
