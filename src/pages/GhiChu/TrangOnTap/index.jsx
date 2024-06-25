import React from 'react';
import styles from './TrangOnTap.module.css';

const ReviewNote = ({ title, onReview }) => {
  return (
    <div className={styles.note}>
      <h2>{title}</h2>
      <button onClick={onReview}>Ôn Tập Lại</button>
    </div>
  );
};

export default function TrangOnTap() {
  const notes = [
    { id: 1, title: 'Ghi Chú 1' },
    { id: 2, title: 'Ghi Chú 2' },
    // Thêm các ghi chú khác ở đây
  ];

  const handleReview = (noteId) => {
    console.log(`Ôn tập lại ghi chú ${noteId}`);
    // Thêm logic để ôn tập lại ghi chú
  };

  return (
    <div className={styles.container}>
      <h1>Ôn Tập Chi Tiết</h1>
      <div className={styles.noteList}>
        {notes.map((note) => (
          <ReviewNote
            key={note.id}
            title={note.title}
            onReview={() => handleReview(note.id)}
          />
        ))}
      </div>
    </div>
  );
}
