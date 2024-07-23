import { Button, debounce } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useGetNoteChinhCuaUser } from "../../../hooks/apis/notes/useGetNoteChinhCuaUser";
import style from "./TrangChinh.module.css";
import { useDeleteNote } from "../../../hooks/apis/notes/useDeleteNote";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

export default function TrangChinh() {
  const [notes, setNotes] = useState([]);
  const [ndTimKiem, setNdTimKiem] = useState("");
  const studentData = JSON.parse(localStorage.getItem("studentData"));

  // Lấy ra các note chính của user
  const { data: danhSachNoteChinh } = useGetNoteChinhCuaUser({
    note_userId: studentData?._id,
    search: ndTimKiem, // Tìm kiếm theo nội dung note
  });

  const { mutate: deleteNote } = useDeleteNote();

  const navigate = useNavigate();

  // Hàm debounce để giảm số lần gọi API khi người dùng nhập vào ô tìm kiếm
  const handleChangeInput = debounce((e) => {
    setNdTimKiem(e.target.value);
  }, 700); //700ms sau khi người dùng nhập xong thì mới gọi API

  const handleAddNote = (e) => {
    window.location.href = "/chi-tiet-ghi-chu";
  };

  const handleClickNote = (id) => {
    window.location.href = `/chi-tiet-ghi-chu/${id}`;
  };

  const handleDeleteNote = (e, id) => {
    // Ngăn sự kiện nổi bọt
    e.stopPropagation();
    // Dữ liệu đẩy lên server
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
    navigate("/ghi-chu/thung-rac"); // Navigate to the TrangRecycleBin page
  };

  useEffect(() => {
    console.log("DATA THAY DOI:::", danhSachNoteChinh);

    // Chuyển dữ liệu trả về sang định dạng hiển thị của note
    const noteData =
      danhSachNoteChinh?.data?.metadata?.data?.map((note) => ({
        id: note._id,
        title: note.note_title,
        content: note.note_content,
      })) || [];

    // Set nội dung cho note để hiển thị
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
              <div
                key={note.id}
                className={style["note-item"]}
                onClick={() => handleClickNote(note.id)}
              >
                <div className={style["notes-header"]}>
                  <button
                    onClick={(e) => handleDeleteNote(e, note.id)}
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


        <div>
          <FaTrash
            className={style.deleteicon}

            onClick={handleImageClick}
          ></FaTrash>
        </div>
      </div>
    </div>
  );
}
