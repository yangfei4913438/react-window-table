import React, { FC, useContext } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import cx from 'classnames';
import DragResize from './DragResize';
import { VirtualTableContext } from './consts';
import { Button } from '../Button';

interface ITableHead {
  id: string;
  // 是否禁用
  disabled?: boolean;
  // 是否拖拽渲染
  dragOverlay?: boolean;
  // 是否可以主动重置大小
  canResize?: boolean;
  // 是否为最后一个列
  endCol?: boolean;
  // 子节点
  children: React.ReactNode;
}

const TableHead: FC<ITableHead> = ({
  id,
  endCol = false,
  canResize = true,
  dragOverlay = false,
  children,
}) => {
  const {
    textLayout,
    labels,
    canChangeWidths,
    canDragSortColumn,
    filterRenders,
    sortRenders,
    titleHeight,
    onChangeWidth,
    onDragWidthEnd,
  } = useContext(VirtualTableContext);

  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    disabled: !canDragSortColumn,
  });

  // 渲染拖拽对象的时候，key 不能是最后一个
  const canRender = id !== labels[labels.length - 1];

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <div
        className={cx(
          'tx-virtual-table__header-cell-container',
          !canDragSortColumn && 'tx-virtual-table__header-cell-container--default',
          canDragSortColumn && isDragging && 'tx-virtual-table__header-cell-container--dragging',
          canDragSortColumn && dragOverlay && 'tx-virtual-table__header-cell-container--over',
          canDragSortColumn && !dragOverlay && 'tx-virtual-table__header-cell-container--source',
          {
            'justify-start': textLayout === 'left',
            'justify-center': textLayout === 'center',
            'justify-end': textLayout === 'right',
          }
        )}
        style={{ height: titleHeight }}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        {!!sortRenders && !dragOverlay && sortRenders[id] && (
          <Button
            aria-label="sort"
            variant="minimal"
            setSize="xs"
            onClick={(e) => e.stopPropagation()}
          >
            {sortRenders[id]}
          </Button>
        )}
        {!!filterRenders && !dragOverlay && filterRenders[id] && (
          <Button
            aria-label="filter"
            variant="minimal"
            setSize="xs"
            onClick={(e) => e.stopPropagation()}
          >
            {filterRenders[id]}
          </Button>
        )}
        {canChangeWidths && canResize && canRender && !dragOverlay && (
          <div onMouseDown={(e) => e.stopPropagation()}>
            <DragResize
              id={id}
              handleChangeWidth={(x) => onChangeWidth(id, x)}
              onDragEnd={onDragWidthEnd}
            />
          </div>
        )}
        {!canResize && !endCol && (
          <div className="tx-virtual-table__header-cell-container--drag-end" />
        )}
      </div>
    </div>
  );
};

export default TableHead;
