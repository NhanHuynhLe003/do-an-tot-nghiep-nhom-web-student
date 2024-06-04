import { Box } from "@mui/material";
import { cloneDeep, set } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowRotateRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import doubleArrow from "../../assets/icons/double-arrow.png";
import { RANGE_AUTO_FIT_ROTATE, sizeEditorDefault } from "../../constants";
import {
  clickOutsideDragItemSelector,
  itemsSelectorDragSelect,
} from "../../redux/selector";
import CvSlice from "../../redux/slices/CvSlice";
import styles from "./IWrapperResizeRotate.module.css";

const IWrapperResizeRotate = React.forwardRef((props, ref) => {
  const {
    id = -1,
    childContent = "Nhập nội dung vào đây",
    typeChildren = "editor",
    ChildComponent = React.Fragment,
    ...restProps
  } = props;

  // Các item đg select
  const selectedItems = useSelector(itemsSelectorDragSelect);
  const [modeSelect, setModeSelect] = useState("single");
  const dispatch = useDispatch();
  const elementRef = useRef(null);
  const childrenContainerRef = useRef(null);

  // Lưu các nút đang nhấn
  const [keyPressed, setKeyPressed] = useState(null);

  const [isHoverRotate, setIsHoverRoate] = useState(false);
  const [rotate, setRotate] = useState(0);

  const [size, setSize] = useState(
    typeChildren === "editor"
      ? sizeEditorDefault
      : {
          width: 200,
          height: 200,
        }
  );

  useEffect(() => {
    if (keyPressed === "Control") {
      setModeSelect("multiple");
    } else {
      setModeSelect("single");
    }
  }, [keyPressed]);

  useEffect(() => {
    //Xử lý nhấn nút xem có phải đang nhấn ctrl để chọn nhiều item không
    const handleKeyDown = (event) => {
      setKeyPressed(event.key);
    };

    const handleKeyUp = () => {
      setKeyPressed(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  //Hàm xử lý khi click vào item để chọn
  function handleClickSelectItem(event) {
    event.stopPropagation(); // Ngăn sự kiện nổi bọt(click lan ra ngoài children), tránh khi nhấn vào thẻ cha chứa nó cũng kích hoạt cái này

    // Nếu click vào item đã chọn rồi thì không nhấn vào board bên ngoài nữa
    dispatch(CvSlice.actions.setClickOutsideDragItem(false));

    if (modeSelect === "multiple") {
      //Nếu trong mảng có rồi thì ko thêm nữa

      if (selectedItems.items?.some((item) => item.id === id)) return;

      const newUploadSelect = {
        ...selectedItems,
        items: [...selectedItems.items, { id: id }],
      };
      console.log("newUploadSelect", newUploadSelect);
      dispatch(CvSlice.actions.setPropertyItemsDragSelect(newUploadSelect));
    } else {
      //Single mode => replace all item in arr
      dispatch(
        CvSlice.actions.setPropertyItemsDragSelect({
          ...selectedItems,
          items: [{ id: id }],
        })
      );
    }
  }

  // Hàm lấy góc xoay gần góc đặc biệt nhất
  function getNearestSnapAngle(angle) {
    const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315];
    return snapAngles.reduce((prev, curr) =>
      Math.abs(curr - angle) < Math.abs(prev - angle) ? curr : prev
    );
  }
  function handleRotate(deg) {
    setRotate(deg);
    dispatch(
      CvSlice.actions.setSizeAndDegItemDraggable({
        id: id,
        size: size,
        deg: deg,
      })
    );
  }

  function handleSetSize(size) {
    setSize(size);
    dispatch(
      CvSlice.actions.setSizeAndDegItemDraggable({
        id: id,
        deg: rotate,
        size: size,
      })
    );
  }

  // Xử lý sự kiện khi bắt đầu kéo để xoay
  const handleMouseDownRotate = (e) => {
    e.preventDefault();
    setIsHoverRoate(true);
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const handleMouseMoveRotate = (e) => {
      /**
      dx và dy đại diện cho sự thay đổi tọa độ theo trục X và Y từ trung tâm của phần tử.
      Math.atan2(dy, dx) tính toán góc (theo radian) từ trục X đến điểm (dx, dy).
      angle = 90 + Math.atan2(dy, dx) * (180 / Math.PI) chuyển đổi góc từ radian sang độ và thêm 90 độ để điều chỉnh góc xoay cho phù hợp với hệ tọa độ màn hình.
       */

      const dx = (e.clientX || e.touches[0].clientX) - centerX;
      const dy = (e.clientY || e.touches[0].clientY) - centerY;
      let angle = 90 + Math.atan2(dy, dx) * (180 / Math.PI);

      // Làm tròn góc xoay gần góc đặc biệt nhất
      const nearestSnapAngle = getNearestSnapAngle(angle);
      if (Math.abs(nearestSnapAngle - angle) < RANGE_AUTO_FIT_ROTATE) {
        // Tự động fit vào góc nếu nằm trong khoảng cách nhất định (ở đây là 5 độ)
        angle = nearestSnapAngle;
      }
      handleRotate(angle);
    };

    const handleMouseUpRotate = () => {
      setIsHoverRoate(false);
      window.removeEventListener("mousemove", handleMouseMoveRotate);
      window.removeEventListener("mouseup", handleMouseUpRotate);
      window.removeEventListener("touchmove", handleMouseMoveRotate);
      window.removeEventListener("touchend", handleMouseUpRotate);
    };

    window.addEventListener("mousemove", handleMouseMoveRotate);
    window.addEventListener("mouseup", handleMouseUpRotate);
    window.addEventListener("touchmove", handleMouseMoveRotate);
    window.addEventListener("touchend", handleMouseUpRotate);
  };

  // Xử lý sự kiện khi bắt đầu kéo để thay đổi kích thước
  const handleMouseDownResize = (e) => {
    e.preventDefault();
    /**
      startX = e.clientX || e.touches[0].clientX lưu lại tọa độ X ban đầu của chuột hoặc cảm ứng.
      startY = e.clientY || e.touches[0].clientY lưu lại tọa độ Y ban đầu của chuột hoặc cảm ứng.
     */
    const startX = e.clientX || e.touches[0].clientX;
    const startY = e.clientY || e.touches[0].clientY;

    /**
      startWidth = size.width lưu lại chiều rộng ban đầu của phần tử.
      startHeight = size.height lưu lại chiều cao ban đầu của phần tử.
     */
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMouseMoveResize = (e) => {
      //=> newWidth = chiều rộng box ban đầu + tọa độ kết thúc con trỏ - tọa độ ban đầu con trỏ
      const endX = e.clientX || e.touches[0].clientX;
      const endY = e.clientY || e.touches[0].clientY;
      const newWidth = startWidth + (endX - startX);
      const newHeight = startHeight + (endY - startY);
      handleSetSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUpResize = () => {
      window.removeEventListener("mousemove", handleMouseMoveResize);
      window.removeEventListener("mouseup", handleMouseUpResize);
      window.removeEventListener("touchmove", handleMouseMoveResize);
      window.removeEventListener("touchend", handleMouseUpResize);
    };

    window.addEventListener("mousemove", handleMouseMoveResize);
    window.addEventListener("mouseup", handleMouseUpResize);
    window.addEventListener("touchmove", handleMouseMoveResize);
    window.addEventListener("touchend", handleMouseUpResize);
  };

  return (
    <div
      className={`IWrapperResizeRotate IWrapperResizeRotate-${id}`}
      style={{
        border: selectedItems.items?.some((item) => item.id === id) //Check xem có đg select ko
          ? `2px dashed var(--color-primary1)`
          : `2px solid var(--color-primary1)`,
        // padding: paddingWrapperContainer.current,
        transform: `rotate(${rotate}deg)`, // (*) Xoay item
        // transformOrigin: "center",
        width: "fit-content",
        height: "fit-content",
        // position: "absolute", //(*) Cho các vị trí không liên quan đến nhau dù resize cũng ko ảnh hưởng
      }}
    >
      <div
        ref={elementRef}
        style={{
          width: "fit-content",
          height: "fit-content",
        }}
        className={styles["resizable-box"]}
      >
        <Box
          ref={childrenContainerRef}
          component={"div"}
          className={"childrenContainer"}
          sx={{
            // Có thể trong tương lai sẽ thêm class để chỉ editor mới fit-cotent
            width: "fit-content",
            height: "fit-content",
          }}
        >
          <div
            style={{
              width: "fit-content",
              height: "fit-content",
            }}
            onClick={handleClickSelectItem}
          >
            <ChildComponent
              ref={ref}
              size={size}
              content={childContent}
              {...props}
            ></ChildComponent>
          </div>
        </Box>
        {/* Điều khiển xoay */}
        {selectedItems.items?.some((item) => item.id === id) && ( //Check xem có đg select ko
          <div
            className={styles.rotateControl}
            onMouseDown={handleMouseDownRotate}
            onTouchStart={handleMouseDownRotate}
            // STyle cho nút xoay
            style={{
              position: "absolute",
              //Căn item ra giữa
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "1.5rem",
              height: "1.5rem",
              cursor: "pointer !important",
              top: "-2rem",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(135deg)",
              backgroundColor: isHoverRotate
                ? "transparent !important"
                : "var(--color-white1)",
              borderRadius: "50%",
              boxShadow: isHoverRotate ? "none" : "0 0 0 1px rgba(0,0,0,0.1)",
            }}
          >
            {isHoverRotate ? (
              <img
                src={doubleArrow}
                alt="icon-arrow"
                width={"90%"}
                height={"auto"}
              />
            ) : (
              <FaArrowRotateRight />
            )}
          </div>
        )}

        {/* Điều khiển thay đổi kích thước ở góc dưới bên phải */}
        {selectedItems.items?.some((item) => item.id === id) && ( //Check xem có đg select ko
          <Box
            component={"div"}
            // Xử lý sự kiện khi bắt đầu kéo để thay đổi kích thước trên cả máy tính và điện thoại
            onMouseDown={handleMouseDownResize}
            onTouchStart={handleMouseDownResize}
            sx={{
              position: "absolute",
              width: "0.75rem",
              height: "0.75rem",
              rotate: "90deg",
              background: "var(--color-primary1)",
              borderRadius: "50%",
              cursor: "nwse-resize",

              // ăn góc phải dưới
              bottom: "-0.5rem",
              right: "-0.5rem",
              zIndex: "100",
              transition: "ease 0.3s",
              "&:hover": {
                bottom: "-0.75rem",
                right: "-0.75rem",
                width: "1.25rem",
                height: "1.25rem",
              },
            }}
          ></Box>
        )}
      </div>
    </div>
  );
});
//Ngăn tình trạng component con re-render sau khi component cha re-render
export default React.memo(IWrapperResizeRotate);
