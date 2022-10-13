import React, { FC, useContext } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import cx from 'classnames';
import DragResize from './DragResize';
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
          'tx-virtual-table__header__cell',
          !canDragSortColumn && 'tx-virtual-table__header__cell--default',
          canDragSortColumn && isDragging && 'tx-virtual-table__header__cell--dragging',
          canDragSortColumn && dragOverlay && 'tx-virtual-table__header__cell--over',
          canDragSortColumn && !dragOverlay && 'tx-virtual-table__header__cell--source',
          {
            'justify-start': textLayout === 'left',
            'justify-center': textLayout === 'center',
          }
        )}
        style={{ height: titleHeight }}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        {!!sortRenders && !dragOverlay && sortRenders[id] && (
          <div
            className={cx(
              'tx-virtual-table__header__cell--sort_wrapper',
              filterRenders?.[id] && '!right-5'
            )}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {sortRenders[id]}
          </div>
        )}
        {!!filterRenders && !dragOverlay && filterRenders[id] && (
          <div
            className={'tx-virtual-table__header__cell--filter_wrapper'}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {filterRenders[id]}
          </div>
        )}
        {canChangeWidths && canResize && canRender && !dragOverlay && (
          <span onMouseDown={(e) => e.stopPropagation()}>
            <DragResize
              id={id}
              handleChangeWidth={(x) => onChangeWidth(id, x)}
              onDragEnd={onDragWidthEnd}
            />
          </span>
        )}
        {!canResize && !endCol && <div className="tx-virtual-table__header__cell--drag_end" />}
      </div>
    </div>
  );
};

export default TableHead;
