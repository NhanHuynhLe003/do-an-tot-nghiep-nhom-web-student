import React, { useState } from 'react';
import style from "./MyBookShelf.module.css";

const books = [
    {
        id: 1,
        title: "Book 1",
        img: "https://cf.shopee.vn/file/9363b0f6e370245c555333a706f73540",
        borrowedOn: "2024-01-01",
        submissionDue: "2024-01-15"
    },
    {
        id: 2,
        title: "Book 2",
        img: "https://cf.shopee.vn/file/9363b0f6e370245c555333a706f73540",
        borrowedOn: "2024-02-01",
        submissionDue: "2024-02-15"
    },
    {
        id: 3,
        title: "Book 3",
        img: "https://cf.shopee.vn/file/9363b0f6e370245c555333a706f73540",
        borrowedOn: "2024-03-01",
        submissionDue: "2024-03-15"
    },
    {
        id: 4,
        title: "Book 4",
        img: "https://cf.shopee.vn/file/9363b0f6e370245c555333a706f73540",
        borrowedOn: "2024-04-01",
        submissionDue: "2024-04-15"
    },
    {
        id: 5,
        title: "Book 5",
        img: "https://cf.shopee.vn/file/9363b0f6e370245c555333a706f73540",
        borrowedOn: "2024-05-01",
        submissionDue: "2024-05-15"
    },
    {
        id: 6,
        title: "Book 6",
        img: "https://cf.shopee.vn/file/9363b0f6e370245c555333a706f73540",
        borrowedOn: "2024-06-01",
        submissionDue: "2024-06-15"
    },
    {
        id: 7,
        title: "Book 7",
        img: "https://cf.shopee.vn/file/9363b0f6e370245c555333a706f73540",
        borrowedOn: "2024-07-01",
        submissionDue: "2024-07-15"
    },
    {
        id: 8,
        title: "Book 8",
        img: "https://cf.shopee.vn/file/9363b0f6e370245c555333a706f73540",
        borrowedOn: "2024-08-01",
        submissionDue: "2024-08-15"
    },
    {
        id: 9,
        title: "Book 9",
        img: "https://cf.shopee.vn/file/9363b0f6e370245c555333a706f73540",
        borrowedOn: "2024-09-01",
        submissionDue: "2024-09-15"
    },
    {
        id: 10,
        title: "Book 10",
        img: "https://cf.shopee.vn/file/9363b0f6e370245c555333a706f73540",
        borrowedOn: "2024-10-01",
        submissionDue: "2024-10-15"
    }
];

export default function MyBookShelf() {
    const [activeItem, setActiveItem] = useState('All Books'); // State để lưu trữ mục đang active

    return (
        <div className={style.BookShelf}>
            <div className={style.title}>
                <h2>
                    <span className={style.blackText}>Your</span> <span className={style.blueText}>Shelf</span>
                </h2>
            </div>
            <div className={style.menu}>
                <ul className={style.card}>
                    {/* Sử dụng className active để chỉ định mục đang active */}
                    <li className={activeItem === 'All Books' ? style.active : ''} onClick={() => setActiveItem('All Books')}>All Books</li>
                    <li className={activeItem === 'Favourite' ? style.active : ''} onClick={() => setActiveItem('Favourite')}>Favourite</li>
                    <li className={activeItem === 'Borrowed Books' ? style.active : ''} onClick={() => setActiveItem('Borrowed Books')}>Borrowed Books</li>
                </ul>
            </div>
            <div className={style.bookContainer}>
                {books.map(book => (
                    <div key={book.id} className={`${style.book} ${activeItem === 'Borrowed Books' ? style.show : ''}`}>
                        <div className={style.bookcard}>
                            <img src={book.img} alt={book.title} className={style.imgbook}/>
                            <br />
                            <div className={style.title}>{book.title}</div>
                        </div>
                        <div className={`${style.time} ${activeItem === 'Borrowed Books' ? style.show : ''}`}>
                            <h4>Borrowed On</h4>
                            <span className={style.date}>{book.borrowedOn}</span>
                            <h4>Submission Due</h4>
                            <span className={style.date}>{book.submissionDue}</span>
                            <div className={style.btnborrowedOn}><button>Borrowed</button></div>
                            <div className={style.btnreturn}><button>Return</button></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
