import { useState, useEffect } from "react";

/**
 * @description Hook này sẽ trả về vị trí của element được truyền vào bao gồm x, y, width, height
 * @param {React.RefObject} ref
 */
function usePosition(ref) {
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

    updatePosition(); // Cập nhật vị trí ban đầu
    window.addEventListener("resize", updatePosition); // Cập nhật khi cửa sổ resize
    window.addEventListener("scroll", updatePosition); // Cập nhật khi scroll

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [ref]); // Effect phụ thuộc vào ref được truyền vào

  return position;
}

export { usePosition };
