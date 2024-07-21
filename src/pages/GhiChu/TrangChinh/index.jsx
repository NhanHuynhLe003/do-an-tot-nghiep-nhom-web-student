import { rectSortingStrategy } from "@dnd-kit/sortable";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./TrangChinh.module.css";
import { GridContainer } from "./components/Grid/GridContainer";
import { Sortable } from "./components/Sortable";

export default function TrangChinh() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "NOTE 1",
      content: "Chưa Có Nội Dung",
    },
    {
      id: 2,
      title: "NOTE 2",
      content: "Chưa Có Nội Dung",
    },
    {
      id: 3,
      title: "NOTE 3",
      content: "Chưa Có Nội Dung",
    },
  ]);

  const handleAddNote = (e) => {
    e.preventDefault();
    const newNote = {
      id: notes.length + 1,
      title: `NOTE ${notes.length + 1}`,
      content: "Chưa Có Nội Dung",
    };
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };
  const handleImageClick = () => {
    navigate("/trang-chinh/thung-rac"); // Navigate to the TrangRecycleBin page
  };
  return (
    <div>
      <form className={style["note-form"]} onSubmit={handleAddNote}>
        <button type="submit" className={style.saveButton}> LƯU</button>
      </form>
      <div className={style['app-container']}>
        <div className={style["note-grid"]}>
          {notes.map((note) => (
            <div key={note.id} className={style["note-item"]}>
              <div className={style["notes-header"]}>
                <button onClick={() => handleDeleteNote(note.id)} className={style.saveButton}>x</button>
              </div>
              <h2>{note.title}</h2>
              <p>{note.content}</p>
            </div>
          ))}
        </div>
        <br />
        {/* <Sortable
          items={notes}
          adjustScale={true}
          Container={(props) => <GridContainer {...props} columns={5} />}
          strategy={rectSortingStrategy}
          wrapperStyle={() => ({
            width: 140,
            height: 140,
          })}
        ></Sortable> */}
        
        <div className={style.deleteicon}>
          <img
            src="https://png.pngtree.com/png-vector/20220826/ourlarge/pngtree-trashcan-dustbin-flat-junk-vector-png-image_33478412.png"
            alt="anhdetele"
            onClick={handleImageClick}
          />


        </div>
        
      </div>
    </div>
  );
}
