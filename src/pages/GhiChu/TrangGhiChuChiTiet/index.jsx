// src/TrangGhiChuChiTiet.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Trang ghi chu chi tiet => chứa toàn bộ nội dung của 1 ghi chú
 */
export default function TrangGhiChuChiTiet() {
    const { id } = useParams(); // Lấy ID từ URL
    const [note, setNote] = useState(null);

    useEffect(() => {
        // Giả sử bạn có API để lấy chi tiết ghi chú từ ID
        const fetchNoteDetail = async () => {
            try {
                const response = await fetch(`https://api.example.com/notes/${id}`);
                const data = await response.json();
                setNote(data);
            } catch (error) {
                console.error('Error fetching note detail:', error);
            }
        };

        fetchNoteDetail();
    }, [id]);

    if (!note) {
        return <div>Loading...</div>;
    }

    return (
        <div className="note-detail-page">
            <h1>{note.title}</h1>
            <p>{note.content}</p>
            <div>
                <strong>Created At:</strong> {new Date(note.createdAt).toLocaleDateString()}
            </div>
            <div>
                <strong>Updated At:</strong> {new Date(note.updatedAt).toLocaleDateString()}
            </div>
        </div>
    );
}
