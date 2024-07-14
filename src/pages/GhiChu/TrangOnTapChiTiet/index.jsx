////////////////////ANHKHOA//////////////////////////
import React, { useEffect, useState } from "react";
import style from "./TrangOnTapChiTiet.module.css";
import { useGetNhungNoteHomNay } from "../../../hooks/apis/notes/useGetNhungNoteHomNay.js";

const notes = [
  {
    tieude: "Note 1",
    nd: "khoa dep trai qua di.",
    ngay: "2024-05-15",
  },
  {
    tieude: "Note 2",
    nd: "khoa dep trai qua di.",
    ngay: "2024-05-14",
  },
  {
    tieude: "Note 3",
    nd: "khoa dep trai qua di.",
    ngay: "2024-05-24",

  },
  {
    tieude: "Note 4",
    nd: "khoa dep trai qua di.",
    ngay: "2024-05-12",
  },
];

export default function TrangOnTapChiTiet() {
  const studentData = JSON.parse(localStorage.getItem("studentData"));
  const [noteList, setNoteList] = useState([]);
  ///ĐÃ SỮA
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0); // Chỉ số của ghi chú hiện tại
  //////////
  const {
    data: dataNotesServerTraVe, //du lieu server tra ve sau khi lay data thong qua api
    isLoading,
    error
  } = useGetNhungNoteHomNay({
    note_userId: studentData._id, // user cua id dang nhap hien tai
    note_parentId: "668a6b13ddf1507a255c8681", // la id cua note chinh(ko chua cac duc lo)
  })

  useEffect(() => {
    console.log("ID STudent:::", studentData)
    console.log("dataNotesServerTraVe", dataNotesServerTraVe);
    if (dataNotesServerTraVe && dataNotesServerTraVe.data && dataNotesServerTraVe.data.metadata) {
      const danhSachDuLieuMoi = dataNotesServerTraVe.data.metadata
      console.log("danhSachDuLieuMoi", danhSachDuLieuMoi);
      setNoteList(danhSachDuLieuMoi);
    }

  }, [dataNotesServerTraVe])


  const [selectedNote, setSelectedNote] = useState(notes[0]); // Ghi chú mặc định
  const [shButtun, setButtun] = useState(false)
  function handleButtonClick() {
    setButtun(true);
  }
  /////////////mãng +1////////////////////////////////
  function handleNoteChange() {
    setCurrentNoteIndex(prevIndex => (prevIndex + 1) % noteList.length);
    setButtun(false);
  }
  // chỉ hiển thị ngày, xóa data time của sever//////////
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
  //////////////////////////////
  return (
    <div className={style.TrangOnTap}>
      <div className={style.documentList} >
        <h5 className={style.tieude}>Documents</h5>
        {/* Danh Sach Note Goc */}
        {notes.map((note, index) => (
          <div key={index} onClick={() => setSelectedNote(note)}>
            <div className={style.notecard}>
              <h6 className={style.titlenote}>{note.tieude}</h6>
              <span className={style.ndnote}>
                {/* Kiểm tra độ dài của nội dung và cắt bớt nếu cần */}
                {note.nd.length > 30 ? note.nd.slice(0, 30) + "..." : note.nd}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className={style.OnTapChiTiet}>
        {/* <h2>{selectedNote.tieude}</h2> */}
        <h2>{noteList[currentNoteIndex] && noteList[currentNoteIndex].note_title}</h2>
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
            <span className={style.date}>{noteList[currentNoteIndex] && formatDate(noteList[currentNoteIndex].createdOn.toString())}</span>
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
        {/* <div className={style.contentEditable} >
          {selectedNote.nd}
        </div> */}
        <div className={style.contentEditable} >
          <div className={style.contentEditable}>
            {noteList[currentNoteIndex] && !shButtun ? noteList[currentNoteIndex]?.note_cloze : noteList[currentNoteIndex]?.note_content}
          </div>

        </div>
        {!shButtun && (
          <div className={style.buttonKQ}>
            <button onClick={handleButtonClick} className={style.ButtonHT}>  Hiển Thị Kết Quả </button>
          </div>
        )}
        {shButtun && (
          <div className={style.buttonlon}>
            <button className={style.Buttonnho} onClick={handleNoteChange}>1 day</button>
            <button className={style.Buttonnho} onClick={handleNoteChange}>2 days</button>
            <button className={style.Buttonnho} onClick={handleNoteChange}>3 days</button>
            <button className={style.Buttonnho} onClick={handleNoteChange}>4 days</button>
          </div>
        )}
      </div>
    </div>
  );
}
/////////////////////ANHKHOA////////////////////////////
