////////////////////ANHKHOA//////////////////////////
import React, { useState } from "react";
import style from "./TrangOnTapChiTiet.module.css";

const notes = [
  {
    tieude: "Note 1",
    nd: "Khoa Học Giỏi Quá Đi.",
    ngay: "2024-05-15",
  },
  {
    tieude: "Note 2",
    nd: "Khoa Học Giỏi Quá Quá Đi.",
    ngay: "2024-05-14",
  },
  {
    tieude: "Note 3",
    nd: "Khoa Học Giỏi Quá Quá Đi .",
    ngay: "2024-05-24",
  },
  {
    tieude: "Note 4",
    nd: "Khoa Học Giỏi Quá Quá Quá Quá Đi.",
    ngay: "2024-05-12",
  },
  {
    tieude: "Note 1",
    nd: "Khoa Học Giỏi Quá Đi.",
    ngay: "2024-05-15",
  },
  {
    tieude: "Note 2",
    nd: "Khoa Học Giỏi Quá Quá Đi.",
    ngay: "2024-05-14",
  },
  {
    tieude: "Note 3",
    nd: "Khoa Học Giỏi Quá Quá Đi .",
    ngay: "2024-05-24",
  },
  {
    tieude: "Note 4",
    nd: "Khoa Học Giỏi Quá Quá Quá Quá Đi.",
    ngay: "2024-05-12",
  },
  {
    tieude: "Note 1",
    nd: "Khoa Học Giỏi Quá Đi.",
    ngay: "2024-05-15",
  },
  {
    tieude: "Note 2",
    nd: "Khoa Học Giỏi Quá Quá Đi.",
    ngay: "2024-05-14",
  },
  {
    tieude: "Note 3",
    nd: "Khoa Học Giỏi Quá Quá Đi .",
    ngay: "2024-05-24",
  },
  {
    tieude: "Note 4",
    nd: "Khoa Học Giỏi Quá Quá Quá Quá Đi.",
    ngay: "2024-05-12",
  },
];

export default function TrangOnTapChiTiet() {
  const [selectedNote, setSelectedNote] = useState(notes[0]); // Ghi chú mặc định
  const [shButtun, setButtun] = useState(false)
  function handleButtonClick() {
    setButtun(true);
  }
  return (
    <div className={style.TrangOnTap}>
      <div className={style.documentList} >
        <h5 className={style.tieude}>Documents</h5>
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
        <h2>{selectedNote.tieude}</h2>
        <div className={style.fonderdate}>
          <img
            src="https://tse3.explicit.bing.net/th?id=OIP.SQo02J3N13kPFLekg_E3TAHaHu&pid=Api&P=0&h=180"
            alt="hinh-anh"
            className={style.img}
          />
          <div className={style.dateContainer}>
            <p className={style.h2}>Date</p>
            <span className={style.date}>{selectedNote.ngay}</span>
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
        <div className={style.contentEditable} contentEditable="true">
          {selectedNote.nd}
        </div>
        <div className={style.buttonKQ}>
          <button onClick={handleButtonClick} className={style.ButtonHT}>  Hiển Thị Kết Quả </button>
        </div>
        {shButtun && (
          <div className={style.buttonlon}>
            <button className={style.Buttonnho}>1 day</button>
            <button className={style.Buttonnho}>2 days</button>
            <button className={style.Buttonnho}>3 days</button>
            <button className={style.Buttonnho}>4 days</button>
          </div>
        )}
      </div>
    </div>
  );
}
/////////////////////ANHKHOA////////////////////////////
