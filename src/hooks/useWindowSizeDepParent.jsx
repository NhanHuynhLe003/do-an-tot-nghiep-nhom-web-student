import { useState, useEffect } from "react";

/**
 * @description Hook này sẽ trả về kích thước của cửa sổ màn hình client hiện tại
 * @returns {Object} Kích thước cửa sổ hiện tại
 */
function useWindowSizeDepParent(divRef = { current: window }) {
  const [parentSize, setParentSize] = useState({ left: 0, top: 0 });
  // Hàm xử lý sự kiện cuộn
  const handleScroll = () => {
    // Lấy vị trí cuộn hiện tại từ tham chiếu của thẻ `div`
    const scrollTop = divRef.current.scrollTop;
    const scrollLeft = divRef.current.scrollLeft;

    // In ra vị trí cuộn hiện tại (dọc và ngang)
    setParentSize({ left: scrollLeft, top: scrollTop });
  };

  // Thêm sự kiện cuộn vào thẻ `div` khi thành phần được gắn kết
  useEffect(() => {
    const divElement = divRef.current;

    if (divElement) {
      divElement.addEventListener("scroll", handleScroll);
    }

    // Gỡ bỏ sự kiện khi thành phần hủy (clean up)
    return () => {
      if (divElement) {
        divElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return parentSize;
}

export { useWindowSizeDepParent };
