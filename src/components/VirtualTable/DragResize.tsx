import {
  DndContext,
  useDraggable,
  useSensor,
  MouseSensor,
  TouchSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { FC } from 'react';

interface IDragResizeProps {
  id: string;
  handleChangeWidth: (x: number) => void;
}
const DragResize: FC<IDragResizeProps> = ({ id, handleChangeWidth }) => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  return (
    <DndContext
      sensors={sensors}
      onDragMove={({ delta: { x } }) => handleChangeWidth(x)}
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
  const { listeners, setNodeRef } = useDraggable({ id });
  return (
    <div
      ref={setNodeRef}
      className="absolute right-0 top-[25%] h-[50%] w-0 cursor-col-resize border-r-2 border-dotted border-gray-500"
      {...listeners}
    />
  );
}
