import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import style from "./TrangChart.module.css"; // Import các style từ file TrangChart.module.css
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
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], // Nhãn trục X
    datasets: [
        {
            label: 'Dữ liệu 1', // Nhãn chú giải
            data: [65, 59, 80, 81, 56, 55, 40], // Dữ liệu trục Y
            backgroundColor: 'rgba(54, 162, 235, 0.2)', // Màu nền của cột
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
            position: 'bottom', // Vị trí của chú giải
        },
        title: {
            display: true,
            text: 'Biểu đồ cột của Chart.js', // Tiêu đề của biểu đồ
        },
    },
};

// Khai báo dữ liệu và cấu hình cho biểu đồ tròn
const pieData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], // Nhãn của các phần
    datasets: [
        {
            label: 'Dữ liệu 1',
            data: [50, 5, 10, 7, 4, 16, 8], // Dữ liệu của từng phần, đã thêm dữ liệu cho Chủ nhật
            backgroundColor: [
                'rgba(255, 99, 71, 0.8)',    // Đỏ tươi với độ trong suốt 80%
                'rgba(255, 140, 0, 0.8)',    // Cam đậm với độ trong suốt 80%
                'rgba(255, 215, 0, 0.8)',    // Vàng đậm với độ trong suốt 80%
                'rgba(50, 205, 50, 0.8)',    // Xanh lá cây đậm với độ trong suốt 80%
                'rgba(148, 0, 211, 0.8)',    // Tím đậm với độ trong suốt 80%
                'rgba(255, 20, 147, 0.8)',   // Hồng đậm với độ trong suốt 80%
                'rgba(0, 0, 255, 0.8)'       // Xanh lam đậm với độ trong suốt 80% cho Chủ nhật
            ], // Màu nền của từng phần
            borderColor: [
                'rgba(255, 99, 132, 1)',     // Màu viền cho Thứ Hai
                'rgba(54, 162, 235, 1)',     // Màu viền cho Thứ Ba
                'rgba(255, 206, 86, 1)',     // Màu viền cho Thứ Tư
                'rgba(75, 192, 192, 1)',     // Màu viền cho Thứ Năm
                'rgba(153, 102, 255, 1)',    // Màu viền cho Thứ Sáu
                'rgba(255, 159, 64, 1)',     // Màu viền cho Thứ Bảy
                'rgba(0, 0, 139, 1)'         // Màu viền cho Chủ nhật (Xanh lam đậm hơn)
            ], // Màu viền của từng phần
            borderWidth: 0.1, // Độ rộng của viền
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
    labels: Array.from({ length: 30 }, (_, i) => i), // Tạo mảng gồm 30 phần tử từ 0 đến 29
    datasets: [
        {
            label: 'Sóng Sin',
            data: Array.from({ length: 30 }, (_, i) => Math.sin((i / 3) * Math.PI)), // Tính giá trị sin cho từng phần tử
            borderColor: 'rgba(255, 99, 132, 1)', // Màu viền của đường
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Màu nền của đường
            fill: false, // Không tô màu nền
            tension: 0.2, // Độ căng của đường
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
                    <Bar data={barData} options={barOptions} className={style.cotchart} /> 
                </div>
                <div className={style.charttron}>
                    <Pie data={pieData} options={pieOptions} className={style.tronchart} /> 
                </div>
            </div>
            <div className={style.bot}>
                <div className={style.chartsin}>
                    <Line data={sineData} options={sineOptions} className={style.sinchart} /> 
                </div>
            </div>
        </div>
    );
}
