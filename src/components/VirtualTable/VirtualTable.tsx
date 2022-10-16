import React, {
  type Dispatch,
  type MouseEvent,
  type ReactNode,
  type SetStateAction,
  useMemo,
  useState,
} from 'react';
import {
  FixedSizeList,
  type ListChildComponentProps,
  type ListOnItemsRenderedProps,
} from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import cx from 'classnames';
import TableWrapper from './TableWrapper';
import DragRowsItem from './DragRowsItem';
import {
  type IHeaderTree,
  type IWidths,
  type ListType,
  VirtualTableContext,
  checkBoxWidth,
  dragIconWidth,
} from './consts';

export interface VirtualTableProps<T> {
  // 展示的数据
  list: T[];
  // 表格内部更新数据
  setList?: Dispatch<SetStateAction<T[]>>;
  // 分组数据
  groups?: { [key: string]: T[] };
  // 更新分组信息
  setGroups?: Dispatch<SetStateAction<{ [key: string]: T[] }>>;

  // 列的显示比例,完整为1，如: { name: 0.3, description: 0.7 }
  widths: IWidths;
  // 列头拖动时的响应方法，用于更新宽度
  changeWidths?: Dispatch<SetStateAction<IWidths>>;
  // 能否改变列宽度
  canChangeWidths?: boolean;
  // 能否拖拽列顺序
  canDragSortColumn?: boolean;
  // 能否拖拽行顺序
  canDragSortRow?: boolean;
  // 拖拽行的icon class，用于自定义图标
  dragRowIcon?: string;

  // 文字布局
  textLayout?: 'left' | 'center';

  // 列名的国际化变量, 如: { name: strings.NAME, description: strings.DESCRIPTION }
  labels: string[];
  // 改变列的顺序，也可以修改多语言（当前组件内，只用于改变列的显示顺序）
  changeLabels?: Dispatch<SetStateAction<string[]>>;

  // 列的排序渲染
  sortRenders?: { [key: string]: ReactNode };
  // 列的筛选渲染
  filterRenders?: { [key: string]: ReactNode };
  // 列元素的渲染方法, 如: { name: this.cellRender, description: this.cellRender };
  cellRenders: { [key: string]: (row: T, index: number) => ReactNode };
  // 表头的渲染方法
  headRenders: { [key: string]: ReactNode };
  // 标题行的树形层级关系
  headerTrees?: IHeaderTree[];
  // 渲染滚动行
  scrollingRender?: (index: number) => ReactNode;

  // 请求下页数据
  nextPage?: () => void;
  // 触发下页请求的滚动百分比, 取值范围 0.1 - 0.95 即 10% - 95%
  nextTrigger?: number;

  // 标题行高度
  titleHeight?: number;
  // 每行的高度
  rowHeight?: number;

  // 表格外部类名
  wrapperClass?: string;
  // 表格外部的内联样式
  wrapperStyle?: Partial<React.CSSProperties>;
  // 表格的类名
  className?: string;
  // 表格的内联样式
  tableStyle?: Partial<React.CSSProperties>;
  // 表头的行类名
  headerClass?: string;
  // 表格的行类名
  rowClass?: ({ index, row }: { index: number; row: T }) => string;
  // 行点击事件
  rowClick?: ({
    event,
    index,
    row,
  }: {
    event: MouseEvent<HTMLDivElement>;
    index: number;
    row: T;
  }) => void;

  // 顶部固定行数量
  fixedTopCount?: number;
  // 左侧固定列数量
  fixedLeftCount?: number;
  // 右侧固定列数量
  fixedRightCount?: number;

  // 是否启用选中
  canChecked?: boolean;
  // 选中的对象
  checked?: string[];
  // 更新选中的对象
  setChecked?: Dispatch<SetStateAction<string[]>>;

  // 空态图
  emptyNode?: ReactNode;
}

