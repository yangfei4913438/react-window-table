import React, { type CSSProperties, Dispatch, useContext } from 'react';
import { VirtualTableContext } from './consts';
import cx from 'classnames';
import IndeterminateCheckbox from './IndeterminateCheckbox';
import intersection from 'lodash/intersection';
import difference from 'lodash/difference';

interface TableRowProps<T> {
  style?: CSSProperties;
  rowClass?: string;
  index: number;
  isScrolling?: boolean;
  row: T;
  id: number;
}

const TableRow = <T extends { id: string; children?: { id: string }[] }>({
  style,
  rowClass,
  index,
  isScrolling,
  row,
  id,
}: TableRowProps<T>) => {
  const {
    textLayout,
    labels,
    realWidth,
    rowHeight,
    titleHeight,
    canChecked,
    checked,
    setChecked,
    scrollingRender,
    columns,
    headerList,
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
      className={cx(
        'inline-flex items-center border-b border-b-[#eee] bg-white hover:bg-[#f6f6f6]',
        rowClass
      )}
      style={{
        ...style,
        top:
          id * rowHeight + (headerList.length > 0 ? headerList.length * titleHeight : titleHeight),
        width: realWidth,
      }}
      onClick={(event) => rowClick?.({ event, index, row })}
    >
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

            return (
              <div
                className={cx('relative flex h-full flex-col justify-center overflow-hidden', {
                  'text-center': textLayout === 'center',
                  'sticky left-0 z-50 bg-inherit': idx < fixedLeftCount,
                  'sticky right-0 z-50 bg-inherit': idx > labels.length - fixedRightCount - 1,
                })}
                style={style}
                key={idx}
              >
                {item?.cellRenders(row, id)}
              </div>
            );
          })}
    </div>
  );
};

export default TableRow;
