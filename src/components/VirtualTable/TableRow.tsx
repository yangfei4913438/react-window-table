import { type FC, type CSSProperties, useContext } from 'react';
import { VirtualTableContext } from './consts';
import cx from 'classnames';
import IndeterminateCheckbox from './IndeterminateCheckbox';
import { handleCheckBox } from './checkboxHelper';

interface TableRowProps<T> {
  style?: CSSProperties;
  rowClass?: string;
  index: number;
  isScrolling?: boolean;
  row: T;
  id: number;
}

const TableRow: FC<TableRowProps<any>> = <T,>({
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
      onClick={(e) => rowClick(e, id)}
    >
      {!isScrolling && canChecked && (
        <IndeterminateCheckbox
          checked={checked.includes(id)}
          onClick={() => handleCheckBox(id, checked, setChecked)}
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
                  'bg-inherit sticky left-0 z-50': idx < fixedLeftCount,
                  'bg-inherit sticky right-0 z-50': idx > labels.length - fixedRightCount - 1,
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
