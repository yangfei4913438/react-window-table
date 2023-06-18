import '@/index.scss';

import cx from 'classnames';
import React, {
  type CSSProperties,
  type Dispatch,
  type MouseEvent,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FixedSizeList,
  type ListChildComponentProps,
  type ListOnItemsRenderedProps,
} from 'react-window';
import useResizeObserver from 'use-resize-observer';

import {
  checkBoxWidth,
  dragIconWidth,
  type IHeaderTree,
  type IWidths,
  type ListType,
  VirtualTableContext,
} from './consts';
import DragRowsItem from './DragRowsItem';
import TableWrapper from './TableWrapper';
import useTableScroll from './useTableScroll';

export interface VirtualTableProps<T> {
  // 展示的数据
  list: T[];
  // 表格内部更新数据
  setList?: Dispatch<SetStateAction<T[]>>;
  // 分组数据
  groups?: { [key: string]: T[] };
  // 更新分组信息
  setGroups?: (data: { [key: string]: T[] }) => void;

  // 表格是否禁用滚动
  disableScroll?: boolean;

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
  // 放置回掉方法
  onDragRowEnd?: (
    source: { row: T; isGroup: boolean; index: number },
    target: { row: T; isGroup: boolean; index: number },
    change: {
      origin: string; // 拖拽对象id
      target?: string; // 目标对象id
      action: 'after' | 'before' | 'into' | 'top' | 'bottom';
      // after 从上往下放
      // before 从下往上
      // into 目标是一个组id
      // top 置顶（暂时没用到）
      // bottom 置底（暂时没用到）
    }
  ) => void;

  // 拖拽行的icon class，用于自定义图标
  dragRowIcon?: string;
  // 拖拽行的类名
  dragRowsItemClassName?: string;

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
  // 单元格的外部包裹类名
  cellClass?: string;

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
  setChecked?: (checked: string[]) => void;

  // 空态图
  emptyNode?: ReactNode;
}

