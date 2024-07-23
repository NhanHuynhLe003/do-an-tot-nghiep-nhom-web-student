////////////////////ANHKHOA//////////////////////////
import React, { useEffect, useRef, useState } from "react";
import { useGetNhungNoteHomNay } from "../../../hooks/apis/notes/useGetNhungNoteHomNay.js";
import { useGetNoteChinhCuaUser } from "../../../hooks/apis/notes/useGetNoteChinhCuaUser.js";
import style from "./TrangOnTapChiTiet.module.css";
import { toast } from "react-toastify";
import { useUpdateNoteLevel } from "../../../hooks/apis/notes/useUpdateNoteLevel.js";
import { Typography } from "@mui/material";
import { formatDate } from "date-fns";

export default function TrangOnTapChiTiet() {
  // const editor = useCreateBlockNote();
  const studentData = JSON.parse(localStorage.getItem("studentData"));
  const [noteList, setNoteList] = useState([]);

  // Thẻ cha chứa bảng
  const bangRef = useRef(null);

  //Danh sach note goc
  const [notes, setNotes] = useState([]); // Danh sách ghi chú

  ///ĐÃ SỮA
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0); // Chỉ số của ghi chú hiện tại
  const [page, setPage] = useState(1);
  const [limitNote, setLimitNote] = useState(20); // số note giới hạn lấy về, có thể thêm nút xem thêm ở phía cuối sau đó tăng giới hạn này lên để lấy thêm nhiều note nữa bên dưới
  const [noteParentIdChild, setNoteParentIdChild] = useState(null); // id của note cha, dùng để lấy note con

  const [noteHienTaiDangChon, setNoteHienTaiDangChon] = useState({});
  const [shButtun, setButtun] = useState(false);
  const [currentHtml, setCurrentHtml] = useState();

  // const {
  //   data: danhSachNoteChinh, //du lieu server tra ve sau khi lay data thong qua api
  // } = useGetNoteChinhCuaUser({
  //   note_userId: studentData._id, // user cua id dang nhap hien tai
  //   skip: 0,
  //   limit: limitNote,
  // });

  const { mutate: updateLevelNote } = useUpdateNoteLevel();

  // Lấy các note chính tại thời điểm đó
  const {
    data: dataNotesServerTraVe, //du lieu server tra ve sau khi lay data thong qua api
  } = useGetNhungNoteHomNay({
    note_userId: studentData._id, // user cua id dang nhap hien tai
    limit: limitNote,
  });

  useEffect(() => {
    // Kiểm tra dữ liệu có tồn tại không

    console.log("dataNotesServerTraVe:::", dataNotesServerTraVe);

    if (
      dataNotesServerTraVe &&
      dataNotesServerTraVe.data &&
      dataNotesServerTraVe.data.metadata
    ) {
      const danhSachDuLieuMoi = dataNotesServerTraVe.data.metadata;

      setNoteList(danhSachDuLieuMoi);
    }
  }, [dataNotesServerTraVe]);

  useEffect(() => {
    if (noteList) {
      //Nếu dữ liệu đã có mới chạy vào hàm này
      const danhSachDuLieuMoi = [...noteList];
      console.log("danhSachDuLieuMoi:::[123]:::", danhSachDuLieuMoi);
      const chuyenDoiDeHienThiNoteChinh =
        danhSachDuLieuMoi &&
        danhSachDuLieuMoi.map((note) => {
          return {
            id: note._id,
            level: note.note_level,
            tieude: note.note_title,
            nd: note.note_content,
            nd_cloze: note.note_cloze,
            list_cloze: note.clozes,
            ngay: note.createdOn,
          };
        });

      console.log(
        "chuyenDoiDeHienThiNoteChinh:::",
        chuyenDoiDeHienThiNoteChinh
      );

      // set nội dung cho note đầu tiên khi vừa vào
      setNoteHienTaiDangChon(chuyenDoiDeHienThiNoteChinh[0]);
      setNotes(chuyenDoiDeHienThiNoteChinh);
    }
  }, [noteList]);

  useEffect(() => {
    // Khởi tạo Note khi vừa vào lần đầu tiên
    async function loadInitialHTML() {
      // Lấy ra nội dung đục lỗ
      const noteCloze = noteList[0]?.note_cloze;
      if (noteCloze) {
        //Chuyển đổi string dạng html sang block note
        setCurrentHtml(noteCloze);
        // const blocks = await editor.tryParseHTMLToBlocks(noteCloze);
        // editor.replaceBlocks(editor.document, blocks);
      }
    }
    loadInitialHTML();
  }, [currentNoteIndex, noteList]); //Use Effect sẽ chạy lại mỗi khi 1 trong 3 giá trị này có sự thay đổi

  async function xuLyNhanNutChonNoteChinh(note) {
    console.log("NOTE DANG CHON:::", note);

    //Reset Hiển thị nút xác nhân
    setButtun(false);

    // là khi nhấn vào note chính sẽ lưu dữ liệu note chính đang chọn lại vào state
    setNoteHienTaiDangChon(note);

    //Set nội dung có chứa input vào bảng
    setCurrentHtml(note.nd_cloze);
    setNoteParentIdChild(note.id);
  }

  async function handleButtonClick() {
    console.log("Note CLoze List::", noteHienTaiDangChon.list_cloze);

    let kiemTraNoiDung = [];
    bangRef.current
      .querySelectorAll(".nhap-noi-dung")
      .forEach((input, index) => {
        //lặp qua từng input

        // lấy giá trị input
        const noiDungNhap = input.value;

        // so sánh giá trị input với giá trị ẩn tại vị trí đó
        if (noiDungNhap === noteHienTaiDangChon.list_cloze[index]) {
          input.style.borderBottom = "2px dotted green";
          input.style.backgroundColor = "rgba(0, 241, 0, 0.6)";

          // tăng thời gian học trở lại
          kiemTraNoiDung.push(true);
        } else {
          input.style.borderBottom = "2px dotted red";
          input.style.backgroundColor = "rgba(255, 0, 0, 0.6)";

          // yêu cầu nhập lại cho chính xác
          kiemTraNoiDung.push(false);
        }
      });
    // Lấy ra nội dung ko bị ẩn của note
    // setCurrentHtml(noteHienTaiDangChon.nd);
    // setButtun(true);

    if (kiemTraNoiDung.includes(false)) {
      // Chỉ cần có 1 giá tri false thì hiển thị nội dung không chính xác

      toast.error("Chưa chính xác lắm, vui lòng thử lại", {
        position: "top-center",
      });
    } else {
      // Cập nhật level cho note
      updateLevelNote({
        note_id: noteHienTaiDangChon?.id,
        note_userId: studentData?._id,
        note_level: noteHienTaiDangChon?.level + 1,
      });
      toast.success("Chúc mừng bạn đã hoàn thành note", {
        position: "top-center",
      });
    }
  }

  const handleShowMore = () => {
    console.log("Show More", limitNote);
    setLimitNote((prevLimit) => prevLimit + 20);
  };

  /////////////////////////////
  return (
    <div className={style.TrangOnTap} id="TrangOnTapChiTiet">
      <div className={style.documentList}>
        <h5 className={style.tieude}>Documents</h5>

        {/* Danh Sach Note Goc */}
        {notes && notes.length > 0 ? (
          notes.map((note, index) => (
            <div
              key={note.id || index}
              // 19/7: lấy ra note hiện tại đang nhấn
              onClick={() => xuLyNhanNutChonNoteChinh(note)}
              style={{
                backgroundColor:
                  note.id === noteParentIdChild ? "#fff" : "#fff",
              }}
            >
              <div className={style.notecard}>
                <h6 className={style.titlenote}>{note.tieude}</h6>
              </div>
            </div>
          ))
        ) : (
          <Typography
            component={"h1"}
            variant="h6"
            sx={{
              opacity: 0.8,
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Không có note hôm nay
          </Typography>
        )}

        <div className={style.BTHTT}>
          <button onClick={handleShowMore} className={style.ButtonHTgt}>
            Hiển thị Thêm
          </button>
        </div>
      </div>
      <div className={style.OnTapChiTiet}>
        {/* <h2>{selectedNote.tieude}</h2> */}
        <h2>{noteHienTaiDangChon?.tieude}</h2>
        <div className={style.fonderdate}>
          <img
            src="https://tse3.explicit.bing.net/th?id=OIP.SQo02J3N13kPFLekg_E3TAHaHu&pid=Api&P=0&h=180"
            alt="hinh-anh"
            className={style.img}
          />
          <div className={style.dateContainer}>
            <p className={style.h2}>Date</p>
            {/* <span className={style.date}>{selectedNote.ngay}</span> */}
            {/* <span className={style.date}>{noteList[currentNoteIndex] && noteList[currentNoteIndex].createdOn.toString()}</span> */}
            <span className={style.date}>
              {noteHienTaiDangChon?.ngay &&
                formatDate(noteHienTaiDangChon?.ngay, "dd-MM-yyyy")}
            </span>
          </div>
        </div>
        <div className={style.fonderdate}>
          <img
            src="https://tse4.mm.bing.net/th?id=OIP.5DEFJ19gCTvlUyaQ4f70MAHaHa&pid=Api&P=0&h=180"
            alt="hinh-anh"
            className={style.img}
          />
          <div className={style.dateContainer}>
            <p className={style.h2}>Fonder</p>
            <span className={style.date}>Documents</span>
          </div>
        </div>

        {/* Nội dung Của Bảng Hiển Thị */}
        <div className={style.contentEditable}>
          <div
            ref={bangRef}
            dangerouslySetInnerHTML={{ __html: currentHtml }}
          ></div>
        </div>
        {!shButtun && (
          <div className={style.buttonKQ}>
            <button onClick={handleButtonClick} className={style.ButtonHT}>
              Xác Nhận
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
/////////////////////ANHKHOA////////////////////////////
