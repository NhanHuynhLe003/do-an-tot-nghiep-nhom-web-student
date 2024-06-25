import React, { useState } from "react";
import style from "./TrangChinh.module.css";

export default function TrangChinh() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Note 1",
      content: "Nội dung của Note 1",
    },
    {
      id: 2,
      title: "Note 2",
      content: "Nội dung của Note 2",
    },
    {
      id: 3,
      title: "Note 3",
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
    setNotes(notes.filter(note => note.id !== id));
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
        <button type="submit" className={style["saveButton"]}>LƯU</button>
      </form>
      <div className={style["note-grid"]}>
        {notes.map((note) => (
          <div key={note.id} className={style["note-item"]}>
            <div className={style["notes-header"]}>
              <button onClick={() => handleDeleteNote(note.id)}>x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
