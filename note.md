# Huong Dan

## public folder

- Những ảnh hay thẻ svgs đều lưu trong public để tiện truy cập

## folder source component

- lưu những component dùng chung cho dự án ví dụ
- tốt nhất nên viết trực tiếp trước, sau đó nếu thấy những thiết kế sau có trùng lặp thì tách riêng ra vào folder component/ung-dung-ghi-chu

## folder data

- dung lưu các dữ liệu tạm thời được fetch từ server về
- Nhớ dùng data/ung-dung-ghi-chu

## folder pages

- Chứa các trang web chính được quản lý ở routes

## folder routes

- routes/index.js chứa toàn bộ các đường dẫn liên kết với trang và layout của trang đó

## folder styles

- styles/app.css chứa các css tổng như mã màu, kích thước,... dùng thì chỉ cần gọi từ khóa var(--ten-mau)

## App.js

- chứa nội dung config tổng => ko dùng
