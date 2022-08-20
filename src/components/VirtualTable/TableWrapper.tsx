import { useContext, useState, forwardRef, type HTMLProps } from 'react';
import { createPortal } from 'react-dom';
import cx from 'classnames';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';

import TableHead from './TableHead';
import IndeterminateCheckbox from './IndeterminateCheckbox';
import { type IHeaderTree, type IWidths, VirtualTableContext, checkBoxWidth } from './consts';
import TableRow from './TableRow';

const TableWrapper = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  ({ children, ...rest }, ref) => {
    const {
      list,
      fixedTopCount,
      fixedLeftCount,
      fixedRightCount,
      titleHeight,
      rowHeight,
      columns,
      rowClass,
      labels,
      changeLabels,
      widths,
      changeWidths,
      headerClass,
      canDragSortColumn,
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
    } = useContext(VirtualTableContext);

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
    const [activeLabel, setActiveLabel] = useState<string | null>(null);
    const getIndex = (label: string) => labels.indexOf(label);
    const activeIndex = activeLabel ? getIndex(activeLabel) : -1;

    const handleAllChecked = () => {
      if (checked.length !== list.length) {
        // 获取全部的索引
        const arr = Array.from({ length: list.length }, (_, idx) => idx);
        setChecked(() => arr);
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

    return (
      <div ref={ref} {...rest}>
        {headerList.map((cols, idx) => {
          if (idx === headerList.length - 1) return;
          return (
            <div
              className={cx(
                'flex items-center bg-[#f8f8f8] border-b border-b-[#eee] sticky',
                headerClass
              )}
              style={{
                zIndex: 51,
                width: realWidth,
                height: titleHeight,
                top: idx * titleHeight,
              }}
              key={idx}
            >
              <div style={{ width: canChecked ? checkBoxWidth : 0 }} />
              {cols.map((col, idx2) => {
                return (
                  <div
                    className={cx('overflow-hidden relative flex justify-center')}
                    key={col}
                    style={{ width: headerColumnWidth(col) + 8 }}
                  >
                    {headRenders[col]}
                    {idx2 !== cols.length - 1 && (
                      <div className="absolute right-0 h-[50%] top-[25%] w-0 border-r border-solid border-gray-500" />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
        <div
          className={cx(
            'flex items-center bg-[#f8f8f8] border-b border-b-[#eee] sticky',
            headerClass
          )}
          style={{
            zIndex: 51,
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
            onDragEnd={({ over, active }) => {
              if (!over) return;
              // 如果标题存在树形关系，需要检查是否属于同一个父对象
              if (headerTrees.length) {
                const res = sameParent(String(active.id), String(over.id));
                if (!res) return;
              }
              // 这里是异步执行的，所以不影响后面的代码执行。
              setActiveLabel(null);
              const overIndex = getIndex(String(over.id));
              if (activeIndex !== overIndex) {
                // 交换 label 元素的位置
                const arr = arrayMove(labels, activeIndex, overIndex);
                // 更新label
                changeLabels(arr);
                // 新的宽度
                const widthObj: IWidths = {};
                arr.forEach((label) => {
                  widthObj[label] = widths[label];
                });
                // 更新宽度
                changeWidths(widthObj);
              }
            }}
            onDragCancel={() => setActiveLabel(null)}
          >
            <SortableContext items={list} strategy={horizontalListSortingStrategy}>
              {canChecked && (
                <IndeterminateCheckbox
                  indeterminate={checked.length > 0 && checked.length !== list.length}
                  checked={checked.length === list.length && list.length > 0}
                  onClick={() => handleAllChecked()}
                />
              )}
              {columns.map((item, idx) => {
                const style: { [key: string]: number | string } = {
                  width: item.width,
                };
                if (idx < fixedLeftCount!) {
                  style['left'] = getLeftWidth(idx);
                }
                if (idx > labels.length - fixedRightCount! - 1) {
                  style['right'] = getRightWidth(idx);
                }
                if (idx === fixedLeftCount! - 1) {
                  style['boxShadow'] = '2px 0 4px 0px #eee';
                }
                if (idx === labels.length - fixedRightCount!) {
                  style['boxShadow'] = '-2px 0 4px 0 #eee';
                }

                return (
                  <div
                    className={cx('overflow-hidden relative h-full flex flex-col justify-center', {
                      'sticky z-50 left-0 bg-inherit': idx < fixedLeftCount!,
                      'sticky z-50 right-0 bg-inherit': idx > labels.length - fixedRightCount - 1,
                    })}
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
              // 拖拽对象渲染
              canDragSortColumn &&
                createPortal(
                  <DragOverlay>
                    {activeLabel && (
                      <TableHead id={labels[activeIndex]} key={labels[activeIndex]} dragOverlay>
                        {
                          columns.filter((o) => o.dataKey === labels[activeIndex])[0]?.headRenders[
                            labels[activeIndex]
                          ]
                        }
                      </TableHead>
                    )}
                  </DragOverlay>,
                  document.body
                )
            }
          </DndContext>
        </div>
        <div
          className="sticky"
          style={{
            zIndex: 51,
            top: headerTrees.length ? headerList.length * titleHeight : titleHeight,
            width: realWidth,
            boxShadow: '0 2px 4px 0 #eee',
          }}
        >
          {list.slice(0, fixedTopCount).map((row, index) => {
            return (
              <TableRow
                row={row}
                rowClass={rowClass(index)}
                style={{ top: index * rowHeight, height: rowHeight }}
                index={index}
                key={index}
                id={index}
              />
            );
          })}
        </div>
        {children}
      </div>
    );
  }
);

TableWrapper.displayName = 'TableWrapper';

export default TableWrapper;
