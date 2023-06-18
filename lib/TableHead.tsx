import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Button from 'antd/es/button';
import cx from 'classnames';
import React, { FC, useContext } from 'react';

import DragResize from './components/DragResize';
import { VirtualTableContext } from './consts';

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
    setColResizing,
    colResizing,
  } = useContext(VirtualTableContext);

  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    disabled: !canDragSortColumn,
  });

  // 渲染拖拽对象的时候，key 不能是最后一个
  const canRender = id !== labels[labels.length - 1];

  return (
    <div
      className={cx('relative flex w-inherit items-center', {
        'hover:bg-gray-100': canDragSortColumn && !dragOverlay,
        'cursor-ew-resize': colResizing,
      })}
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
    >
      <div
        className={cx(
          'flex w-full select-none items-center gap-2 border border-transparent px-3',
          {
            'cursor-default': !canDragSortColumn && !colResizing,
            'z-0 opacity-10': isDragging && canDragSortColumn,
            'cursor-grabbing rounded border-gray-200 bg-white shadow-lg':
              canDragSortColumn && dragOverlay && !colResizing,
            'cursor-grab touch-manipulation': canDragSortColumn && !dragOverlay && !colResizing,
          },
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
        {canChangeWidths && canResize && canRender && !dragOverlay && (
          <div onMouseDown={(e) => e.stopPropagation()}>
            <DragResize
              id={id}
              handleChangeWidth={(x) => onChangeWidth(id, x)}
              onDragEnd={onDragWidthEnd}
              onDragging={setColResizing}
            />
          </div>
        )}
        {!canResize && !endCol && <div />}
      </div>

      {!dragOverlay && (
        <div
          className={cx('flex h-full items-center gap-2 px-2 empty:hidden', {
            'z-0 opacity-10': canDragSortColumn && isDragging,
          })}
        >
          {!!sortRenders && sortRenders[id] && (
            <Button aria-label='sort' size={'small'} onClick={(e) => e.stopPropagation()}>
              {sortRenders[id]}
            </Button>
          )}

          {!!filterRenders && filterRenders[id] && (
            <Button aria-label='filter' size={'small'} onClick={(e) => e.stopPropagation()}>
              {filterRenders[id]}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TableHead;
