import { DndContext, useDraggable, useSensor, MouseSensor, TouchSensor, useSensors } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { FC, useEffect } from 'react';
import cx from 'classnames';

interface IDragResizeProps {
  // 拖拽对象的id
  id: string;
  // 宽度变更回掉
  handleChangeWidth: (x: number) => void;
  // 完成拖拽后执行的回掉
  onDragEnd: () => void;
  // 拖拽中的回掉
  onDragging?: (dragging: boolean) => void;
}

const DragResize: FC<IDragResizeProps> = ({ id, handleChangeWidth, onDragging, onDragEnd }) => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  return (
    <DndContext
      sensors={sensors}
      onDragMove={({ delta: { x } }) => handleChangeWidth(x)}
      onDragEnd={onDragEnd}
      modifiers={[restrictToHorizontalAxis]}
    >
      <DraggableItem id={id} onDragging={onDragging} />
    </DndContext>
  );
};

export default DragResize;

interface DraggableItemProps {
  id: string;
  onDragging?: (dragging: boolean) => void;
}
function DraggableItem({ id, onDragging }: DraggableItemProps) {
  const { listeners, setNodeRef, isDragging } = useDraggable({ id });

  useEffect(() => {
    onDragging?.(isDragging);
  }, [isDragging, onDragging]);

  return (
    <div
      ref={setNodeRef}
      className={cx(
        'z-2 absolute inset-y-0 -right-2 flex cursor-ew-resize items-center justify-center',
        'after:z-5 after:pointer-events-none after:h-3/5 after:w-3 after:rounded hover:after:bg-green-500',
        'before:pointer-events-none before:absolute before:inset-y-2 before:w-px before:rounded before:transition-colors',
        'group-hover/table-header:before:bg-light-100',
        isDragging && 'after:bg-green-500'
      )}
      {...listeners}
    />
  );
}
