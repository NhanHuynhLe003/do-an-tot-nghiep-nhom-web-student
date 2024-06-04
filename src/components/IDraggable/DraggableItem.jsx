import clsx from "clsx";
import styles from "./IDraggableFree.module.css";

import React from "react";

const Axis = {
  ALL: "AXIS_ALL",
  VERTICAL: "AXIS_VERTICAL",
  HORIZONTAL: "AXIS_HORIZONTAL",
};

/**
 * IDraggableItem là một component đại diện cho một mục có thể kéo được trong giao diện kéo-thả.
 *
 * @param {React.Ref} ref - Tham chiếu tới phần tử button kéo được.
 * @param {string} axis - Định nghĩa trục mà theo đó mục có thể được kéo. Có thể là Axis.VERTICAL hoặc Axis.HORIZONTAL.
 * @param {boolean} dragOverlay - Xác định xem mục hiện tại có đang được sử dụng như một lớp phủ kéo hay không.
 * @param {boolean} dragging - Chỉ định nếu mục hiện tại đang được kéo.
 * @param {boolean} handle - Nếu true, chỉ định rằng mục có một tay cầm kéo.
 * @param {string} label - Nhãn tùy chọn cho mục kéo được.
 * @param {object} listeners - Các trình lắng nghe sự kiện kéo (thường được cung cấp bởi thư viện dnd-kit).
 * @param {object} transform - Trạng thái biến đổi của mục kéo được (chứa các giá trị x và y).
 * @param {object} style - Các kiểu dáng CSS bổ sung cho mục kéo được.
 * @param {object} buttonStyle - Các kiểu dáng CSS bổ sung cho button kéo được.
 * @param {object} props - Các thuộc tính khác được truyền tới button kéo được.
 */
//REF không thể truyền dưới dạng props, nên cần phải bằng cách forwardRef từ cha xuống con
const IDraggableItem = React.forwardRef((props, ref) => {
  const {
    coordinate,
    rotate = 0,
    id,
    sizeLines, // Kích thước của các đường kẻ có dạng {id:1, lines:[]}
    axis,
    dragOverlay,
    dragging,
    handle,
    label,
    listeners,
    transform,
    style,
    childElement,
    ...attributes
  } = props;

  const [isShowLines, setIsShowLines] = React.useState(false);

  function handleHoverItem() {
    setIsShowLines(true);
  }
  function handleLeaveItem() {
    setIsShowLines(false);
  }

  return (
    // (IDEA) Khả năng cao vài bữa sẽ truyền trực tiếp cái IWrapperRotate vào thay cái thẻ div ở lớp 1 này luôn, truyền mấy cái line vào dưới dạng children là được rôi
    <div
      onMouseEnter={handleHoverItem}
      onTouchMove={handleHoverItem}
      onTouchStart={handleHoverItem}
      onMouseLeave={handleLeaveItem}
      onTouchEnd={handleLeaveItem}
      ref={ref}
      {...listeners}
      {...attributes}
      //Các class ứng với trạng thái đgl kéo, đgl kéo, có handle
      className={clsx(styles.DraggableItem, styles.IDraggableItemContainer, {
        [styles.dragOverlay]: !!dragOverlay,
        [styles.dragging]: !!dragging,
        [styles.handle]: !!handle,
      })}
      // Quan trọng, nó dùng để transform mục kéo được
      style={{
        ...style,
        "--translate-x": `${transform?.x || 0}px`,
        "--translate-y": `${transform?.y || 0}px`,
      }}
    >
      <button className={style.buttonDragger}>
        {childElement}
        <div
          style={{
            // Kiểm tra xem id của item đang kéo có trùng với id của item hiện tại không, tránh trường hợp kéo trùng lặp
            height:
              sizeLines.idItemDragging === id ? sizeLines.lines[0]?.top : 0,
          }}
          className={clsx(styles.line, styles.line1, {
            [styles.showLines]: isShowLines,
          })}
        ></div>
        <div
          style={{
            height:
              sizeLines.idItemDragging === id ? sizeLines.lines[1]?.top : 0,
          }}
          className={clsx(styles.line, styles.line2, {
            [styles.showLines]: isShowLines,
          })}
        ></div>
        <div
          style={{
            width:
              sizeLines.idItemDragging === id ? sizeLines.lines[1]?.right : 0,
          }}
          className={clsx(styles.line, styles.line3, {
            [styles.showLines]: isShowLines,
          })}
        ></div>
        <div
          style={{
            width:
              sizeLines.idItemDragging === id ? sizeLines.lines[2]?.right : 0,
          }}
          className={clsx(styles.line, styles.line4, {
            [styles.showLines]: isShowLines,
          })}
        ></div>
        <div
          style={{
            height:
              sizeLines.idItemDragging === id ? sizeLines.lines[2]?.bottom : 0,
          }}
          className={clsx(styles.line, styles.line5, {
            [styles.showLines]: isShowLines,
          })}
        ></div>
        <div
          style={{
            height:
              sizeLines.idItemDragging === id ? sizeLines.lines[3]?.bottom : 0,
          }}
          className={clsx(styles.line, styles.line6, {
            [styles.showLines]: isShowLines,
          })}
        ></div>
        <div
          style={{
            width:
              sizeLines.idItemDragging === id ? sizeLines.lines[3]?.left : 0,
          }}
          className={clsx(styles.line, styles.line7, {
            [styles.showLines]: isShowLines,
          })}
        ></div>
        <div
          style={{
            width:
              sizeLines.idItemDragging === id ? sizeLines.lines[0]?.left : 0,
          }}
          className={clsx(styles.line, styles.line8, {
            [styles.showLines]: isShowLines,
          })}
        ></div>
        <div
          style={{
            height:
              sizeLines.idItemDragging === id ? sizeLines.lines[4]?.top : 0,
          }}
          className={clsx(styles.line, styles.line9, {
            [styles.showLines]: isShowLines,
          })}
        ></div>
        <div
          style={{
            width:
              sizeLines.idItemDragging === id ? sizeLines.lines[4]?.right : 0,
          }}
          className={clsx(styles.line, styles.line10, {
            [styles.showLines]: isShowLines,
          })}
        ></div>
        <div
          style={{
            height:
              sizeLines.idItemDragging === id ? sizeLines.lines[4]?.bottom : 0,
          }}
          className={clsx(styles.line, styles.line11, {
            [styles.showLines]: isShowLines,
          })}
        ></div>
        <div
          style={{
            width:
              sizeLines.idItemDragging === id ? sizeLines.lines[4]?.left : 0,
          }}
          className={clsx(styles.line, styles.line12, {
            [styles.showLines]: isShowLines,
          })}
        ></div>
      </button>
    </div>
  );
});

export default React.memo(IDraggableItem);
