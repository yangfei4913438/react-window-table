import React, { useContext } from 'react';
import { ListType, VirtualTableContext } from './consts';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TableRow from './TableRow';

interface DragRowsItemProps<T> {
  row: T;
  index: number;
  dragOverlay?: boolean;
  isScrolling?: boolean;
  style?: React.CSSProperties;
}

const DragRowsItem = <T extends ListType>({
  row,
  index,
  dragOverlay = false,
  isScrolling = false,
  style,
}: DragRowsItemProps<T>) => {
  const { canDragSortRow, rowHeight } = useContext(VirtualTableContext);

  const { attributes, isDragging, listeners, setNodeRef, transform, transition, isOver } =
    useSortable({
      id: row.id,
      disabled: !canDragSortRow,
    });

  return (
    <div
      role="row"
      aria-rowindex={index + 1}
      aria-busy={isDragging}
      ref={setNodeRef}
      style={{
        ...style,
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {isDragging ? (
        // 这里不要填色，留白即可。有颜色在向下滚动到一定位置的时候，颜色会丢失，可能是遇到bug了，但现在没时间排查，以后有空再说。
        <div className="w-full" style={{ height: rowHeight }} />
      ) : (
        <TableRow
          attributes={attributes}
          listeners={listeners}
          row={row}
          index={index}
          isScrolling={isScrolling}
          key={row.id ?? String(index)}
          dragOverlay={dragOverlay}
          isDragging={isDragging}
          isOver={isOver}
        />
      )}
    </div>
  );
};

export default DragRowsItem;