const VirtualTable = <T extends ListType>({
  list,
  setList,
  groups,
  setGroups = () => undefined,

  disableScroll = false,

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
  onDragRowEnd = () => undefined,

  dragRowIcon,
  dragRowsItemClassName = '',

  nextPage,
  nextTrigger = 0.55, // 默认值 55%

  wrapperStyle,
  wrapperClass,
  className,
  cellClass = '',
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
  const [tableWidth, setTableWidth] = useState<number>(1);
  // 表格高度
  const [tableHeight, setTableHeight] = useState<number>(1);

  const ref = useRef<HTMLDivElement>(null);
  const { width = 1, height = 1 } = useResizeObserver<HTMLDivElement>({
    ref: ref,
    box: 'border-box',
    round: Math.floor,
    onResize: ({ width, height }) => {
      setTableWidth(width as number);
      setTableHeight(height ?? ref.current?.offsetHeight ?? document.body.offsetHeight);
    },
  });

  // 临时变化的key
  const [changeKey, setChangeKey] = useState<string>('');
  // 临时变化的宽度
  const [changeWidth, setChangeWidth] = useState(0);

  // 列的宽度拖拽状态
  const [colResizing, setColResizing] = useState(false);

  // 拖拽的行对象
  const [activeRow, setActiveRow] = useState<T>();

  // 拖拽状态
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

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
    // 宽度最小不能低于100px
    if (currentWidth >= 100) {
      // 计算出百分比
      const currentPercent = currentWidth / tableWidth;
      // 更新宽度比例
      changeWidths?.((prev) => ({
        ...prev,
        [changeKey]: currentPercent,
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
    // 宽度最小不能低于100px
    if (currentWidth >= 100) {
      // 改变的宽度
      setChangeWidth(x);
      // 记录哪个列在变化
      setChangeKey(key);
    }
  };

  const getMoreWidth = useMemo(() => {
    if (canChecked && !canDragSortRow) {
      return checkBoxWidth;
    }
    if (!canChecked && canDragSortRow) {
      return dragIconWidth;
    }
    if (canChecked && canDragSortRow) {
      return dragIconWidth + checkBoxWidth;
    }
    return 0;
  }, [canChecked, canDragSortRow]);

  // 获取key的临时宽度
  const getTempKeyWidth = useCallback(
    (key: string): number => {
      if (key === changeKey) {
        return widths[key] * (tableWidth - getMoreWidth) + changeWidth;
      }
      return widths[key] * (tableWidth - getMoreWidth);
    },
    [changeKey, widths, tableWidth, getMoreWidth, changeWidth]
  );

  // 实时宽度
  const realWidth = useMemo(() => {
    // 正常计算
    const res = labels.map(getTempKeyWidth).reduce((a, b) => a + b, 0);
    // 返回的总宽度，要带上变化的宽度
    return getMoreWidth + res;
  }, [labels, getMoreWidth, getTempKeyWidth]);

  // 监听渲染的行索引
  const onItemsRendered = (info: ListOnItemsRenderedProps) => {
    // 当禁用表格滚动的时候，不处理下一页数据的请求。
    if (disableScroll) {
      return;
    }

    // 触发比例范围检查: 10% - 95%
    const nt = nextTrigger > 0.95 ? 0.95 : nextTrigger < 0.1 ? 0.1 : nextTrigger;

    // 渲染超过55%，请求后面的数据
    if (info.overscanStopIndex / list.length >= nt) {
      // 更新下页数据
      nextPage?.();
    }
  };

  // 渲染列
  const renderColumn = (dataKey: string) => ({
    dataKey,
    width: getTempKeyWidth(dataKey),
    headRenders,
    cellRenders: (rowData: T, index: number) => cellRenders[dataKey](rowData, index),
  });

  // 获取key的宽度
  const getKeyWidth = (row: IHeaderTree): number => {
    // 没有下级标题，表示是最后一层的列，可以直接取到宽度
    if (!row?.children) {
      return getTempKeyWidth(row.label);
    }
    return row.children.map((r) => getKeyWidth(r)).reduce((a, b) => a + b, 0);
  };

  // 渲染多行标题列的宽度（不是最后一层真实标题）
  const headerColumnWidth = (key: string): number => {
    // 找出对象
    const getRow = (list: IHeaderTree[], key: string): IHeaderTree | undefined => {
      for (let i = 0; i < list.length; i++) {
        const row = list[i];
        if (row.label === key) {
          return row;
        }
        if (row?.children) {
          return getRow(row.children, key);
        }
      }
      return undefined;
    };
    // 执行这个方法的时候，表示 headerTrees 是肯定存在的，不需要担心数据不存在。
    const row = getRow(headerTrees, key);
    if (row) {
      return getKeyWidth(row);
    }
    return 0;
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

  // 真实高度计算
  const realHeight = useMemo(() => {
    // 顶部高度
    const top = headerTrees?.length > 0 ? headerList.length * titleHeight : titleHeight;

    // 真实高度
    return disableScroll ? list.length * rowHeight + top + 7 : tableHeight;
  }, [
    headerTrees?.length,
    headerList?.length,
    titleHeight,
    disableScroll,
    list.length,
    rowHeight,
    tableHeight,
  ]);

  const disableScrollStyle = disableScroll ? { overflowY: 'hidden' } : {};
  const emptyStyle = list.length === 0 ? { height: '100%' } : {};

  const [tableContainer, setTableContainer] = useState<HTMLDivElement | null>(null);
  useTableScroll(tableContainer);

  const List: typeof FixedSizeList | { width: number | string; height: number | string } =
    FixedSizeList;

  return (
    <div ref={ref} className='h-full w-full'>
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
          onDragRowEnd,
          dragRowIcon,
          checked,
          setChecked,
          filterRenders,
          sortRenders,
          onChangeWidth,
          onDragWidthEnd,
          realWidth,
          realHeight,
          headerList,
          headerColumnWidth,
          headRenders,
          headerTrees,
          getLeftWidth,
          getRightWidth,
          scrollingRender,
          wrapperStyle,
          wrapperClass,
          cellClass,
          activeRow,
          setActiveRow,
          colResizing,
          setColResizing,
          disableScroll,
          emptyNode,
          activeLabel,
          setActiveLabel,
          dragRowsItemClassName,
        }}
      >
        <List
          innerElementType={TableWrapper}
          className={cx(
            'group/table',
            disableScroll && '',
            (activeLabel || colResizing) && '!overflow-hidden',
            className
          )}
          style={{ ...tableStyle, ...disableScrollStyle, ...emptyStyle } as CSSProperties}
          itemData={
            list.length > fixedTopCount ? list.slice(fixedTopCount, list.length) : [emptyRow as T]
          }
          // 一共有多少行
          itemCount={list.length > fixedTopCount ? list.length - fixedTopCount : 1}
          height={height > 1 ? height : ref.current?.offsetHeight || 0}
          width={width > 1 ? width : ref.current?.offsetWidth || 0}
          itemSize={rowHeight}
          overscanCount={disableScroll ? 0 : 3} // 比实际多渲染n行元素
          onItemsRendered={onItemsRendered} // 渲染进度监听
          useIsScrolling={!!scrollingRender}
          outerRef={(node) => setTableContainer(node)}
        >
          {(props: ListChildComponentProps) => {
            const { data, index, style, isScrolling } = props;
            const row = data[index];

            return (
              <DragRowsItem
                row={row}
                style={style}
                index={index + fixedTopCount}
                isScrolling={isScrolling}
                key={row.id ?? String(index)}
              />
            );
          }}
        </List>
      </VirtualTableContext.Provider>
    </div>
  );
};

VirtualTable.displayName = 'VirtualTable';

export default VirtualTable;
