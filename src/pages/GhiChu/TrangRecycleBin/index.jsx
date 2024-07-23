import React, { useState, useRef, useEffect } from "react";

import styles from "./TrangRecycleBin.module.css";
import {
  useGetNoteDeletedById,
  useGetNoteDeletedByUserId,
} from "../../../hooks/apis/notes/useGetNoteDeletedByUserId";
import { useRestoreNoteById } from "../../../hooks/apis/notes/useRestoreNoteById";
import { useDeleteNoteVinhVien } from "../../../hooks/apis/notes/useDeleteNoteVinhVien";
import { toast } from "react-toastify";
import { Button } from "@mui/material";

export default function Thungrac() {
  const studentData = JSON.parse(localStorage.getItem("studentData"));

  // Danh sách các note đã xóa
  const [listNoteDeleted, setListNoteDeleted] = useState([]);

  const { mutate: restoreNote } = useRestoreNoteById();

  const { data: danhSachNoteDaXoa } = useGetNoteDeletedByUserId({
    userId: studentData?._id,
  });

  const { mutate: deleteNoteVinhVien } = useDeleteNoteVinhVien();

  const [isDeleted, setIsDeleted] = useState([]);
  const [isContentVisible, setIsContentVisible] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const pressTimer = useRef(null);

  useEffect(() => {
    const dataDanhSachNoteXoa = danhSachNoteDaXoa?.data?.metadata;
    if (dataDanhSachNoteXoa) setListNoteDeleted(dataDanhSachNoteXoa);
  }, [danhSachNoteDaXoa]);

  const handleDeleteTatCa = () => {
    const listSuccess = [];
  };

  const handleRestore = () => {
    console.log("IS DELETED:::", selectedNotes);

    const listSuccess = [];

    selectedNotes.forEach((noteIndex) =>
      restoreNote(
        {
          userId: studentData?._id,
          noteId: listNoteDeleted[noteIndex]._id,
        },
        {
          onSuccess: () => {
            listSuccess.push(true);
          },
          onError: () => {
            listSuccess.push(false);
          },
        }
      )
    );

    if (listSuccess.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 ghi chú để khôi phục");
      return;
    }

    if (listSuccess.includes(false)) {
      toast.error("Khôi phục ghi chú thất bại");
      return;
    }

    toast.success("Khôi phục ghi chú thành công");

    setIsDeleted(
      isDeleted.map((deleted, index) =>
        selectedNotes.includes(index) ? false : deleted
      )
    );
    setSelectedNotes([]);
  };

  const handleDelete = () => {
    const listSuccess = [];
    selectedNotes.forEach((noteIndex) => {
      deleteNoteVinhVien(
        {
          userId: studentData?._id,
          noteId: listNoteDeleted[noteIndex]._id,
        },
        {
          onSuccess: () => {
            listSuccess.push(true);
          },
          onError: () => {
            listSuccess.push(false);
          },
        }
      );
    });

    if (listSuccess.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 ghi chú để xóa");
      return;
    }

    if (listSuccess.includes(false)) {
      toast.error("Xóa ghi chú thất bại");
      return;
    }
    toast.success("Xóa ghi chú thành công");

    setIsDeleted(
      isDeleted.map((deleted, index) =>
        selectedNotes.includes(index) ? true : deleted
      )
    );
    setSelectedNotes([]);
  };

  const toggleContentVisibility = (index) => {
    setIsContentVisible(
      isContentVisible.map((visible, idx) =>
        idx === index ? !visible : visible
      )
    );
  };

  const handleMouseDown = (index) => {
    pressTimer.current = setTimeout(() => toggleContentVisibility(index), 500); // 500ms for long click
  };

  const handleMouseUp = () => {
    clearTimeout(pressTimer.current);
  };

  const handleCheckboxChange = (index) => {
    setSelectedNotes(
      selectedNotes.includes(index)
        ? selectedNotes.filter((noteIndex) => noteIndex !== index)
        : [...selectedNotes, index]
    );
  };

  const handleNoteRestore = (index) => {
    setIsDeleted(
      isDeleted.map((deleted, idx) => (idx === index ? false : deleted))
    );
  };

  const handleNoteDelete = (index) => {
    setIsDeleted(
      isDeleted.map((deleted, idx) => (idx === index ? true : deleted))
    );
  };

  return (
    <div className={styles.tong}>
      {listNoteDeleted &&
        listNoteDeleted.map((note, index) => (
          <div
            key={note._id}
            className={styles.note}
            onMouseDown={() => handleMouseDown(index)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // Clear the timer if the mouse leaves the element
          >
            <input
              type="checkbox"
              checked={selectedNotes.includes(index)}
              onChange={() => handleCheckboxChange(index)}
            />
            <h3>{note.note_title}</h3>
            <p dangerouslySetInnerHTML={{ __html: note.note_content }}></p>
          </div>
        ))}
      <div className={styles.btn2}>
        <button className={styles.clickbtn} onClick={handleRestore}>
          Khôi Phục
        </button>
        <button className={styles.clickbtn} onClick={handleDelete}>
          Xóa Vĩnh Viễn
        </button>
      </div>
    </div>
  );
}
