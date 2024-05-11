import { useState, useEffect } from "react";

/**
 * @description Hook này sẽ trả về kích thước của cửa sổ màn hình client hiện tại
 * @returns {Object} Kích thước cửa sổ hiện tại
 */
function useWindowSize() {
  // Khởi tạo state với kích thước cửa sổ ban đầu
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Handler để gọi khi kích thước cửa sổ thay đổi
    function handleResize() {
      // Cập nhật state mới với kích thước cửa sổ hiện tại
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Lắng nghe sự kiện thay đổi kích thước của cửa sổ
    window.addEventListener("resize", handleResize);

    // Xóa bỏ lắng nghe sự kiện khi component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Chỉ chạy một lần sau khi component mount

  return windowSize;
}

export { useWindowSize };
