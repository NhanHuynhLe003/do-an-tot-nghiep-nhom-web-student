import React, { useState } from "react";
import style from "./TrangChinh.module.css";
import { IoAddCircleOutline } from "react-icons/io5";

const initialNotes = [
  {
    tieude: "Note 1",
    nd: "Văn học thành văn chịu ảnh hưởng của văn học dân gian về nhiều phương diện, từ nội dung tư tưởng đến hình thức nghệ thuật. Văn học viết cũng có tác động trở lại đối với văn học dân gian trên một số phương diện. Mối quan hệ giữa văn học dân gian với văn học viết cũng như vai trò, ảnh hưởng của văn học dân gian đối với văn học thể hiện trọn vẹn hơn cả ở lĩnh vực sáng tác và ở bộ phận thơ văn quốc âm.",
  },
  {
    tieude: "Note 2",
    nd: " ",
  },
];

export default function TrangChinh() {
  const [notes, setNotes] = useState(initialNotes);
  const [selectedNote, setSelectedNote] = useState(notes[0]);

  const addNewNote = () => {
    const newNote = {
      tieude: `Note ${notes.length + 1}`,
      nd: "Bạn Chưa Viết Gì!",
    };
    setNotes([...notes, newNote]);
  };

  return (
    <div className={style.TrangChinh}>
      <div className={style.searchBar}>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className={style.searchInput}
        />
        <span className={style.searchIcon}></span>
      </div>
      <div className={style.document}>
        <div className={style.tieudeto}>
          <h3 className={style.tieude}>Ghi Chú Của Bạn</h3>
          <IoAddCircleOutline className={style.img} onClick={addNewNote} />
        </div>
        <br />
        <div className={style.thenote}>
          {notes.map((note, index) => (
            <div key={index} className={style.card}>
              <div className={style.noteIndex}>{index + 1}</div>
              <h2 onClick={() => setSelectedNote(note)}>{note.tieude}</h2>
              <p onClick={() => setSelectedNote(note)}>
                {note.nd.length > 35 ? note.nd.slice(0, 35) + "..." : note.nd}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
