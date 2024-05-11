import { useState, useEffect } from "react";

function usePositionDefParent(ref, parentRef) {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function updatePosition() {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setPosition({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        });
      }
    }

    // Cập nhật vị trí ban đầu
    updatePosition();

    // Đăng ký lắng nghe sự kiện thay đổi kích thước và di chuyển từ phần tử cha
    if (parentRef.current) {
      const parentElement = parentRef.current;
      parentElement.addEventListener("resize", updatePosition);
      parentElement.addEventListener("scroll", updatePosition);

      // Xóa lắng nghe sự kiện khi component unmount hoặc khi ref thay đổi
      return () => {
        parentElement.removeEventListener("resize", updatePosition);
        parentElement.removeEventListener("scroll", updatePosition);
      };
    }
  }, [ref, parentRef]); // Effect phụ thuộc vào ref và parentRef

  return position;
}

export { usePositionDefParent };
