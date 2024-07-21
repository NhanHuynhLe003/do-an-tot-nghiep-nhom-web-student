import { Button, debounce } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useGetNoteChinhCuaUser } from "../../../hooks/apis/notes/useGetNoteChinhCuaUser";
import style from "./TrangChinh.module.css";
import { useDeleteNote } from "../../../hooks/apis/notes/useDeleteNote";
import { toast } from "react-toastify";

export default function TrangChinh() {
  const [notes, setNotes] = useState([]);
  const [ndTimKiem, setNdTimKiem] = useState("");
  const studentData = JSON.parse(localStorage.getItem("studentData"));

  const { data: danhSachNoteChinh } = useGetNoteChinhCuaUser({
    note_userId: studentData?._id,
    search: ndTimKiem,
  });

  const { mutate: deleteNote } = useDeleteNote();

  const navigate = useNavigate();

  const handleChangeInput = debounce((e) => {
    setNdTimKiem(e.target.value);
  }, 700);

  const handleAddNote = (e) => {
    navigate("/chi-tiet-ghi-chu");
  };

  const handleDeleteNote = (id) => {
    const payload = {
      noteId: id,
      userId: studentData?._id,
    };
    deleteNote(payload, {
      onSuccess: () => {
        if (notes.length === 1) {
          setNotes([]);
        }
        toast.success("Xóa Note Thành Công");
      },
    });
  };
  const handleImageClick = () => {
    navigate("/trang-chinh/thung-rac"); // Navigate to the TrangRecycleBin page
  };

  useEffect(() => {
    console.log("DATA THAY DOI:::", danhSachNoteChinh);

    const noteData =
      danhSachNoteChinh?.data?.metadata?.data?.map((note) => ({
        id: note._id,
        title: note.note_title,
        content: note.note_content,
      })) || [];

    setNotes(noteData);
  }, [danhSachNoteChinh]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          padding: "1rem 20px",
        }}
      >
        <input
          onChange={handleChangeInput}
          style={{
            width: "15rem",

            padding: "0.5rem 0.75rem",
            borderRadius: "24px",
            border: "1px solid #ccc",
          }}
          placeholder="Tìm kiếm note..."
        ></input>
        <Button type="button" variant="contained" onClick={handleAddNote}>
          <FaPlus />
          Thêm Note
        </Button>
      </div>

      <div className={style["app-container"]}>
        <div className={style["note-grid"]}>
          {notes && notes.length <= 0 ? (
            <div
              style={{
                width: "100%",
              }}
            >
              <h2
                style={{
                  textAlign: "center",
                  color: "#ccc",
                }}
              >
                Chưa có note nào
              </h2>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className={style["note-item"]}>
                <div className={style["notes-header"]}>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className={style.saveButton}
                  >
                    x
                  </button>
                </div>
                <h2>{note.title}</h2>
                <p
                  className={style.noidungNote}
                  dangerouslySetInnerHTML={{ __html: note.content }}
                ></p>
              </div>
            ))
          )}
        </div>
        <br />

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