const VirtualTable = <T extends ListType>({
  list,
  setList,
  groups,
  setGroups,

  widths,
  labels,
  changeLabels,
  textLayout = 'left',

  sortRenders,
  filterRenders,
  cellRenders,
  headRenders,
  headerTrees = [],
  scrollingRender,

  changeWidths,
  canChangeWidths = false,
  canDragSortColumn = false,
  canDragSortRow = false,
  dragRowIcon,

  nextPage,
  nextTrigger = 0.55, // 默认值 55%

  wrapperStyle,
  wrapperClass,
  className,
  tableStyle,

  titleHeight = 50,
  rowHeight = 45,
  headerClass,
  rowClass = () => '',
  rowClick = () => undefined,

  fixedTopCount = 0, // 默认不锁定行
  fixedLeftCount = 0, // 默认不锁定列
  fixedRightCount = 0, // 默认不锁定列

  canChecked = false,
  checked = [],
  setChecked = () => undefined,

  emptyNode,
}: VirtualTableProps<T>) => {
  // 表格宽度
  const [tableWidth, setTableWidth] = useState<number>(0);
  // 临时变化的key
  const [changeKey, setChangeKey] = useState<string>('');
  // 临时变化的宽度
  const [changeWidth, setChangeWidth] = useState(0);

  // 列的宽度拖拽状态
  const [colResizing, setColResizing] = useState(false);

  // 拖拽的行对象
  const [activeRow, setActiveRow] = useState<T>();

  // 标题行的树形层级关系
  const headerList: string[][] = [];
  const getHeaderList = (rows: IHeaderTree[], idx: number) => {
    if (!rows.length) return;
    if (!headerList[idx]) {
      headerList[idx] = rows.map((o) => o.label);
    } else {
      headerList[idx] = headerList[idx].concat(rows.map((o) => o.label));
    }
    rows.forEach((r) => r.children && getHeaderList(r.children, idx + 1));
  };
  // 生成列表
  getHeaderList(headerTrees, 0);
  // 树形关系存在，才可以
  if (headerTrees?.length) {
    // 最后一层使用可变列，便于拖拽
    headerList[headerList.length - 1] = labels;
  }

  // 最终响应宽度改变
  const onDragWidthEnd = () => {
    // 当前的宽度
    const currentWidth = widths[changeKey] * tableWidth + changeWidth;
    // 下一个宽度
    const index = labels.indexOf(changeKey);
    const nextDataKey = labels[index + 1];
    const nextWidth = widths[nextDataKey] * tableWidth - changeWidth;

    // 宽度最小不能低于100px
    if (currentWidth > 100 && nextWidth > 100) {
      // 计算出百分比
      const currentPercent = currentWidth / tableWidth;
      // const nextPercent = nextWidth / tableWidth;
      // 更新宽度比例
      changeWidths?.((prev) => ({
        ...prev,
        [changeKey]: currentPercent,
        // 不改变后面的宽度，有需要再加
        // [nextDataKey]: nextPercent,
      }));
    }
    // 重置临时宽度
    setChangeWidth(0);
    setChangeKey('');
  };

  // 宽度临时变更
  const onChangeWidth = (key: string, x: number) => {
    // 空值是重置宽度
    if (key === '' || x === 0) {
      return;
    }

    // 当前的宽度
    const currentWidth = widths[key] * tableWidth + x;
    // 下一个宽度
    const index = labels.indexOf(key);
    const nextDataKey = labels[index + 1];
    const nextWidth = widths[nextDataKey] * tableWidth - x;

    // 宽度最小不能低于100px
    if (currentWidth > 100 && nextWidth > 100) {
      // 改变的宽度
      setChangeWidth(x);
      // 记录哪个列在变化
      setChangeKey(key);
    }
  };

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

  // 获取key的临时宽度
  const getTempKeyWidth = (key: string): number => {
    if (key === changeKey) {
      return widths[key] * tableWidth + changeWidth;
    }
    return widths[key] * tableWidth;
  };

  // 实时宽度
  const realWidth = () => {
    // 正常计算
    const res = labels.map(getTempKeyWidth).reduce((a, b) => a + b);
    // 返回的总宽度，要带上变化的宽度
    return getMoreWidth + res;
  };

  // 监听渲染的行索引
  const onItemsRendered = (info: ListOnItemsRenderedProps) => {
    // 触发比例范围检查: 10% - 95%
    const nt = nextTrigger > 0.95 ? 0.95 : nextTrigger < 0.1 ? 0.1 : nextTrigger;

    // 渲染超过55%，请求后面的数据
    if (info.overscanStopIndex / list.length >= nt) {
      // 更新下页数据
      nextPage?.();
    }
  };

  // 渲染列
  const renderColumn = (dataKey: string) => {
    return {
      dataKey,
      width: getTempKeyWidth(dataKey),
      headRenders,
      cellRenders: (rowData: T, index: number) => cellRenders[dataKey](rowData, index),
    };
  };

  // 获取下层的宽度，作为当前层的宽度
  const getHeaderWidth = (row: IHeaderTree): number => {
    if (row?.children) {
      return row.children.map((r) => getHeaderWidth(r)).reduce((a, b) => (a ?? 0) + (b ?? 0) + 2);
    }
    return (widths[row.label] ?? 0) * tableWidth;
  };

  // 获取key的宽度
  const getKeyWidth = (row: IHeaderTree, key: string): number => {
    if (row.label === key) {
      return getHeaderWidth(row);
    }
    if (row.children) {
      return row.children.map((r) => getKeyWidth(r, key)).reduce((a, b) => a + b);
    }
    return -1;
  };

  // 渲染标题列
  const headerColumnWidth = (key: string): number => {
    // 找出符合
    const res = headerTrees.map((r) => getKeyWidth(r, key)).filter((r) => r > -1);
    return res[0];
  };

  // 生成列数组
  const columns = labels.map((key) => renderColumn(key));

  // 获取左侧绝对定位的距离
  const getLeftWidth = (idx: number) => {
    if (idx === 0) {
      return getMoreWidth;
    }
    const cols = labels
      .map(getTempKeyWidth)
      .slice(0, idx)
      .reduce((a, b) => a + b);

    return getMoreWidth + cols;
  };

  // 获取右侧绝对定位的距离
  const getRightWidth = (idx: number) => {
    if (idx === labels.length - 1) {
      return 0;
    }
    return labels
      .map(getTempKeyWidth)
      .slice(idx + 1)
      .reduce((a, b) => a + b);
  };

  // 填充的mock数据(修复内部列表为空时，header拖拽数据会异常的情况)
  const emptyRow: { [key: string]: any } = {};
  labels.forEach((o, idx) => (emptyRow[o] = `row_${idx}`));

  return (
    <AutoSizer onResize={({ width }) => setTableWidth(width)}>
      {({ width, height }: { width: number; height: number }) => {
        return (
          <VirtualTableContext.Provider
            value={{
              fixedTopCount,
              fixedLeftCount,
              fixedRightCount,
              list,
              setList,
              groups,
              setGroups,
              titleHeight,
              rowHeight,
              columns,
              textLayout,
              labels,
              changeLabels,
              widths,
              changeWidths,
              canChangeWidths,
              headerClass,
              rowClass,
              rowClick,
              canDragSortColumn,
              canChecked,
              canDragSortRow,
              dragRowIcon,
              checked,
              setChecked,
              filterRenders,
              sortRenders,
              onChangeWidth,
              onDragWidthEnd,
              realWidth: realWidth(),
              headerList,
              headerColumnWidth,
              headRenders,
              headerTrees,
              getLeftWidth,
              getRightWidth,
              scrollingRender,
              wrapperStyle,
              wrapperClass,
              activeRow,
              setActiveRow,
              colResizing,
              setColResizing,
            }}
          >
            <FixedSizeList
              innerElementType={TableWrapper}
              className={cx('tx-virtual-table__container', className)}
              style={tableStyle}
              itemData={
                list.length > fixedTopCount
                  ? list.slice(fixedTopCount, list.length)
                  : [emptyRow as T]
              }
              itemCount={list.length > fixedTopCount ? list.length - fixedTopCount : 1} // 一共有多少行
              height={height}
              width={width}
              itemSize={rowHeight}
              overscanCount={3} // 比实际多渲染n行元素
              onItemsRendered={onItemsRendered} // 渲染进度监听
              useIsScrolling={!!scrollingRender}
            >
              {(props: ListChildComponentProps) => {
                const { data, index, style, isScrolling } = props;
                const row = data[index];

                return (
                  <DragRowsItem
                    row={row}
                    rowClass={rowClass({ index: index + fixedTopCount, row })}
                    style={style}
                    index={index + fixedTopCount}
                    isScrolling={isScrolling}
                    key={row.id ?? String(index)}
                  />
                );
              }}
            </FixedSizeList>
            {list.length === 0 && (
              <div
                className="tx-virtual-table--empty"
                style={{
                  width,
                  top:
                    headerTrees?.length > 0 ? (headerList.length - 1) * titleHeight : titleHeight,
                  height: height - titleHeight,
                }}
              >
                {emptyNode}
              </div>
            )}
          </VirtualTableContext.Provider>
        );
      }}
    </AutoSizer>
  );
};

VirtualTable.displayName = 'VirtualTable';

export default VirtualTable;
