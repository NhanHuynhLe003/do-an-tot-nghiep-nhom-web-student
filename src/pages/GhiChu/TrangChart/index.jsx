import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import style from "./TrangChart.module.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Import React và các component Bar, Pie, Line từ thư viện react-chartjs-2
// Import các style từ file TrangChart.module.css
// Import các thành phần cần thiết từ thư viện Chart.js
// Đăng ký các thành phần từ Chart.js sẽ được sử dụng trong biểu đồ

ChartJS.register(
    CategoryScale,  // Dùng cho trục X với dữ liệu phân loại
    LinearScale,    // Dùng cho trục Y với tỉ lệ tuyến tính
    BarElement,     // Dùng cho các thành phần cột trong biểu đồ cột
    ArcElement,     // Dùng cho các thành phần hình cung trong biểu đồ tròn
    LineElement,    // Dùng cho các thành phần đường trong biểu đồ đường
    PointElement,   // Dùng cho các điểm trên biểu đồ đường
    Title,          // Dùng cho tiêu đề của biểu đồ
    Tooltip,        // Dùng cho gợi ý khi rê chuột qua biểu đồ
    Legend          // Dùng cho chú giải của biểu đồ
);

// Khai báo dữ liệu và cấu hình cho biểu đồ cột
const barData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7'], // Nhãn trục X
    datasets: [
        {
            label: 'Dữ liệu 1', // Nhãn chú giải
            data: [65, 59, 80, 81, 56, 55, 40], // Dữ liệu trục Y
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Màu nền của cột
            borderColor: 'rgba(75, 192, 192, 1)', // Màu viền của cột
            borderWidth: 1, // Độ rộng của viền
        },
    ],
};

// Cấu hình cho biểu đồ cột
const barOptions = {
    responsive: true, // Tự động điều chỉnh kích thước
    plugins: {
        legend: {
            position: 'top', // Vị trí của chú giải
        },
        title: {
            display: true,
            text: 'Biểu đồ cột của Chart.js', // Tiêu đề của biểu đồ
        },
    },
};

// Khai báo dữ liệu và cấu hình cho biểu đồ tròn
const pieData = {
    labels: ['Đỏ', 'Xanh', 'Vàng', 'Xanh lá', 'Tím', 'Cam'], // Nhãn của các phần
    datasets: [
        {
            label: 'Dữ liệu 1',
            data: [12, 19, 3, 5, 2, 3], // Dữ liệu của từng phần
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ], // Màu nền của từng phần
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ], // Màu viền của từng phần
            borderWidth: 1, // Độ rộng của viền
        },
    ],
};

// Cấu hình cho biểu đồ tròn
const pieOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Biểu đồ tròn của Chart.js',
        },
    },
};

// Khai báo dữ liệu và cấu hình cho biểu đồ đường là sóng sin
const sineData = {
    labels: Array.from({ length: 100 }, (_, i) => i), // Tạo mảng gồm 100 phần tử từ 0 đến 99
    datasets: [
        {
            label: 'Sóng Sin',
            data: Array.from({ length: 100 }, (_, i) => Math.sin(i * 0.1)), // Tính giá trị sin cho từng phần tử
            borderColor: 'rgba(255, 99, 132, 1)', // Màu viền của đường
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Màu nền của đường
            fill: false, // Không tô màu nền
            tension: 0.1, // Độ căng của đường
        },
    ],
};

// Cấu hình cho biểu đồ đường là sóng sin
const sineOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Biểu đồ đường của Chart.js với sóng sin',
        },
    },
};

// Component chính, render ra giao diện biểu đồ
export default function TrangChart() {
    return (
        <div className={style.tong}>
            <div className={style.top}>
                <div className={style.chartcot}>
                    <Bar data={barData} options={barOptions} />
                </div>
                <div className={style.charttron}>
                    <Pie data={pieData} options={pieOptions} />
                </div>
            </div>
            <div className={style.bot}>
                <div className={style.chartsin}>
                    <Line data={sineData} options={sineOptions} />
                </div>
            </div>
        </div>
    );
}
