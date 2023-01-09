import {
  DndContext,
  useDraggable,
  useSensor,
  MouseSensor,
  TouchSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { FC, useContext, useEffect } from 'react';
import cx from 'classnames';
import { VirtualTableContext } from './consts';

interface IDragResizeProps {
  id: string;
  handleChangeWidth: (x: number) => void;
  onDragEnd: () => void;
}
const DragResize: FC<IDragResizeProps> = ({ id, handleChangeWidth, onDragEnd }) => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  return (
    <DndContext
      sensors={sensors}
      onDragMove={({ delta: { x } }) => handleChangeWidth(x)}
      onDragEnd={onDragEnd}
      modifiers={[restrictToHorizontalAxis]}
    >
      <DraggableItem id={id} />
    </DndContext>
  );
};

export default DragResize;

interface DraggableItemProps {
  id: string;
}
function DraggableItem({ id }: DraggableItemProps) {
  const { setColResizing } = useContext(VirtualTableContext);

  const { listeners, setNodeRef, isDragging } = useDraggable({ id });

  useEffect(() => {
    setColResizing(isDragging);
  }, [isDragging, setColResizing]);

  return (
    <div
      ref={setNodeRef}
      className={cx(
        'absolute inset-y-0 -right-2 z-2 flex w-3.75 cursor-ew-resize items-center justify-center',
        'after:pointer-events-none after:z-5 after:h-3/5 after:w-3px after:rounded hover:after:bg-accent',
        'before:pointer-events-none before:absolute before:inset-y-2 before:w-px before:rounded before:transition-colors',
        'group-hover/table-header:before:bg-light-100',
        isDragging && 'after:bg-accent'
      )}
      {...listeners}
    />
  );
}
