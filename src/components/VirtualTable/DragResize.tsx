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
  }, [isDragging]);

  return (
    <div
      ref={setNodeRef}
      className={cx(
        'tx-virtual-table__separator',
        isDragging && 'tx-virtual-table__separator--resizing'
      )}
      {...listeners}
    />
  );
}
