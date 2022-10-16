import React, { useContext } from 'react';
import { createPortal } from 'react-dom';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  type DragStartEvent,
  type DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';
import { FixedSizeList, type ListChildComponentProps } from 'react-window';

import { VirtualTableContext } from './consts';
import DragRowsItem from './DragRowsItem';
import TableRow from './TableRow';

interface DragRowsProps {
  children: React.ReactNode;
}

const DragRows = ({ children }: DragRowsProps) => {
  const {
    list,
    setList,
    groups,
    setGroups,
    fixedTopCount,
    titleHeight,
    rowClass,
    realWidth,
    headerList,
    headerTrees,
    canDragSortRow,
    activeRow,
    setActiveRow,
    rowHeight,
  } = useContext(VirtualTableContext);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      // Disable smooth scrolling in Cypress automated tests
      scrollBehavior: 'Cypress' in window ? 'auto' : undefined,
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 获取行数据
  const getRow = (id: UniqueIdentifier) => {
    for (const item of list) {
      if (item.id === id) {
        return {
          ...item,
          parent_id: null,
        };
      }
      if (item?.children && item.children.length > 0) {
        for (const item2 of item.children) {
          if (item2.id === id) {
            return {
              ...item2,
              parent_id: item.id,
            };
          }
        }
      }
    }
  };

  // 可见列表的所有id
  const allRenderIds = list.map((o) => o.id);

  // 响应拖拽开始操作
  const handleDragStart = ({ active }: DragStartEvent) => {
    if (!active) return;
    const row = getRow(active.id);
    setActiveRow(row);
  };

  // 响应拖拽结束操作(这里不要使用over响应，否则动画会很难看。)
  // 注意：
  //    只有展开的目录，才能放东西进去，没展开的不能放进去。
  const handleDragEnd = ({ over, active }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    // 目的对象
    const row = getRow(over.id);

    // 取出实时渲染的索引
    const sourceIndex = allRenderIds.indexOf(active.id);
    const targetIndex = allRenderIds.indexOf(over.id);

    // 判断目标目录有没有展开
    const targetOpen = Object.keys(groups!).includes(row.id);
    // 判断当前的有没有展开
    const sourceOpen = Object.keys(groups!).includes(activeRow.id);

    // 拖拽对象是一级普通元素
    const sourceIsFirstLevelObject = !activeRow.parent_id && !activeRow.children;
    // 拖拽对象是二级普通元素
    const sourceIsSecondLevelObject = activeRow.parent_id && !activeRow.children;
    // 目标对象是一级普通元素
    const targetIsFirstLevelObject = !row.parent_id && !row.children;
    // 目标对象是二级普通元素
    const targetIsSecondLevelObject = row.parent_id && !row.children;

    // 拖拽的是没展开的目录
    const sourceIsDirClose = !activeRow.parent_id && activeRow.children && !sourceOpen;
    // 拖拽的是展开的目录
    const sourceIsDirOpen = !activeRow.parent_id && activeRow.children && sourceOpen;

    // 目标是没展开的目录
    const targetIsDirClose = !row.parent_id && row.children && !targetOpen;
    // 目标是展开的目录
    const targetIsDirOpen = !row.parent_id && row.children && targetOpen;

    // 拖拽对象是否在目标对象的下面
    const inNext = sourceIndex > targetIndex;

    // 相同目录下的交换
    const sameParent = (arr: typeof activeRow[]) => {
      const tmpArr = arr.map((item) => {
        // 进入目录，这里是看不到的数据，用于保证每次展示都对
        if (item.id === row.parent_id) {
          const sourceIndex = item.children.map((o: any) => o.id).indexOf(active.id);
          const targetIndex = item.children.map((o: any) => o.id).indexOf(over.id);
          // 交换数据
          const newArr = arrayMove(item.children, sourceIndex, targetIndex);
          // 如果存在分组就更新分组内部
          if (Object.keys(groups!).includes(row.parent_id)) {
            setGroups?.((prevState) => {
              return {
                ...prevState,
                [row.parent_id]: newArr,
              };
            });
          }
          // 返回数据
          return {
            ...item,
            children: newArr,
          };
        }
        // 其他目录返回
        return item;
      });
      // 完成外部数据更新 -- 这里才是你看到的数据
      return arrayMove(tmpArr, sourceIndex, targetIndex);
    };

    // 相同目录下的两个子元素切换
    if (
      !!row.parent_id &&
      !!activeRow.parent_id &&
      row.parent_id === activeRow.parent_id &&
      !row.children &&
      !activeRow.children
    ) {
      // 更新列表数据
      setList?.(sameParent(list));
      return;
    }

    // 一级元素对象 移动到 一级元素对象
    // 一级元素对象 移动到 未展开的目录
    // 未展开的目录 移动到 一级元素对象
    // 未展开的目录 移动到 未展开的目录
    if (
      (sourceIsFirstLevelObject && targetIsFirstLevelObject) ||
      (sourceIsFirstLevelObject && targetIsDirClose) ||
      (sourceIsDirClose && targetIsFirstLevelObject) ||
      (sourceIsDirClose && targetIsDirClose)
    ) {
      setList?.(arrayMove(list, sourceIndex, targetIndex));
      return;
    }

    // 将对象放到和目标相同的数组中去（目标不是目录）
    const insertIntoTarget = (arr: typeof activeRow[] = list) => {
      return arr.map((item) => {
        // 找到目标对象，往里面加
        if (item.id === row.parent_id) {
          // 目标对象的二级索引
          const targetIndex = item.children.map((o: any) => o.id).indexOf(over.id);
          // 插入数据
          if (inNext) {
            item.children.splice(targetIndex - 1, 0, activeRow);
          } else {
            item.children.splice(targetIndex, 0, activeRow);
          }
          // 如果存在分组就更新分组内部
          if (Object.keys(groups!).includes(row.parent_id)) {
            setGroups?.((prevState) => {
              return {
                ...prevState,
                [row.parent_id]: item.children,
              };
            });
          }
        }
        return item;
      });
    };

    // 普通对象到目录里面
    if (sourceIsFirstLevelObject && targetIsSecondLevelObject) {
      // 处理数据
      setList?.(arrayMove(insertIntoTarget(), sourceIndex, targetIndex));
      // 处理完返回
      return;
    }

    // 将对象放入到目标列表中，同时更新分组数据，返回新的数组（目标是一个目录）
    const insertIntoTargetDir = (arr: typeof activeRow[] = list) => {
      return arr.map((item) => {
        // 找到目标对象，往里面加
        if (item.id === row.id) {
          // 插入最前面
          item.children.unshift(activeRow);
          // 如果存在分组就更新分组内部
          if (Object.keys(groups!).includes(row.id)) {
            // 更新分组内部
            setGroups?.((prevState) => {
              return {
                ...prevState,
                [row.id]: item.children,
              };
            });
          }
        }
        return item;
      });
    };

    // 一级元素对象 移动到 展开的目录（上面，下面）
    if (sourceIsFirstLevelObject && targetIsDirOpen) {
      // 下面来的放到上面
      if (inNext) {
        // 直接交换位置
        setList?.(arrayMove(list, sourceIndex, targetIndex));
        return;
      }
      // 上面下去的，放到数组的第一个
      else {
        // 处理数据
        setList?.(arrayMove(insertIntoTargetDir(), sourceIndex, targetIndex));
        // 处理完返回
        return;
      }
    }

    // 清理拖拽元素所属的对象，返回一个新的数组，同时更新分组数据
    const cleanDragParent = () => {
      return list.map((item) => {
        // 注意是拖拽对象
        if (item.id === activeRow.parent_id) {
          // 移除数据
          item.children = item.children.filter((o: any) => o.id !== activeRow.id);
          // 如果存在分组就更新分组内部
          if (Object.keys(groups!).includes(activeRow.parent_id)) {
            // 更新分组内部
            setGroups?.((prevState) => {
              return {
                ...prevState,
                [activeRow.parent_id]: item.children,
              };
            });
          }
        }
        return item;
      });
    };

    // 第二层子元素 移动到 一级元素对象
    // 第二层子元素 移动到 未展开的目录
    if (sourceIsSecondLevelObject && (targetIsFirstLevelObject || targetIsDirClose)) {
      // 处理数据
      setList?.(arrayMove(cleanDragParent(), sourceIndex, targetIndex));
      // 处理完返回
      return;
    }

    // 展开目录的子元素，跟随目录对象移动
    const moveChildren = (
      arr: typeof activeRow[],
      dirObj: typeof activeRow
    ): typeof activeRow[] => {
      // 如果下级没有子元素了，就不用处理
      if (dirObj.children.length === 0) {
        return arr;
      }
      // 找到旧的子元素开始的索引(第一个子元素的索引)
      const startIndex = arr.map((o) => o.id).indexOf(dirObj.children[0].id);
      // 删除展开的子元素（移动之前的）
      arr.splice(startIndex, dirObj.children.length);
      // 重新获取拖拽目录的索引
      const newDirIndex = arr.map((o) => o.id).indexOf(dirObj.id);
      // 重新添加子元素到目录下面
      arr.splice(newDirIndex + 1, 0, ...dirObj.children);
      // 返回新的数组
      return arr;
    };

    // 展开目录到普通对象
    if (sourceIsDirOpen && targetIsFirstLevelObject) {
      // 第一部切换位置
      let tmpArr = arrayMove(list, sourceIndex, targetIndex);
      // 处理拖拽目录的下级数据
      tmpArr = moveChildren(tmpArr, activeRow);
      // 更新列表数据
      setList?.(tmpArr);
      // 处理完返回
      return;
    }

    // 获取下个目录的索引
    const getNextDirIndex = (arr: typeof activeRow[], startIndex: number): number => {
      // 检查是从下一个元素开始的。
      const checkIndex = startIndex + 1;
      // 判断是不是目录
      // 是目录的情况
      if (arr[checkIndex]?.children) {
        return checkIndex;
      }
      // 递归处理
      return getNextDirIndex(arr, checkIndex);
    };

    // 获取上个目录的索引
    const getPrevDirIndex = (arr: typeof activeRow[], startIndex: number): number => {
      // 检查是从上一个元素开始的。
      const checkIndex = startIndex - 1;
      // 判断是不是目录
      // 是目录的情况
      if (arr[checkIndex]?.children) {
        return checkIndex;
      }
      // 递归处理
      return getPrevDirIndex(arr, checkIndex);
    };

    // 如果拖拽对象是一个目录
    if (activeRow?.children) {
      // 判断拖拽目录有没有展开
      const sourceOpen = Object.keys(groups!).includes(activeRow.id);
      // 如果拖拽目录没有展开
      if (!sourceOpen) {
        // 目标对象是子元素的情况下
        if (!row?.children) {
          // 如果是在下面
          if (inNext) {
            // 取出子元素的父元素的实时渲染索引
            const dirIndex = allRenderIds.indexOf(row.parent_id);
            // 更新列表数据
            setList?.(arrayMove(list, sourceIndex, dirIndex));
            return;
          }
          // 拖拽目录在目标子元素的上面
          else {
            // 下一个目录的索引
            const nextDirIndex = getNextDirIndex(list, targetIndex);
            // 更新列表数据
            setList?.(arrayMove(list, sourceIndex, nextDirIndex - 1));
            return;
          }
        }
        // 是目录的情况下(这里的肯定是已经展开的目录，没展开的已经在上面处理过了)
        else {
          // 如果是在下面
          if (inNext) {
            // 更新列表数据
            setList?.(arrayMove(list, sourceIndex, targetIndex));
            return;
          }
          // 拖拽目录在目标子元素的上面
          else {
            // 下一个目录的索引
            const nextDirIndex = getNextDirIndex(list, targetIndex);
            // 更新列表数据
            setList?.(arrayMove(list, sourceIndex, nextDirIndex - 1));
            return;
          }
        }
      }
      // 如果拖拽目录是展开的
      else {
        // 目标对象是子元素
        if (!row?.children) {
          // 如果目标子元素的父级是自己，直接返回不处理
          if (row.parent_id === activeRow.id) return;

          // 新的数据接收变量
          let newArr: typeof activeRow[];
          // 目录在子元素下面
          if (inNext) {
            // 上一个目录的索引
            const prevIndex = getPrevDirIndex(list, targetIndex);
            // 生成新的数据
            newArr = arrayMove(list, sourceIndex, prevIndex);
          }
          // 目录在子元素上面
          else {
            // 下一个目录的索引
            const nextDirIndex = getNextDirIndex(list, targetIndex);
            // 生成新的数据
            newArr = arrayMove(list, sourceIndex, nextDirIndex - 1);
          }
          // 处理拖拽目录的下级数据
          newArr = moveChildren(newArr, activeRow);
          // 更新列表数据
          setList!(newArr);
          return;
        }
        // 目标对象是目录
        else {
          // 判断目标目录有没有展开
          const targetOpen = Object.keys(groups!).includes(row.id);
          // 目标对象是没有展开的目录
          // --- 这种情况不用判断，拖拽对象是从上面还是从下面过来的。
          if (!targetOpen) {
            // 直接移动到目标的上面
            let newArr = arrayMove(list, sourceIndex, targetIndex);
            // 处理子元素
            newArr = moveChildren(newArr, activeRow);
            // 更新列表数据
            setList!(newArr);
            return;
          }
          // 目标对象是已经展开的目录
          else {
            // 如果是在目标的下面上来的
            if (inNext) {
              // 生成新的数据
              let newArr = arrayMove(list, sourceIndex, targetIndex);
              // 处理子元素
              newArr = moveChildren(newArr, activeRow);
              // 更新列表数据
              setList!(newArr);
              return;
            }
            // 如果是从目标目录的上面下来的。
            else {
              // 下一个目录的索引
              const nextDirIndex = getNextDirIndex(list, targetIndex);
              // 生成新的数据
              let newArr = arrayMove(list, sourceIndex, nextDirIndex - 1);
              // 处理子元素
              newArr = moveChildren(newArr, activeRow);
              // 更新列表数据
              setList!(newArr);
              return;
            }
          }
        }
      }
    }
    // 如果拖拽对象是一个子元素
    else {
      // 目标是一个子元素 -- 肯定是不同目录下的子元素，相同目录的上面已经处理了。
      if (!row?.children) {
        // 先把拖拽数据从来源移除，再把拖拽数据插入目标, 最后更新数据
        setList?.(arrayMove(insertIntoTarget(cleanDragParent()), sourceIndex, targetIndex));
        // 处理完成返回
        return;
      }
      // 目标是一个目录（这里只能是展开的目录，没展开的已经在上面被处理了）
      else {
        // 如果子元素属于该目录, 或者对象是从下面上来的，就直接扔到上面
        if (activeRow.parent_id === row.id || inNext) {
          // 处理数据
          setList?.(arrayMove(cleanDragParent(), sourceIndex, targetIndex));
          // 处理完成返回
          return;
        }
        // 从上面下来的
        // 先把拖拽数据从来源移除，再把拖拽数据插入目标, 最后更新数据
        setList?.(arrayMove(insertIntoTargetDir(cleanDragParent()), sourceIndex, targetIndex));
        // 处理完成返回
        return;
      }
    }
  };

  return (
    <DndContext
      id="table-row"
      sensors={sensors}
      modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={(event) => {
        handleDragEnd(event);
        // 清空数据
        setActiveRow(null);
      }}
      onDragCancel={() => setActiveRow(null)}
    >
      <SortableContext items={list} strategy={verticalListSortingStrategy}>
        <div
          className="tx-virtual-table__fixed-top"
          style={{
            top: headerTrees.length ? headerList.length * titleHeight : titleHeight,
            width: realWidth,
          }}
        >
          <FixedSizeList
            style={{ overflow: 'unset' }}
            itemData={list.slice(0, fixedTopCount)}
            itemCount={fixedTopCount}
            height={fixedTopCount * rowHeight}
            width={realWidth}
            itemSize={rowHeight}
          >
            {(props: ListChildComponentProps) => {
              const { data, index, style, isScrolling } = props;
              const row = data[index];
              return (
                <DragRowsItem
                  row={row}
                  rowClass={rowClass?.({ index, row })}
                  style={style}
                  index={index}
                  isScrolling={isScrolling}
                  key={row.id ?? String(index)}
                />
              );
            }}
          </FixedSizeList>
        </div>
        <div className="tx-virtual-table__body">{children}</div>
      </SortableContext>
      {canDragSortRow &&
        activeRow &&
        createPortal(
          <DragOverlay>
            <div className="tx-virtual-table__row--drag">
              <TableRow
                row={activeRow}
                index={list.map((o) => o.id).indexOf(activeRow.id)}
                isDragging
                dragOverlay
              />
            </div>
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
};

export default DragRows;
