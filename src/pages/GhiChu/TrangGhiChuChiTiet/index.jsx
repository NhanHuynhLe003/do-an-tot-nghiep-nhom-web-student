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
import { useTaoNoteGoc } from "../../../hooks/apis/notes/useTaoNoteGoc";
import { useTaoNoteCon } from "../../../hooks/apis/notes/useTaoNoteCon";
import { toast } from "react-toastify";

export default function TrangGhiChuChiTiet() {
  const studentData = JSON.parse(localStorage.getItem("studentData"));

  const [html, setHTML] = useState("");
  const [tieude, setTieuDe] = useState("");

  const { mutate: taoNoteGoc, data: dulieuNoteGoc } = useTaoNoteGoc();
  const { mutate: taoNoteCon } = useTaoNoteCon();

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

    //lấy ra tất các cloze
    const listCloze = html.match(regex);

    console.log("MATCHES:::", matches);

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

    console.log("VERSIONS:::", versions); //versions là chứa các cloze lần lượt ... vd, ABCD12345 => [(...)12345 , ABCD(...)45, ABCD12(...)]

    // Ẩn Toàn Bộ
    // versions.push(allClozeHtml);

    return {
      listNoteCloze: versions,
      clozes: listCloze,
    };
  };

  async function handleSave() {
    if (!tieude) {
      // neu tieu de khong ton tai
      toast.error("Vui lòng nhập tiêu đề", {
        position: "top-center",
      });

      return; //return để không chạy xuống các đoạn code bên dưới
    }

    // Chuyển đổi các nội dung BlockNote thành mảng chứa các đoạn cloze, result la obj tra ve
    const result = replaceString(html);

    const clozes = result.clozes;

    const listNoteCloze = result.listNoteCloze;

    console.log("CLONE CLOZES:::", clozes);
    console.log("LIST NOTE CLOZE:::", listNoteCloze);

    /**
     "note_userId": "667f828ffcfca52f68326155",
    "note_title": "Title Text 1",
    "note_content": "Xin Chao 123 [1]ABCD, [2]4567 [3]789",
    "note_cloze": "Xin Chao 123 [1]ABCD, [2]4567 [3]789",
    "clozes": ["ABCD", "4567", "789"]
     */

    const payloadNoteGoc = {
      note_userId: studentData._id, //id cua nguoi dung
      note_title: tieude, // tieu de
      note_content: html, // noi dung
      note_cloze: html, //note cloze và note content đang là tạo note gốc nên sẽ không ẩn(cloze)
      clozes: clozes, // mảng chứa nội dung ẩn
    };

    //Tao Note Goc
    taoNoteGoc(payloadNoteGoc, {
      //sau khi đã đẩy note gốc lên server thành công dữ liệu sẽ hiển thị trong onSuccess
      onSuccess: (data, variables, context) => {
        // data là dữ liệu của noteGoc trả về sau khi upload thành công

        // sau khi tạo note cha thành công thì tra ve _id cua note cha, sử dụng để gán vào cho các parentId
        //Note con
        for (let i = 0; i < listNoteCloze.length; i++) {
          //lọc qua từng note_cloze dạng (...) lần lượt , nó ko ẩn hết chỉ ẩn lần lượt
          const note_cloze = listNoteCloze[i];

          //Dữ liệu để đẩy lên server
          const payload = {
            note_userId: studentData._id,
            note_title: tieude,
            note_content: html,
            note_cloze: note_cloze,
            clozes: clozes,
            note_parentId: data?.metadata?._id, // lấy thông qua _id từ note cha
          };

          //Tạo Note Con
          taoNoteCon(payload); // đẩy dữ liệu note con lần lượt lên server.
        }
      },
    });

    console.log("Dữ liệu ghi chú gốc:::", dulieuNoteGoc?.metadata?._id);

    toast.success("Tạo ghi chú thành công", {
      position: "top-center",
    });
  }

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
