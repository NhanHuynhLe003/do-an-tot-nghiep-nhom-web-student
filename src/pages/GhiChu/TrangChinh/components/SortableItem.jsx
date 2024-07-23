import { useSortable } from "@dnd-kit/sortable";
import { ItemDraggable } from "./ItemDraggable";

export function SortableItem({
  disabled,
  animateLayoutChanges,
  getNewIndex,
  handle,
  id, //Của Item truyền từ Sortable
  index,
  onRemove,
  style,
  renderItem,
  useDragOverlay,
  wrapperStyle,
  value, //Giá trị của note trong notes truyền từ item {id, title, content}
}) {
  const {
    active,
    attributes,
    isDragging,
    isSorting,
    listeners,
    overIndex,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges,
    disabled,
    getNewIndex,
  });

  return (
    <ItemDraggable
      ref={setNodeRef}
      value={value}
      disabled={disabled}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      handleProps={
        handle
          ? {
              ref: setActivatorNodeRef,
            }
          : undefined
      }
      renderItem={renderItem}
      index={index}
      style={style({
        index,
        id,
        isDragging,
        isSorting,
        overIndex,
      })}
      onRemove={onRemove ? () => onRemove(id) : undefined}
      transform={transform}
      transition={transition}
      wrapperStyle={wrapperStyle?.({ index, isDragging, active, id })}
      listeners={listeners}
      data-index={index}
      data-id={id}
      dragOverlay={!useDragOverlay && isDragging}
      {...attributes}
    />
  );
}
