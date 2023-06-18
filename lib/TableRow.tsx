import { DraggableAttributes } from '@dnd-kit/core/dist/hooks/useDraggable';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import cx from 'classnames';
import { difference, intersection } from 'lodash-es';
import { useContext, useMemo } from 'react';

import { ListType, VirtualTableContext } from './consts';
import DragRowHandle from './DragRowHandle';
import IndeterminateCheckbox from './IndeterminateCheckbox';

interface TableRowProps<T> {
  attributes?: DraggableAttributes;
  dragOverlay?: boolean;
  index: number;
  isDragging?: boolean;
  isOver?: boolean;
  isScrolling?: boolean;
  listeners?: SyntheticListenerMap;
  row: T;
}

const TableRow = <T extends ListType>({
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
    checked,
    setChecked,
    scrollingRender,
    columns,
    fixedLeftCount,
    fixedRightCount,
    getLeftWidth,
    getRightWidth,
    rowClick,
    rowClass,
    cellClass,
  } = useContext(VirtualTableContext);

  // 选中行
  const handleCheckBox = (row: T, checked: string[], setChecked: (arr: string[]) => void) => {
    // 没有下级
    if (!row?.children || row.children.length === 0) {
      if (checked.includes(row.id)) {
        const idx = checked.indexOf(row.id);
        const list1 = checked.slice(0, idx);
        const list2 = checked.slice(idx + 1, checked.length);
        setChecked(list1.concat(list2));
      } else {
        setChecked(checked.concat([row.id]));
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
        setChecked(checked.concat(ids));
      }
    }
  };

  // 判断是否选中
  const isChecked = useMemo(() => {
    // 没有下级
    if (!row?.children || row.children.length === 0) {
      return checked.includes(row.id);
    }
    // 有下级
    const ids = row.children.map((o) => o.id);
    // ids 中被选中的元素
    const inners = intersection(checked, ids);
    return inners.length === ids.length;
  }, [checked, row.children, row.id]);

  // 判断是否选择一部分
  const isIndeterminate = useMemo(() => {
    // 没有下级
    if (!row?.children || row.children.length === 0) {
      return false;
    }
    // 有下级
    const ids = row.children.map((o) => o.id);
    // ids 中被选中的元素
    const inners = intersection(checked, ids);
    // 空值就是false
    if (inners.length === 0) {
      return false;
    }
    // 不等就是对的
    return inners.length !== ids.length;
  }, [row?.children, checked]);

  return (
    <div
      className={cx(
        'group/row hover:bg-primary/3 inline-flex items-center bg-white',
        rowClass?.({ index, row }) || 'border-b-secondary border-b'
      )}
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
      <IndeterminateCheckbox
        order={index + 1}
        indeterminate={isIndeterminate}
        checked={isChecked}
        onClick={() => handleCheckBox(row, checked, setChecked)}
      />
      {isScrolling
        ? scrollingRender?.(index + 1)
        : columns.map((item, idx) => {
            const style: { [key: string]: number | string } = {
              width: item?.width,
            };
            if (!dragOverlay) {
              if (idx < fixedLeftCount) {
                style.left = getLeftWidth(idx);
                style['boxShadow'] = '1px 0 0 0 #eee';
              }
              if (idx > labels.length - fixedRightCount - 1) {
                style.right = getRightWidth(idx);
                style['boxShadow'] = '-1px 0 0 0 #eee';
              }
            }

            // cell
            return (
              <div
                role='cell'
                className={cx(
                  'flex h-full items-center bg-white px-3',
                  {
                    'justify-start': textLayout === 'left',
                    'justify-center': textLayout === 'center',
                    'justify-end': textLayout === 'right',
                  },
                  {
                    'sticky left-0 z-2 group-data-[horizontal-scroll]/table:z-3 group-data-[horizontal-scroll]/table:bg-white':
                      !dragOverlay && idx < fixedLeftCount,
                  },
                  {
                    'sticky right-0 z-2': !dragOverlay && idx > labels.length - fixedRightCount - 1,
                  },
                  {
                    'sticky z-2 bg-white': dragOverlay,
                  },
                  cellClass
                )}
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
