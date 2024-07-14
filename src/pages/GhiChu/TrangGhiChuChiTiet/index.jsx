import React, { useEffect, useState, useCallback, ChangeEvent, useRef } from "react";
import style from "./TrangGhiChuChiTiet.module.css";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";



export default function TrangGhiChuChiTiet() {
  const [html, setHTML] = useState("");
  const [textHiddenConvert, setTextHiddenConvert] = useState("")
  const [hideCount, setHideCount] = useState(0);
  const [previousContents, setPreviousContents] = useState([]);
  const editor = useCreateBlockNote();
  const initialHTML = "";


  const transformData = (data) => {
    const regex = /\[\d\]\(\d+\)/g;
    const result = data.replace(regex, (match) => {
      return match.replace(/\(\d+\)/, '(.....)');
    });
    return result
  };
  useEffect(() => {
    // Log nội dung HTML để kiểm tra khi "html" thay đổi
    console.log("HTML:::", transformData(" " + html));

  }, [html]);

  const onChange = async () => {
    // Chuyển đổi nội dung BlockNote thành chuỗi HTML
    const htmlString = await editor.blocksToHTMLLossy(editor.document);
    setHTML(htmlString);
  };

  function handleSave() {
    console.log("SAVE:::", textHiddenConvert)
  }

  const inputRef = useRef(null);

  const handleSelection = () => {
   
      const startSelection = inputRef.current.selectionStart;
      const endSelection = inputRef.current.selectionEnd
      console.log({
        startSelection,
        endSelection
      })
    
  };

  const onHide = async () => {
    handleSelection();

    const cursorPosition = editor.getTextCursorPosition();
    console.log("Cursor Position:::", cursorPosition);

    const { start, end } = cursorPosition;
    console.log("Start", start, "End", end)

    // Chuyển đổi văn bản đã chọn thành "[n]()"
    const selectedText = editor.getSelectedText();
    console.log("selectedText:::", selectedText);

    const transformedText = `[${hideCount + 1}](${selectedText})`;

    const textHiddenTransform = `[${hideCount + 1}](.....)`;
    const transformedHTML = html.replace(selectedText, transformedText);

    const htmlHiddenTextTransform = html.replace(selectedText, textHiddenTransform);

    // Cập nhật trạng thái để lưu trữ nội dung trước đó và nội dung đã chuyển đổi hiện tại
    setPreviousContents(prev => [...prev, html]);
    setHTML(transformedHTML);

    setTextHiddenConvert(htmlHiddenTextTransform)
    setHideCount(count => count + 1);

    // Cập nhật lại nội dung trong editor
    const blocks = await editor.tryParseHTMLToBlocks(transformedHTML);
    editor.replaceBlocks(editor.document, blocks);
  };


  const htmlInputChanged = useCallback(
    async (e) => {
      // Chuyển đổi nội dung HTML hiện tại thành mảng các Block và thay thế nội dung của editor bằng các block này.
      const blocks = await editor.tryParseHTMLToBlocks(e.target.value);
      editor.replaceBlocks(editor.document, blocks);
    },
    [editor]
  );

  // Khởi tạo nội dung ban đầu; khi component mount, chuyển đổi HTML ban đầu thành các block và thay thế nội dung mặc định của editor
  useEffect(() => {
    async function loadInitialHTML() {
      const blocks = await editor.tryParseHTMLToBlocks(initialHTML);
      editor.replaceBlocks(editor.document, blocks);
    }
    loadInitialHTML();
  }, [editor]);

  return (
    <div className={style.GhiChuChiTiet}>
      <button className={style.Button} onClick={onHide}>Ẩn</button>
      <input type="text" placeholder="Nhập tiêu đề" className={style.header} />
      <div>
        {/* onChange lắng nghe sự kiện khi nội dung thay đổi */}
        <BlockNoteView
          ref={inputRef}
          editor={editor}
          className={"TrangGhiChuChiTiet___BlockNoteView"}
          onChange={onChange}
        />
      </div>
      <button className={style.ButtonLuu} onClick={handleSave}>Lưu</button>
    </div>
  );
}
