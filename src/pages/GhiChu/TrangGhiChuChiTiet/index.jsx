import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  BasicTextStyleButton,
  BlockTypeSelect,
  ColorStyleButton,
  CreateLinkButton,
  FileCaptionButton,
  FileReplaceButton,
  FormattingToolbar,
  FormattingToolbarController,
  NestBlockButton,
  TextAlignButton,
  UnnestBlockButton,
  useCreateBlockNote,
} from "@blocknote/react";
import React, { useRef, useState } from "react";
import style from "./TrangGhiChuChiTiet.module.css";

import { ClozeButton } from "./components/ClozeButton";

export default function TrangGhiChuChiTiet() {
  const studentData = JSON.parse(localStorage.getItem("studentData"));

  const [html, setHTML] = useState("");
  const [tieude, setTieuDe] = useState("");

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    // Initial content of the editor.
  });

  const layTitle = (title) => {
    setTieuDe(title);
  };

  const onChange = async () => {
    // Chuyển đổi nội dung BlockNote thành chuỗi HTML
    const htmlString = await editor.blocksToHTMLLossy(editor.document);

    setHTML(htmlString);
  };

  const replaceString = (html) => {
    // Điều kiện lọc
    const regex =
      /<span data-text-color="blue"><span data-background-color="blue">(.*?)<\/span><\/span>/g;

    // Tạo mảng lưu trữ các phiên bản
    let versions = [];

    // Lấy tất cả các khớp
    let matches = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      matches.push(match);
    }

    // let i = 1;
    // const noneClozeHtml = html.replace(
    //   regex,
    //   (match, text) => `[${i++}](${text})`
    // );
    // console.log("None Cloze HTML:::", noneClozeHtml);

    // // Tạo phiên bản với tất cả dấu chấm
    // let i2 = 1;
    // const allClozeHtml = html.replace(
    //   regex,
    //   (match, text) =>
    //     `[${i2++}](${text
    //       .split("")
    //       .map(() => ".")
    //       .join("")})`
    // );

    const listCloze = html.match(regex);

    // Tạo các cloze nhỏ hơn
    matches.forEach((m, index) => {
      const clozeHtml = html.replace(regex, (match, text, offset) => {
        if (offset === m.index) {
          return `(${text
            .split("")
            .map(() => ".")
            .join("")})`;
        }
        return match;
      });
      versions.push(clozeHtml);
    });

    // Ẩn Toàn Bộ
    // versions.push(allClozeHtml);

    return {
      listNoteCloze: versions,
      clozes: listCloze,
    };
  };

  async function handleSave() {
    // Chuyển đổi các nội dung BlockNote thành mảng chứa các đoạn cloze
    const result = replaceString(html);

    const clozes = result.clozes;
    const listNoteCloze = result.listNoteCloze;

    /**
     "note_userId": "667f828ffcfca52f68326155",
    "note_title": "Title Text 1",
    "note_content": "Xin Chao 123 [1]ABCD, [2]4567 [3]789",
    "note_cloze": "Xin Chao 123 [1]ABCD, [2]4567 [3]789",
    "clozes": ["ABCD", "4567", "789"]
     */

    for (let i = 0; i < listNoteCloze.length; i++) {
      const note_cloze = listNoteCloze[i];

      //Dữ liệu để đẩy lên server
      const payload = {
        note_userId: studentData._id,
        note_title: tieude,
        note_content: html,
        note_cloze: note_cloze,
        clozes: clozes,
      };
    }
    console.log("Result:::");
  }

  const inputRef = useRef(null);

  const handleSelection = () => {
    const startSelection = inputRef.current.selectionStart;
    const endSelection = inputRef.current.selectionEnd;
    console.log({
      startSelection,
      endSelection,
    });
  };

  return (
    <div className={style.GhiChuChiTiet}>
      <input
        type="text"
        placeholder="Nhập tiêu đề"
        className={style.header}
        onChange={(e) => layTitle(e.target.value)}
      />
      <div className="TrangGhiChuChiTiet___BlockNoteView">
        {/* onChange lắng nghe sự kiện khi nội dung thay đổi */}
        <BlockNoteView
          editor={editor}
          formattingToolbar={false}
          onChange={onChange}
          // editable={false} //Ngăn ko cho sửa nội dung
        >
          <FormattingToolbarController
            formattingToolbar={() => (
              <FormattingToolbar>
                <BlockTypeSelect key={"blockTypeSelect"} />

                {/* Extra button to toggle blue text & background */}
                <ClozeButton key={"customButton"} />

                <FileCaptionButton key={"fileCaptionButton"} />
                <FileReplaceButton key={"replaceFileButton"} />

                <BasicTextStyleButton
                  basicTextStyle={"bold"}
                  key={"boldStyleButton"}
                />
                <BasicTextStyleButton
                  basicTextStyle={"italic"}
                  key={"italicStyleButton"}
                />
                <BasicTextStyleButton
                  basicTextStyle={"underline"}
                  key={"underlineStyleButton"}
                />
                <BasicTextStyleButton
                  basicTextStyle={"strike"}
                  key={"strikeStyleButton"}
                />
                {/* Extra button to toggle code styles */}
                <BasicTextStyleButton
                  key={"codeStyleButton"}
                  basicTextStyle={"code"}
                />

                <TextAlignButton
                  textAlignment={"left"}
                  key={"textAlignLeftButton"}
                />
                <TextAlignButton
                  textAlignment={"center"}
                  key={"textAlignCenterButton"}
                />
                <TextAlignButton
                  textAlignment={"right"}
                  key={"textAlignRightButton"}
                />

                <ColorStyleButton key={"colorStyleButton"} />

                <NestBlockButton key={"nestBlockButton"} />
                <UnnestBlockButton key={"unnestBlockButton"} />

                <CreateLinkButton key={"createLinkButton"} />
              </FormattingToolbar>
            )}
          />
        </BlockNoteView>
      </div>
      <button className={style.ButtonLuu} onClick={handleSave}>
        Lưu
      </button>
    </div>
  );
}
