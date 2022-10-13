import React, { type Dispatch, useContext } from 'react';
import { VirtualTableContext, ListType } from './consts';
import cx from 'classnames';
import IndeterminateCheckbox from './IndeterminateCheckbox';
import intersection from 'lodash-es/intersection';
import difference from 'lodash-es/difference';
import { DraggableAttributes } from '@dnd-kit/core/dist/hooks/useDraggable';
import DragRowHandle from './DragRowHandle';

interface TableRowProps<T> {
  rowClass?: string;
  index: number;
  isScrolling?: boolean;
  row: T;
  listeners?: Record<string, Function>;
  attributes?: DraggableAttributes;
  dragOverlay?: boolean;
  isOver?: boolean;
  isDragging?: boolean;
}

const TableRow = <T extends ListType>({
  rowClass,
  index,
  isScrolling,
  row,
  attributes,
  listeners,
  isDragging,
  dragOverlay,
}: TableRowProps<T>) => {
  const {
    textLayout,
    labels,
    rowHeight,
    canDragSortRow,
    dragRowIcon,
    canChecked,
    checked,
    setChecked,
    scrollingRender,
    columns,
    fixedLeftCount,
    fixedRightCount,
    getLeftWidth,
    getRightWidth,
    rowClick,
  } = useContext(VirtualTableContext);

  // 选中行
  const handleCheckBox = (
    row: T,
    checked: string[],
    setChecked: Dispatch<React.SetStateAction<string[]>>
  ) => {
    // 没有下级
    if (!row?.children || row.children.length === 0) {
      if (checked.includes(row.id)) {
        const idx = checked.indexOf(row.id);
        const list1 = checked.slice(0, idx);
        const list2 = checked.slice(idx + 1, checked.length);
        setChecked(() => list1.concat(list2));
      } else {
        setChecked((prevState) => prevState.concat([row.id]));
      }
    }
    // 有下级
    else {
      const ids = row.children.map((o) => o.id);
      // ids 中被选中的元素
      const inners = intersection(checked, ids);
      if (inners.length === ids.length) {
        // 不存在ids中的所有值
        setChecked(difference(checked, ids));
      } else {
        setChecked((prevState) => prevState.concat(ids));
      }
    }
  };

  // 判断是否选中
  const isChecked = () => {
    // 没有下级
    if (!row?.children || row.children.length === 0) {
      return checked.includes(row.id);
    }
    // 有下级
    else {
      const ids = row.children.map((o) => o.id);
      // ids 中被选中的元素
      const inners = intersection(checked, ids);
      return inners.length === ids.length;
    }
  };

  // 判断是否选择一部分
  const isIndeterminate = () => {
    // 没有下级
    if (!row?.children || row.children.length === 0) {
      return false;
    }
    // 有下级
    else {
      const ids = row.children.map((o) => o.id);
      // ids 中被选中的元素
      const inners = intersection(checked, ids);
      // 空值就是false
      if (inners.length === 0) {
        return false;
      }
      // 不等就是对的
      return inners.length !== ids.length;
    }
  };

  return (
    <div
      className={cx('tx-virtual-table__row', rowClass)}
      style={{ height: rowHeight }}
      onClick={(event) => rowClick?.({ event, index, row })}
    >
      {canDragSortRow && (
        <DragRowHandle
          isDragging={isDragging}
          dragRowIcon={dragRowIcon}
          {...attributes}
          {...listeners}
        />
      )}
      {!isScrolling && canChecked && (
        <IndeterminateCheckbox
          indeterminate={isIndeterminate()}
          checked={isChecked()}
          onClick={() => handleCheckBox(row, checked, setChecked)}
        />
      )}
      {isScrolling
        ? scrollingRender?.(index + 1)
        : columns.map((item, idx) => {
            const style: { [key: string]: number | string } = {
              width: item?.width,
            };
            if (!dragOverlay) {
              if (idx < fixedLeftCount) {
                style['left'] = getLeftWidth(idx);
              }
              if (idx > labels.length - fixedRightCount - 1) {
                style['right'] = getRightWidth(idx);
              }
              if (idx === fixedLeftCount - 1) {
                style['boxShadow'] = '2px 0 4px 0 #eee';
              }
              if (idx === labels.length - fixedRightCount) {
                style['boxShadow'] = '-2px 0 4px 0 #eee';
              }
            }

            return (
              <div
                className={cx('tx-virtual-table__row__cell_wrapper', {
                  relative: !dragOverlay,
                  'text-center': textLayout === 'center',
                  'tx-virtual-table__row__cell_wrapper--left': !dragOverlay && idx < fixedLeftCount,
                  'tx-virtual-table__row__cell_wrapper--right':
                    !dragOverlay && idx > labels.length - fixedRightCount - 1,
                  'tx-virtual-table__row__cell_wrapper__drag': dragOverlay,
                })}
                style={style}
                key={idx}
              >
                {item?.cellRenders(row, index)}
              </div>
            );
          })}
    </div>
  );
};

export default TableRow;
