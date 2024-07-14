import React, { useState, useRef } from 'react';
import styles from "./TrangRecycleBin.module.css";
const notesData = [
    { id: 1, content: 'Nội dung chi tiết của tờ note 1.' },
    { id: 2, content: 'Nội dung chi tiết của tờ note 2.' },
    { id: 3, content: 'Nội dung chi tiết của tờ note 3.' },
    { id: 4, content: 'Nội dung chi tiết của tờ note 4.' },
    { id: 5, content: 'Nội dung chi tiết của tờ note 5.' },
    { id: 6, content: 'Nội dung chi tiết của tờ note 6.' },
    { id: 7, content: 'Nội dung chi tiết của tờ note 7.' },
    { id: 8, content: 'Nội dung chi tiết của tờ note 8.' },
];

export default function Thungrac() {
    const [isDeleted, setIsDeleted] = useState(Array(notesData.length).fill(false));
    const [isContentVisible, setIsContentVisible] = useState(Array(notesData.length).fill(false));
    const [selectedNotes, setSelectedNotes] = useState([]);
    const pressTimer = useRef(null);

    const handleRestore = () => {
        setIsDeleted(isDeleted.map((deleted, index) => selectedNotes.includes(index) ? false : deleted));
        setSelectedNotes([]);
    };

    const handleDelete = () => {
        setIsDeleted(isDeleted.map((deleted, index) => selectedNotes.includes(index) ? true : deleted));
        setSelectedNotes([]);
    };

    const toggleContentVisibility = (index) => {
        setIsContentVisible(isContentVisible.map((visible, idx) => idx === index ? !visible : visible));
    };

    const handleMouseDown = (index) => {
        pressTimer.current = setTimeout(() => toggleContentVisibility(index), 500); // 500ms for long click
    };

    const handleMouseUp = () => {
        clearTimeout(pressTimer.current);
    };

    const handleCheckboxChange = (index) => {
        setSelectedNotes(selectedNotes.includes(index)
            ? selectedNotes.filter(noteIndex => noteIndex !== index)
            : [...selectedNotes, index]);
    };

    const handleNoteRestore = (index) => {
        setIsDeleted(isDeleted.map((deleted, idx) => idx === index ? false : deleted));
    };

    const handleNoteDelete = (index) => {
        setIsDeleted(isDeleted.map((deleted, idx) => idx === index ? true : deleted));
    };

    return (
        <div className={styles.tong}>
          
            {notesData.map((note, index) => (
                !isDeleted[index] && (
                    <div 
                        key={note.id}
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
                        <p>Đây là tờ note của bạn.</p>
                        {isContentVisible[index] && (
                            <div className={styles.btn3}>
                                <p>{note.content}</p>
                                <button className={styles.clickbtn1} onClick={() => handleNoteRestore(index)}>Khôi Phục</button>
                                <button className={styles.clickbtn1} onClick={() => handleNoteDelete(index)}>Xóa Vĩnh Viễn</button>
                            </div>
                        )}
                    </div>
                )
            ))}
            <div className={styles.btn2}>
            <button className={styles.clickbtn} onClick={handleRestore}>Khôi Phục</button>
            <button className={styles.clickbtn} onClick={handleDelete}>Xóa Vĩnh Viễn</button>
            </div>
        </div>
    );
}
