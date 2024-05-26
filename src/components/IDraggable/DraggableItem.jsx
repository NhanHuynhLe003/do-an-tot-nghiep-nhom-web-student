import clsx from "clsx";
import styles from "./IDraggableFree.module.css";
// import {
//   draggable,
//   draggableHorizontal,
//   draggableVertical,
// } from "./IconsDraggable";
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
export default function IDraggableItem({
  ref,
  axis,
  dragOverlay,
  dragging,
  handle,
  label,
  listeners,
  transform,
  style,
  childElement = (
    <span>
      <input></input>
    </span>
  ),
  ...props
}) {
  return (
    <div
      //Các class ứng với trạng thái đgl kéo, đgl kéo, có handle
      className={clsx(styles.DraggableItem, {
        [styles.dragOverlay]: !!dragOverlay,
        [styles.dragging]: !!dragging,
        [styles.handle]: !!handle,
      })}
      style={{
        ...style,
        "--translate-x": `${transform?.x ?? 0}px`,
        "--translate-y": `${transform?.y ?? 0}px`,
      }}
    >
      <button {...listeners}>{childElement}</button>
    </div>
  );
}
