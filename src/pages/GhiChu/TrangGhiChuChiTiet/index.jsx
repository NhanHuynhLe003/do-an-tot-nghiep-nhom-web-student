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
import React, { useState } from "react";
import style from "./TrangGhiChuChiTiet.module.css";

import { toast } from "react-toastify";
import { useTaoNoteGoc } from "../../../hooks/apis/notes/useTaoNoteGoc";
import { ClozeButton } from "./components/ClozeButton";
import { useNavigate } from "react-router-dom";


export default function TrangGhiChuChiTiet() {
  const navigate = useNavigate();

  const studentData = JSON.parse(localStorage.getItem("studentData"));
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


  const [tieude, setTieuDe] = useState("");
  const { mutate: taoNoteGoc, data: dulieuNoteGoc } = useTaoNoteGoc();

  const layTitle = (title) => {
    setTieuDe(title);
  };


  const onChange = async () => {
    // Chuyển đổi nội dung BlockNote thành chuỗi HTML
    const htmlString = await editor.blocksToHTMLLossy(editor.document);
    setHTML(htmlString);
  };

  const replaceHtml = (html) => {
    // Điều kiện lọc, lấy ra các highlight
    const regex =
      /<span data-text-color="black"><span data-background-color="yellow">(.*?)<\/span><\/span>/g;

    // Lấy tất cả nội dung của regex
    let matches = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      matches.push(match);
    }

    // Lấy danh sách kết quả => vd: [ABC]D12[34]5 => [ABC, 34]
    const danhSachKetQua = matches.map((match) => match[1]);

    console.log("Matches:::", matches);


    const htmlReplace = html.replace(
      regex,
      (match, text) =>
        `<input class="nhap-noi-dung" style="width:${
          text.length * 9
        }px; padding:0; outline: none; border-top:none;border-left:none;border-right:none; border-bottom: 1px dotted #000; "/>`
    );

    return {
      htmlReplace: htmlReplace,
      listKetQua: danhSachKetQua,
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

    const result = replaceHtml(html);

    const htmlDaThayThe = result.htmlReplace;
    const danhSachKetQua = result.listKetQua;


    const payloadNoteGoc = {
      note_userId: studentData._id, //id cua nguoi dung
      note_title: tieude, // tieu de
      note_content: html, // noi dung
      note_cloze: htmlDaThayThe, //note cloze: chứa nội dung đã thay thế bằng ô input để nhập kết quả
      clozes: danhSachKetQua, // mảng chứa nội dung ẩn
    };

    taoNoteGoc(payloadNoteGoc, {

      onSuccess: async () => {
        toast.success("Tạo ghi chú thành công", {
          position: "top-center",
        });
        // Điều hướng về trang chính

        // ĐỢi 2s rồi mới chuyển trang
        await new Promise((resolve) => setTimeout(resolve, 2000));
        window.location.href = "/trang-chinh";
      },
      onError: (error) => {
        toast.error("Tạo ghi chú thất bại", {
          position: "top-center",
        });
      },

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

          data-theming-ghi-chu-chi-tiet
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
