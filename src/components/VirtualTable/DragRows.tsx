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
import cx from 'classnames';
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
    realWidth,
    headerList,
    headerTrees,
    canDragSortRow,
    activeRow,
    setActiveRow,
    rowHeight,
    onDragRowEnd,
    dragRowsItemClassName,
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
  //    如果要改动这里，请注意处理逻辑的顺序，并执行相关的测试，不要随意改动测试顺序。
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

    // 目标是目录
    const targetIsDir = !row.parent_id && row.children;
    // 目标是没展开的目录
    const targetIsDirClose = !row.parent_id && row.children && !targetOpen;
    // 目标是展开的目录
    const targetIsDirOpen = !row.parent_id && row.children && targetOpen;

    // 拖拽对象是否在目标对象的下面
    const inNext = sourceIndex > targetIndex;

    // 上一个对象存在
    const prevObjExist = !!list[targetIndex - 1];
    // 目标对象的上一个
    const prevObj = prevObjExist ? getRow(list[targetIndex - 1].id) : {};
    // 上一个是目录
    const prevObjIsDir = prevObjExist && !prevObj?.parent_id && !!prevObj?.children;
    // 上一个是展开目录
    const prevObjIsOpenDir = prevObjIsDir && Object.keys(groups!).includes(prevObj.id);

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
            setGroups?.({
              ...groups,
              [row.parent_id]: newArr,
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

    type changeType = {
      origin: string; // 拖拽对象id
      target?: string; // 目标对象id
      action: 'after' | 'before' | 'into' | 'top' | 'bottom';
      // after 从上往下放
      // before 从下往上
      // into 目标是一个组id
      // top 置顶（暂时没用到）
      // bottom 置底（暂时没用到）
    };
    // 变更对象
    const change: changeType = { origin: activeRow.id, target: over.id as string } as changeType;

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

      if (inNext) {
        change['action'] = 'before';
      } else {
        change['action'] = 'after';
      }

      // 执行回掉
      onDragRowEnd(
        {
          row: activeRow,
          isGroup: false,
          index: sourceIndex,
        },
        {
          row,
          isGroup: false,
          index: targetIndex,
        },
        change
      );
      return;
    }

    // 一级元素对象 移动到 第一个对象的上面（这个行为只能是从下往上）
    // 一级元素对象 移动到 未展开的目录, 下面往上 且 上面是未展开的目录
    // 一级元素对象 移动到 未展开的目录，上面往下
    // 一级元素对象 移动到 展开的目录, 下面往上 且 上面是未展开的目录
    // 未展开的目录 移动到 一级元素对象
    // 未展开的目录 移动到 未展开的目录
    // 未展开的目录 到 展开目录的上面 , 从下往上
    if (
      (sourceIsFirstLevelObject && targetIndex === 0 && inNext) ||
      (sourceIsFirstLevelObject && targetIsDirClose && inNext && !prevObjIsOpenDir) ||
      (sourceIsFirstLevelObject && targetIsDirClose && !inNext) ||
      (sourceIsFirstLevelObject && targetIsDirOpen && inNext && !prevObjIsOpenDir) ||
      (sourceIsDirClose && targetIsFirstLevelObject) ||
      (sourceIsDirClose && targetIsDirClose) ||
      (sourceIsDirClose && targetIsDirOpen && inNext)
    ) {
      // 直接交换
      setList?.(arrayMove(list, sourceIndex, targetIndex));

      if (inNext) {
        change['action'] = 'before';
      } else {
        change['action'] = 'after';
      }

      // 执行回掉
      onDragRowEnd(
        {
          row: activeRow,
          isGroup: sourceIsDirOpen || sourceIsDirClose,
          index: sourceIndex,
        },
        {
          row,
          isGroup: targetIsDirClose || targetIsDirOpen,
          index: targetIndex,
        },
        change
      );
      // 处理完返回
      return;
    }

    // 将对象放入到目标列表中，同时更新分组数据，返回新的数组（目标是一个目录）
    const insertIntoTargetDir = (arr: typeof activeRow[] = list, target: typeof activeRow = row) => {
      return arr.map((item) => {
        // 找到目标对象，往里面加
        if (item.id === target.id) {
          // 插入最前面
          item.children.unshift(activeRow);
          // 如果存在分组就更新分组内部
          if (Object.keys(groups!).includes(target.id)) {
            // 更新分组内部
            setGroups?.({
              ...groups,
              [target.id]: item.children,
            });
          }
        }
        return item;
      });
    };

    // 一级元素对象 移动到 一级元素对象的上面, 从下往上
    // 一级元素对象 移动到 目录的上面(不论是否展开), 从下往上
    if (
      (sourceIsFirstLevelObject && targetIsFirstLevelObject && inNext) ||
      (sourceIsFirstLevelObject && targetIsDir && inNext)
    ) {
      // 判断目录的上一个对象，是否为展开的目录。
      if (prevObjIsOpenDir) {
        // 处理数据
        setList?.(arrayMove(insertIntoTargetDir(list, prevObj), sourceIndex, targetIndex));

        change.target = prevObj.id;
        change.action = 'into';

        // 执行回掉
        onDragRowEnd(
          {
            row: activeRow,
            isGroup: false,
            index: sourceIndex,
          },
          {
            row: prevObj,
            isGroup: true,
            index: targetIndex,
          },
          change
        );
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
            setGroups?.({
              ...groups,
              [activeRow.parent_id]: item.children,
            });
          }
        }
        return item;
      });
    };

    // 二级元素对象 移动到 一级元素对象的上面, 从下往上
    // 二级元素对象 移动到 目录的上面
    if (
      (sourceIsSecondLevelObject && targetIsDir && inNext) ||
      (sourceIsSecondLevelObject && targetIsFirstLevelObject && inNext)
    ) {
      // 目标目录是第一个元素
      if (targetIndex === 0) {
        // 处理数据
        setList?.(arrayMove(cleanDragParent(), sourceIndex, targetIndex));

        if (inNext) {
          change['action'] = 'before';
        } else {
          change['action'] = 'after';
        }

        // 执行回掉
        onDragRowEnd(
          {
            row: activeRow,
            isGroup: false,
            index: sourceIndex,
          },
          {
            row,
            isGroup: false,
            index: targetIndex,
          },
          change
        );
        // 处理完返回
        return;
      }

      // 查询上级对象
      // 判断目录的上一个对象，是否为展开的目录。
      if (prevObjIsOpenDir) {
        // 放到目标对象下
        // 处理数据
        setList?.(arrayMove(insertIntoTargetDir(cleanDragParent(), prevObj), sourceIndex, targetIndex));

        change.target = prevObj.id;
        change.action = 'into';

        // 执行回掉
        onDragRowEnd(
          {
            row: activeRow,
            isGroup: false,
            index: sourceIndex,
          },
          {
            row: prevObj,
            isGroup: true,
            index: targetIndex,
          },
          change
        );
        // 处理完返回
        return;
      }
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
            setGroups?.({
              ...groups,
              [row.parent_id]: item.children,
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

      if (inNext) {
        change['action'] = 'before';
      } else {
        change['action'] = 'after';
      }

      // 执行回掉
      onDragRowEnd(
        {
          row: activeRow,
          isGroup: false,
          index: sourceIndex,
        },
        {
          row,
          isGroup: false,
          index: targetIndex,
        },
        change
      );
      // 处理完返回
      return;
    }

    // 一级元素对象 移动到 展开的目录的下面
    if (sourceIsFirstLevelObject && targetIsDirOpen && !inNext) {
      // 处理数据
      setList?.(arrayMove(insertIntoTargetDir(), sourceIndex, targetIndex));

      change.action = 'into';

      // 执行回掉
      onDragRowEnd(
        {
          row: activeRow,
          isGroup: false,
          index: sourceIndex,
        },
        {
          row,
          isGroup: true,
          index: targetIndex,
        },
        change
      );
      // 处理完返回
      return;
    }

    // 第二层子元素 移动到 一级元素对象
    // 第二层子元素 移动到 未展开的目录
    if (sourceIsSecondLevelObject && (targetIsFirstLevelObject || targetIsDirClose)) {
      // 处理数据
      setList?.(arrayMove(cleanDragParent(), sourceIndex, targetIndex));

      if (inNext) {
        change['action'] = 'before';
      } else {
        change['action'] = 'after';
      }

      // 执行回掉
      onDragRowEnd(
        {
          row: activeRow,
          isGroup: false,
          index: sourceIndex,
        },
        {
          row,
          isGroup: targetIsDirClose || targetIsDirOpen,
          index: targetIndex,
        },
        change
      );
      // 处理完返回
      return;
    }

    // 展开目录的子元素，跟随目录对象移动
    const moveChildren = (arr: typeof activeRow[], dirObj: typeof activeRow): typeof activeRow[] => {
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

    // 获取上面第一层级对象的索引
    const getPrevFirstLevelIndex = (arr: typeof activeRow[], startIndex: number): number => {
      // 检查是从上一个元素开始的。
      const checkIndex = startIndex - 1;
      // 判断是不是第一层级的
      // 如果是目录
      if (arr[checkIndex]?.children) {
        return checkIndex;
      }
      // 如果是非目录
      // 判断上层是不是展开的
      const prevDirIndex = getPrevDirIndex(list, checkIndex);
      // 目录ID
      const dirId = list[prevDirIndex].id;
      // 如果是展开的目录
      const inGroups = Object.keys(groups!).includes(dirId);
      // 如果目录上分组的，判断对象是不是属于这个分组
      if (inGroups) {
        const ids: string[] = list[prevDirIndex].children.map((o: { id: any }) => o.id);
        // 如果在，说明这个对象是一个二级展开文件。就要继续往上找。
        if (list[checkIndex] && ids.includes(list[checkIndex].id)) {
          // 递归处理
          return getPrevFirstLevelIndex(arr, checkIndex);
        }
      }
      return checkIndex;
    };

    // 获取下面第一层级对象的索引
    const getNextFirstLevelIndex = (arr: typeof activeRow[], startIndex: number): number => {
      // 检查是从下一个元素开始的。
      const checkIndex = startIndex + 1;
      // 判断是不是第一层级的
      // 如果是目录
      if (arr[checkIndex]?.children) {
        return checkIndex;
      }
      // 如果是非目录
      // 判断上层目录是不是展开的
      const prevDirIndex = getPrevDirIndex(list, checkIndex);
      // 目录ID
      const dirId = list[prevDirIndex].id;
      // 如果是展开的目录
      const inGroups = Object.keys(groups!).includes(dirId);
      // 如果目录上分组的，判断对象是不是属于这个分组
      if (inGroups) {
        const ids: string[] = list[prevDirIndex].children.map((o: { id: any }) => o.id);
        // 如果在，说明这个对象是一个二级展开文件。就要继续往下找。
        if (list[checkIndex] && ids.includes(list[checkIndex].id)) {
          // 递归处理
          return getNextFirstLevelIndex(arr, checkIndex);
        }
      }
      // 返回索引
      return checkIndex;
    };

    // 展开目录 到 一级元素对象
    // 展开目录 到 未展开目录
    // 展开目录 到 展开目录, 从下往上
    if (
      (sourceIsDirOpen && targetIsFirstLevelObject) ||
      (sourceIsDirOpen && targetIsDirClose) ||
      (sourceIsDirOpen && targetIsDirOpen && inNext)
    ) {
      // 第一步切换位置
      let tmpArr = arrayMove(list, sourceIndex, targetIndex);
      // 处理拖拽目录的下级数据
      tmpArr = moveChildren(tmpArr, activeRow);
      // 更新列表数据
      setList?.(tmpArr);

      if (inNext) {
        change['action'] = 'before';
      } else {
        change['action'] = 'after';
      }

      onDragRowEnd(
        {
          row: activeRow,
          isGroup: true,
          index: sourceIndex,
        },
        {
          row,
          isGroup: targetIsDirClose || targetIsDirOpen,
          index: targetIndex,
        },
        change
      );
      // 处理完返回
      return;
    }

    // 展开目录 到 展开目录, 这里就是从上往下的。
    if (sourceIsDirOpen && targetIsDirOpen) {
      // 找到下面的第一个一级对象
      const nextFirstLevelIndex = getNextFirstLevelIndex(list, targetIndex);
      // 第一步切换位置
      let tmpArr = arrayMove(list, sourceIndex, nextFirstLevelIndex - 1);
      // 处理拖拽目录的下级数据
      tmpArr = moveChildren(tmpArr, activeRow);
      // 更新列表数据
      setList?.(tmpArr);

      change.target = list[nextFirstLevelIndex - 1].id;
      if (inNext) {
        change['action'] = 'before';
      } else {
        change['action'] = 'after';
      }

      onDragRowEnd(
        {
          row: activeRow,
          isGroup: true,
          index: sourceIndex,
        },
        {
          row: list[nextFirstLevelIndex - 1],
          isGroup: true,
          index: nextFirstLevelIndex - 1,
        },
        change
      );
      // 处理完返回
      return;
    }

    // 展开目录 到 二级元素对象
    if (sourceIsDirOpen && targetIsSecondLevelObject) {
      // 如果从下往上的
      if (inNext) {
        // 找到二级元素对象的父目录索引
        const pIndex = list.map((o) => o.id).indexOf(row.parent_id);
        // 第一步切换位置
        let tmpArr = arrayMove(list, sourceIndex, pIndex);
        // 处理拖拽目录的下级数据
        tmpArr = moveChildren(tmpArr, activeRow);
        // 更新列表数据
        setList?.(tmpArr);

        change.target = list[pIndex].id;
        if (inNext) {
          change['action'] = 'before';
        } else {
          change['action'] = 'after';
        }

        onDragRowEnd(
          {
            row: activeRow,
            isGroup: true,
            index: sourceIndex,
          },
          {
            row: list[pIndex],
            isGroup: false,
            index: pIndex,
          },
          change
        );
        // 处理完返回
        return;
      }
      // 从上往下走
      // 找到下面的第一个一级对象
      const nextFirstLevelIndex = getNextFirstLevelIndex(list, targetIndex);
      // 第一步切换位置
      let tmpArr = arrayMove(list, sourceIndex, nextFirstLevelIndex - 1);
      // 处理拖拽目录的下级数据
      tmpArr = moveChildren(tmpArr, activeRow);
      // 更新列表数据
      setList?.(tmpArr);

      change.target = list[nextFirstLevelIndex - 1].id;
      if (inNext) {
        change['action'] = 'before';
      } else {
        change['action'] = 'after';
      }

      onDragRowEnd(
        {
          row: activeRow,
          isGroup: true,
          index: sourceIndex,
        },
        {
          row: list[nextFirstLevelIndex - 1],
          isGroup: false,
          index: nextFirstLevelIndex - 1,
        },
        change
      );
      // 处理完返回
      return;
    }

    // 拖拽 未展开目录 到 展开目录, 这里肯定是从上往下拖拽的
    // 拖拽 未展开目录 到 二级元素对象, 从上往下
    if ((sourceIsDirClose && targetIsDirOpen) || (sourceIsDirClose && targetIsSecondLevelObject && !inNext)) {
      // 找到目录下面，第一层级的对象
      const nextFirstLevelIndex = getNextFirstLevelIndex(list, targetIndex);
      // 更新列表数据
      setList?.(arrayMove(list, sourceIndex, nextFirstLevelIndex - 1));

      change.target = list[nextFirstLevelIndex - 1].id;
      if (inNext) {
        change['action'] = 'before';
      } else {
        change['action'] = 'after';
      }

      onDragRowEnd(
        {
          row: activeRow,
          isGroup: true,
          index: sourceIndex,
        },
        {
          row: list[nextFirstLevelIndex - 1],
          isGroup: targetIsDirClose || targetIsDirOpen,
          index: nextFirstLevelIndex - 1,
        },
        change
      );
      // 处理完返回
      return;
    }

    // 拖拽 未展开目录 到 二级元素对象, 从下往上
    if (sourceIsDirClose && targetIsSecondLevelObject && inNext) {
      // 找到二级元素对象的父目录索引
      const pIndex = list.map((o) => o.id).indexOf(row.parent_id);
      // 更新列表数据
      setList?.(arrayMove(list, sourceIndex, pIndex));

      change.target = list[pIndex - 1].id;
      if (inNext) {
        change['action'] = 'before';
      } else {
        change['action'] = 'after';
      }

      onDragRowEnd(
        {
          row: activeRow,
          isGroup: true,
          index: sourceIndex,
        },
        {
          row: list[pIndex - 1],
          isGroup: false,
          index: pIndex - 1,
        },
        change
      );
      // 处理完返回
      return;
    }

    // 如果拖拽对象是一个子元素, 这里肯定上二级元素才会匹配上。
    if (!activeRow?.children) {
      // 目标是一个子元素 -- 肯定是不同目录下的子元素，相同目录的上面已经处理了。
      if (!row?.children) {
        // 先把拖拽数据从来源移除，再把拖拽数据插入目标, 最后更新数据
        setList?.(arrayMove(insertIntoTarget(cleanDragParent()), sourceIndex, targetIndex));

        if (inNext) {
          change['action'] = 'before';
        } else {
          change['action'] = 'after';
        }

        onDragRowEnd(
          {
            row: activeRow,
            isGroup: false,
            index: sourceIndex,
          },
          {
            row,
            isGroup: false,
            index: targetIndex,
          },
          change
        );
        // 处理完成返回
        return;
      }
      // 目标是一个目录（这里只能是展开的目录，没展开的已经在上面被处理了）
      else {
        // 如果子元素属于该目录, 或者对象是从下面上来的，就直接扔到上面
        if (activeRow.parent_id === row.id || inNext) {
          // 处理数据
          setList?.(arrayMove(cleanDragParent(), sourceIndex, targetIndex));

          if (inNext) {
            change['action'] = 'before';
          } else {
            change['action'] = 'after';
          }

          onDragRowEnd(
            {
              row: activeRow,
              isGroup: false,
              index: sourceIndex,
            },
            {
              row,
              isGroup: true,
              index: targetIndex,
            },
            change
          );
          // 处理完成返回
          return;
        }
        // 从上面下来的
        // 先把拖拽数据从来源移除，再把拖拽数据插入目标, 最后更新数据
        setList?.(arrayMove(insertIntoTargetDir(cleanDragParent()), sourceIndex, targetIndex));

        change.action = 'into';

        onDragRowEnd(
          {
            row: activeRow,
            isGroup: false,
            index: sourceIndex,
          },
          {
            row,
            isGroup: true,
            index: targetIndex,
          },
          change
        );
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
        {fixedTopCount > 0 && (
          <div
            data-sticky-top="true"
            className={cx({ 'sticky z-4 bg-white shadow hover:bg-primary/3': fixedTopCount > 0 }, 'group/table-row')}
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
                    style={style}
                    index={index}
                    isScrolling={isScrolling}
                    key={row.id ?? String(index)}
                  />
                );
              }}
            </FixedSizeList>
          </div>
        )}
        <div role="rowgroup" className="relative flex-grow">
          {children}
        </div>
      </SortableContext>
      {canDragSortRow &&
        activeRow &&
        createPortal(
          <DragOverlay>
            <div
              className={cx(
                'relative w-full overflow-hidden bg-body shadow-lg ring-1 ring-accent',
                dragRowsItemClassName
              )}
            >
              <TableRow row={activeRow} index={list.map((o) => o.id).indexOf(activeRow.id)} isDragging dragOverlay />
            </div>
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
};

export default DragRows;
