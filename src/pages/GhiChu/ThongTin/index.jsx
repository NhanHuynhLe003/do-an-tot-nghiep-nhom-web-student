import React from 'react';
import styles from './ThongTin.module.css';

export default function ThongTin() {
    // Dữ liệu của sinh viên
    const studentInfo = {
        hoTen: "TRẦN VĂN ĐẠT",
        lop: "ĐTTT21MT",
        maSoSinhVien: "0308211116"
    };

    return (
        <div className={styles.container}>
            <h1>Thông Tin Thẻ Note</h1>
            <form>
                <div className={styles.formGroup}>
                    <label>Họ Tên:</label>
                    <input type="text" value={studentInfo.hoTen} readOnly className={styles.studentInput} />
                </div>
                <div className={styles.formGroup}>
                    <label>Lớp:</label>
                    <input type="text" value={studentInfo.lop} readOnly className={styles.studentInput} />
                </div>
                <div className={styles.formGroup}>
                    <label>Mã Số Sinh Viên:</label>
                    <input type="text" value={studentInfo.maSoSinhVien} readOnly className={styles.studentInput} />
                </div>
            </form>
        </div>
    );
}
