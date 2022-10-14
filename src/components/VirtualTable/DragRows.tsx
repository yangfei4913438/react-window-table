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
    for (let item of list) {
      if (item.id === id) {
        return {
          ...item,
          parent_id: null,
        };
      }
      if (item?.children && item.children.length > 0) {
        for (let item2 of item.children) {
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
  const handleDragEnd = ({ over, active }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    // 目的对象
    const row = getRow(over.id);

    // 取出实时渲染的索引
    const sourceIndex = allRenderIds.indexOf(active.id);
    const targetIndex = allRenderIds.indexOf(over.id);

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

    // 两个目录，都没有展开的情况切换
    if (!row.parent_id && !!row.children && !activeRow.parent_id && !!activeRow.children) {
      // 目录的判断，分组数据肯定是有的。
      const sourceOpen = Object.keys(groups!).includes(row.id);
      const targetOpen = Object.keys(groups!).includes(activeRow.id);
      // 确保都是没有展开的情况
      if (!sourceOpen && !targetOpen) {
        // 更新列表数据
        setList?.(arrayMove(list, sourceIndex, targetIndex));
        return;
      }
    }

    // 获取下个目录的索引
    const getNextDirIndex = (arr: typeof activeRow[], startIndex: number): number => {
      // 检查是从下一个元素开始的。
      const checkIndex = startIndex + 1;
      // 判断是不是目录
      // 是目录的情况
      if (!!arr[checkIndex]?.children) {
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
      if (!!arr[checkIndex]?.children) {
        return checkIndex;
      }
      // 递归处理
      return getPrevDirIndex(arr, checkIndex);
    };

    // 拖拽对象是否在目标对象的下面
    const inNext = sourceIndex > targetIndex;

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

    // 如果拖拽对象是一个目录
    if (!!activeRow?.children) {
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
        // 实时渲染内容变更(这里的移动不影响目录内部的数据)
        // 新的数组
        let newArr = arrayMove(list, sourceIndex, targetIndex);

        // 清理数据
        // 1、找到2个上层目录对象
        const sourceObj = list.find((o) => o.id === activeRow.parent_id);
        const targetObj = list.find((o) => o.id === row.parent_id);

        // 2、计算2个对象在目录中的索引位置
        const inSourceIndex = sourceObj.children.map((o: any) => o.id).indexOf(activeRow.id);
        const inTargetIndex = targetObj.children.map((o: any) => o.id).indexOf(row.id);

        // 3、将对象放进去
        if (inNext) {
          // 如果是文件类型，且是从下来拿上来的
          // 插入前面
          targetObj.children.splice(inTargetIndex - 1, 0, activeRow);
        } else {
          // 插入后面
          targetObj.children.splice(inTargetIndex + 1, 0, activeRow);
        }
        // 移除对象
        sourceObj.children.splice(inSourceIndex, 1);

        // 4、替换数据
        newArr = newArr.map((item) => {
          if (item.id === row.parent_id) {
            // 返回新的数据
            return {
              ...item,
              children: targetObj.children,
            };
          }
          if (item.id === activeRow.parent_id) {
            // 返回新的数据
            return {
              ...item,
              children: sourceObj.children,
            };
          }
          return item;
        });

        // 5、更新目标分组
        setGroups!((prevState) => {
          if (targetObj.children.length > 0) {
            prevState[row.parent_id] = targetObj.children;
          } else {
            delete prevState[row.parent_id];
          }
          if (targetObj.children.length > 0) {
            prevState[activeRow.parent_id] = sourceObj.children;
          } else {
            delete prevState[activeRow.parent_id];
          }
          return prevState;
        });

        // 更新列表数据
        setList!(newArr);
        return;
      }
      // 目标是一个目录
      else {
        // 判断目标目录有没有展开
        const targetOpen = Object.keys(groups!).includes(row.id);
        // 目标是一个展开的目录
        if (targetOpen) {
          // 看得见的地方, 新的数组
          let newArr: typeof activeRow[];

          // 拿到目标目录的索引
          const targetDirIndex = list.map((o) => o.id).indexOf(row.id);

          // 如果目标目录已经是第一个元素了，那么就直接返回，不处理
          if (targetDirIndex === fixedTopCount) {
            return;
          }
          // 其他情况，放到上一个目录的最后一个位置
          else {
            // 看不见的地方处理
            // 1、找到2个上层目录对象
            const sourceObj = list.find((o) => o.id === activeRow.parent_id);
            // 2、计算2个对象在目录中的索引位置
            const inSourceIndex = sourceObj.children.map((o: any) => o.id).indexOf(activeRow.id);
            // 4、 移除对象
            sourceObj.children.splice(inSourceIndex, 1);

            let targetObj: typeof activeRow;
            if (inNext) {
              // 从上一个索引位置开始找，找上一个目录的索引
              const prevDirIndex = getPrevDirIndex(list, targetIndex);
              // 找到真正的目标对象
              targetObj = list[prevDirIndex];
              // 3、将对象追加到最后一个
              targetObj.children.push(activeRow);
            } else {
              // 上面下来的，放在第一个
              targetObj = list.find((o) => o.id === row.id);
              targetObj.children.unshift(activeRow);
            }

            // 5、替换数据
            newArr = arrayMove(list, sourceIndex, targetDirIndex);
            // 如果是下面上了的，需要判断上级对象是不是展开的，
            // 判断目标目录有没有展开
            const targetObjOpen = Object.keys(groups!).includes(targetObj.id);
            if (inNext) {
              // 如果是没展开的，需要将显示的对象干掉。
              if (!targetObjOpen) {
                const activeIndex = newArr.map((o) => o.id).indexOf(activeRow.id);
                newArr.splice(activeIndex, 1);
              }
            }

            newArr = newArr.map((item) => {
              // 这里要同样是上级目录的id
              if (item.id === targetObj.id) {
                // 返回新的数据
                return {
                  ...item,
                  children: targetObj.children,
                };
              }
              if (item.id === activeRow.parent_id) {
                // 返回新的数据
                return {
                  ...item,
                  children: sourceObj.children,
                };
              }
              return item;
            });

            // 5、更新目标分组
            setGroups!((prevState) => {
              // 只有展开的情况，才需要修正分组数据
              if (inNext && targetObjOpen) {
                if (targetObj.children.length > 0) {
                  prevState[targetObj.id] = targetObj.children;
                } else {
                  delete prevState[targetObj.id];
                }
              }
              if (sourceObj.children.length > 0) {
                prevState[activeRow.parent_id] = sourceObj.children;
              } else {
                delete prevState[activeRow.parent_id];
              }
              return prevState;
            });

            // 更新列表数据
            setList!(newArr);
            return;
          }
        }
        // 目标是一个没有展开的目录
        else {
          // 1、找到2个上层目录对象
          const sourceObj = list.find((o) => o.id === activeRow.parent_id);
          // 2、计算2个对象在目录中的索引位置
          const inSourceIndex = sourceObj.children.map((o: any) => o.id).indexOf(activeRow.id);
          // 4、 移除对象
          sourceObj.children.splice(inSourceIndex, 1);

          // 将对象追加到，目录的最后一个
          const targetObj: typeof activeRow = { ...row };
          targetObj.children.push(activeRow);

          // 移除拖拽的实时渲染对象
          list.splice(sourceIndex, 1);

          // 更新内部children
          const newArr = list.map((item) => {
            if (item.id === row.id) {
              // 返回新的数据
              return {
                ...item,
                children: targetObj.children,
              };
            }
            if (item.id === activeRow.parent_id) {
              // 返回新的数据
              return {
                ...item,
                children: sourceObj.children,
              };
            }
            return item;
          });

          // 5、更新目标分组
          setGroups!((prevState) => {
            if (sourceObj.children.length > 0) {
              // 只需要更新拖拽对象的那个分组即可，目标没有分组数据。
              prevState[activeRow.parent_id] = sourceObj.children;
            } else {
              delete prevState[activeRow.parent_id];
            }
            return prevState;
          });

          // 更新列表数据
          setList!(newArr);
          return;
        }
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
          className="tx-virtual-table__fixed_top"
          style={{
            top: headerTrees.length ? headerList.length * titleHeight : titleHeight,
            width: realWidth,
          }}
        >
          <FixedSizeList
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
            <div className="tx-virtual-table__row_drag_wrapper">
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
