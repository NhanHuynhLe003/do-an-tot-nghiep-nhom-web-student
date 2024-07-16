import React, { useState } from "react";
import style from "./TrangChinh.module.css";
import AppKeoTha from "./components/AppKeoTha";
import { Sortable } from "./components/Sortable";
import { GridContainer } from "./components/Grid/GridContainer";
import { rectSortingStrategy } from "@dnd-kit/sortable";
import { RiDeleteBin5Fill } from "react-icons/ri";

export default function TrangChinh() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      content: "Nội dung của Note 1",
    },
    {
      id: 2,
      content: "Nội dung của Note 2",
    },
    {
      id: 3,
      content: "Nội dung của Note 3",
    },
  ]);

  const handleAddNote = (e) => {
    e.preventDefault();
    const newNote = {
      id: notes.length + 1,
      content: "Nội dung mới",
    };
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
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
              <p>{note.content}</p>
            </div>
          ))}
        </div>
        <br />
        <Sortable
          items={notes}
          adjustScale={true}
          Container={(props) => <GridContainer {...props} columns={5} />}
          strategy={rectSortingStrategy}
          wrapperStyle={() => ({
            width: 140,
            height: 140,
          })}
        ></Sortable>
        <div className={style.deleteicon}>
          <img src="https://png.pngtree.com/png-vector/20220826/ourlarge/pngtree-trashcan-dustbin-flat-junk-vector-png-image_33478412.png" alt="anhdetele" />
        </div>
      </div>
    </div>
  );
}
