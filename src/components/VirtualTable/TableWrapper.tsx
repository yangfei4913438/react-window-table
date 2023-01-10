import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import cx from 'classnames';
import { uniq } from 'lodash';
import { forwardRef, useContext, useMemo, type HTMLProps, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

import { checkBoxWidth, dragIconWidth, VirtualTableContext, type IHeaderTree, type IWidths } from './consts';
import DragRows from './DragRows';
import IndeterminateCheckbox from './IndeterminateCheckbox';
import TableHead from './TableHead';

const TableWrapper = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(({ children, ...rest }, ref) => {
  const {
    list,
    fixedLeftCount,
    fixedRightCount,
    titleHeight,
    columns,
    labels,
    changeLabels,
    widths,
    changeWidths,
    headerClass,
    canDragSortColumn,
    canDragSortRow,
    canChecked,
    checked,
    setChecked,
    realWidth,
    getLeftWidth,
    getRightWidth,
    headerList,
    headRenders,
    headerTrees,
    headerColumnWidth,
    wrapperClass,
    wrapperStyle,
    colResizing,
    realHeight,
    disableScroll,
    emptyNode,
    activeLabel,
    setActiveLabel,
  } = useContext(VirtualTableContext);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const getIndex = (label: string) => labels.indexOf(label);
  const activeIndex = activeLabel ? getIndex(activeLabel) : -1;

  const getMoreWidth = useMemo(() => {
    if (canChecked && !canDragSortRow) {
      return checkBoxWidth;
    } else if (!canChecked && canDragSortRow) {
      return dragIconWidth;
    } else if (canChecked && canDragSortRow) {
      return dragIconWidth + checkBoxWidth;
    } else {
      return 0;
    }
  }, [canChecked, canDragSortRow]);

  const allIds = uniq(
    list
      .map((o) => {
        if (!o?.children || o.children.length === 0) {
          return o.id;
        } else {
          return o.children.map((r: { id: any }) => r.id);
        }
      })
      .flat()
  );

  const handleAllChecked = () => {
    if (checked.length === 0 || (checked.length > 0 && checked.length !== allIds.length)) {
      // 获取全部的id
      setChecked(allIds);
    } else {
      setChecked([]);
    }
  };

  // 判断两个标题列，是否属于同一个父列
  const sameParent = (source: string, target: string) => {
    // 定义变量，接收检查结果
    let result = false;
    // 检查方法
    const check = (rows: IHeaderTree[]) => {
      rows.forEach((row) => {
        if (row.children) {
          const list = row.children.map((o) => o.label);
          if (list.includes(source) && list.includes(target)) {
            result = true;
          } else {
            check(row.children);
          }
        }
      });
    };
    // 执行检查
    check(headerTrees);
    // 返回结果
    return result;
  };

  // 表头列拖拽响应
  const headDrag = ({ over, active }: DragOverEvent | DragEndEvent) => {
    if (!over) return;
    // 如果标题存在树形关系，需要检查是否属于同一个父对象
    if (headerTrees.length) {
      const res = sameParent(String(active.id), String(over.id));
      if (!res) return;
    }
    const overIndex = getIndex(String(over.id));
    if (activeIndex !== overIndex) {
      // 交换 label 元素的位置
      const arr = arrayMove(labels, activeIndex, overIndex);
      // 更新label
      changeLabels?.(arr);
      // 新的宽度
      const widthObj: IWidths = {};
      arr.forEach((label) => {
        widthObj[label] = widths[label];
      });
      // 更新宽度
      changeWidths?.(widthObj);
    }
  };

  // 高度样式
  const heightStyle = list.length > 0 && disableScroll ? { height: realHeight } : {};

  // 继承来的样式
  const parentStyle = useMemo(() => {
    const { height, ...params } = rest.style as CSSProperties;
    return list.length === 0 ? { ...params, height: '100%' } : rest.style;
  }, [list.length, rest.style]);

  return (
    <div
      ref={ref}
      {...rest}
      role="table"
      aria-busy={activeLabel ? 'true' : undefined}
      className={cx(
        'flex flex-col',
        wrapperClass,
        activeLabel && 'pointer-events-none',
        colResizing && 'children:pointer-events-none cursor-ew-resize'
      )}
      style={{
        ...parentStyle,
        ...wrapperStyle,
        ...heightStyle,
      }}
    >
      {/* multiTitle */}
      {headerList.map((cols, idx) => {
        if (idx === headerList.length - 1) return;
        return (
          <div
            role="row"
            className={cx('sticky z-4 flex items-center border-b border-b-secondary bg-body', headerClass)}
            style={{
              width: realWidth,
              height: titleHeight,
              top: idx * titleHeight,
            }}
            key={idx}
          >
            <div role="columnheader" className="h-full" style={{ width: getMoreWidth }} />
            {cols.map((col, idx2) => {
              return (
                <>
                  <div
                    role="columnheader"
                    className="relative flex h-full items-center justify-center bg-body px-3"
                    key={col}
                    style={{ width: headerColumnWidth(col) + 8 }}
                  >
                    {headRenders[col]}
                  </div>
                  {idx2 !== cols.length - 1 && <div role="separator" className="h-full w-px bg-light-100" />}
                </>
              );
            })}
          </div>
        );
      })}

      {/* header */}
      <div
        role="row"
        aria-busy={activeLabel ? 'true' : undefined}
        className={cx(
          'group/table-header sticky z-4 flex items-center border-b border-b-secondary bg-white',
          headerClass
        )}
        style={{
          top: headerTrees.length && (headerList.length - 1) * titleHeight,
          height: titleHeight,
          width: realWidth,
        }}
      >
        {/* 渲染表头 */}
        <DndContext
          id={'table'}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={({ active }) => {
            if (!active) return;
            setActiveLabel(String(active.id));
          }}
          onDragOver={headDrag}
          onDragEnd={(event) => {
            headDrag(event);
            // 清理数据
            setActiveLabel(null);
          }}
          onDragCancel={() => setActiveLabel(null)}
        >
          <SortableContext items={list} strategy={horizontalListSortingStrategy}>
            {canDragSortRow && (
              <div
                role="columnheader"
                className={cx('sticky left-0 z-2 flex h-full items-center bg-white')}
                style={{ minWidth: dragIconWidth }}
              />
            )}
            {canChecked && (
              <IndeterminateCheckbox
                value="all_data"
                indeterminate={checked.length > 0 && checked.length !== allIds.length}
                checked={checked.length > 0 && checked.length === allIds.length}
                onClick={() => handleAllChecked()}
              />
            )}
            {columns.map((item, idx) => {
              const style: { [key: string]: number | string } = {
                width: item.width,
              };
              if (idx < fixedLeftCount!) {
                style['left'] = getLeftWidth(idx);
                style['box-shadow'] = '1px 0 0 0 #eee';
              }
              if (idx > labels.length - fixedRightCount! - 1) {
                style['right'] = getRightWidth(idx);
                style['box-shadow'] = '-1px 0 0 0 #eee';
              }

              return (
                <div
                  role="columnheader"
                  className={cx(
                    'flex h-full items-center truncate bg-white',
                    {
                      'sticky left-0 z-2 group-data-[horizontal-scroll]/table:z-3 group-data-[horizontal-scroll]/table:bg-white':
                        idx < fixedLeftCount!,
                    },
                    {
                      'sticky right-0 z-2': idx > labels.length - fixedRightCount! - 1,
                    }
                  )}
                  style={style}
                  key={idx}
                >
                  <TableHead id={item.dataKey} key={item.dataKey}>
                    {item.headRenders[item.dataKey]}
                  </TableHead>
                </div>
              );
            })}
          </SortableContext>
          {
            // 拖拽对象渲染å
            canDragSortColumn &&
              createPortal(
                <DragOverlay adjustScale={false}>
                  {activeLabel && (
                    <TableHead id={labels[activeIndex]} key={labels[activeIndex]} dragOverlay>
                      {columns.filter((o) => o.dataKey === labels[activeIndex])[0]?.headRenders[labels[activeIndex]]}
                    </TableHead>
                  )}
                </DragOverlay>,
                document.body
              )
          }
        </DndContext>
      </div>

      {/* empty */}
      {list.length === 0 ? (
        <div
          className="flex flex-1 items-center justify-center"
          style={{
            width: realWidth,
          }}
        >
          {emptyNode}
        </div>
      ) : (
        <DragRows>{children}</DragRows>
      )}
    </div>
  );
});

TableWrapper.displayName = 'TableWrapper';

export default TableWrapper;
