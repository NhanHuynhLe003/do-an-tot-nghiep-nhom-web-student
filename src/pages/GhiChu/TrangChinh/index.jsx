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
      title: " 1",
      content: "Nội dung của Note 1",
    },
    {
      id: 2,
      title: "2",
      content: "Nội dung của Note 2",
    },
    {
      id: 3,
      title: " 3",
      content: "Nội dung của Note 3",
    },
  ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAddNote = (e) => {
    e.preventDefault();
    const newNote = {
      id: notes.length + 1,
      title: title,
      content: content,
    };
    setNotes([...notes, newNote]);
    setTitle("");
    setContent("");
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  let t = 10

  return (
    <div className={style['app-container']}>
      <form className={style["note-form"]} onSubmit={handleAddNote}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          required
        ></textarea>

        <button type="submit" className={style.saveButton}>
          LƯU
        </button>

      </form>
      <div className={style["note-grid"]}>
        {notes.map((note) => (
          <div key={note.id} className={style["note-item"]}>
            <div className={style["notes-header"]}>
              <button onClick={() => handleDeleteNote(note.id)}className={style.saveButton}>x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
       
       <br/>
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
     <div class={style.deleteicon}>
       <img src="https://png.pngtree.com/png-vector/20220826/ourlarge/pngtree-trashcan-dustbin-flat-junk-vector-png-image_33478412.png" alt="anhdetele" />
     </div>

    </div>
  );
}
