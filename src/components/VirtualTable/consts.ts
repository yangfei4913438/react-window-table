import React, {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  type MouseEvent,
  createContext,
} from 'react';

// 勾选框的宽度
export const checkBoxWidth = 44;
// 拖拽对象的宽度
export const dragIconWidth = 48;

// 标题行的树形结构
export interface IHeaderTree {
  label: string;
  children?: IHeaderTree[];
}

export interface IWidths {
  [key: string]: number;
}

export type ListType = { id: string; children?: { id: string }[] };

interface VirtualTableContextProps<T extends ListType> {
  // 展示的数据
  list: T[];
  // 表格内部更新数据
  setList?: Dispatch<SetStateAction<T[]>>;
  // 分组数据
  groups?: { [key: string]: T[] };
  // 更新分组信息
  setGroups?: Dispatch<SetStateAction<{ [key: string]: T[] }>>;
  // 渲染列
  columns: any[];
  // 顶部固定行数量
  fixedTopCount: number;
  // 左侧固定列数量
  fixedLeftCount: number;
  // 右侧固定列数量
  fixedRightCount: number;
  // 标题行高度
  titleHeight: number;
  // 每行的高度
  rowHeight: number;
  // 表头的行类名
  headerClass?: string;
  // 表格的行类名
  rowClass?: ({ index, row }: { index: number; row: any }) => string;
  // 行点击事件
  rowClick?: ({
    event,
    index,
    row,
  }: {
    event: MouseEvent<HTMLDivElement>;
    index: number;
    row: any;
  }) => void;
  // 文字布局
  textLayout?: 'left' | 'center';
  // 列名的国际化变量, 如: { name: strings.NAME, description: strings.DESCRIPTION }
  labels: string[];
  // 改变列的顺序，也可以修改多语言（当前组件内，只用于改变列的显示顺序）
  changeLabels?: Dispatch<SetStateAction<string[]>>;
  // 列的显示比例,完整为1，如: { name: 0.3, description: 0.7 }
  widths: IWidths;
  // 列头拖动时的响应方法，用于更新宽度
  changeWidths?: Dispatch<SetStateAction<IWidths>>;
  // 能否拖拽列顺序
  canDragSortColumn: boolean;
  // 能否改变列宽度
  canChangeWidths: boolean;
  // 能否拖拽行顺序
  canDragSortRow: boolean;
  // 拖拽行的icon class，用于自定义图标
  dragRowIcon?: string;
  // 是否启用选中
  canChecked: boolean;
  // 选中的对象
  checked: string[];
  // 更新选中的对象
  setChecked: Dispatch<SetStateAction<string[]>>;
  // 列的筛选渲染
  filterRenders?: { [key: string]: ReactNode };
  // 列的排序渲染
  sortRenders?: { [key: string]: ReactNode };
  // 修改拖拽偏移量
  onChangeWidth: (key: string, x: number) => void;
  // 拖拽宽度终止
  onDragWidthEnd: () => void;
  // 表的完整宽度
  realWidth: number;
  // 获取左侧绝对定位的距离
  getLeftWidth: (idx: number) => number;
  // 获取右侧绝对定位的距离
  getRightWidth: (idx: number) => number;
  // 渲染滚动行
  scrollingRender?: (index: number) => ReactNode;
  // 标题行的层级关系
  headerList: string[][];
  // 根据header的key获取，宽度
  headerColumnWidth: (key: string) => number;
  // 表头的渲染方法
  headRenders: { [key: string]: ReactNode };
  // 标题行的树形层级关系
  headerTrees: IHeaderTree[];
  // 表格外部类名
  wrapperClass?: string;
  // 表格外部的内联样式
  wrapperStyle?: Partial<React.CSSProperties>;
  // 拖拽的行
  activeRow?: T;
  // 更新拖拽的行
  setActiveRow: Dispatch<SetStateAction<T | undefined>>;
}

const initContext: VirtualTableContextProps<any> = {
  list: [],
  setList: () => undefined,
  groups: {},
  setGroups: () => undefined,
  columns: [],
  fixedTopCount: 0,
  fixedLeftCount: 0,
  fixedRightCount: 0,
  titleHeight: 50,
  rowHeight: 45,
  textLayout: 'left',
  canDragSortColumn: true,
  canChecked: true,
  canDragSortRow: true,
  checked: [],
  setChecked: () => undefined,
  labels: [],
  changeLabels: () => undefined,
  canChangeWidths: true,
  widths: {},
  changeWidths: () => undefined,
  onChangeWidth: () => undefined,
  onDragWidthEnd: () => undefined,
  realWidth: 0,
  getLeftWidth: () => 0,
  getRightWidth: () => 0,
  headerList: [],
  headerColumnWidth: () => 0,
  headRenders: {},
  headerTrees: [],
  rowClass: () => '',
  rowClick: () => undefined,
  setActiveRow: () => undefined,
};

export const VirtualTableContext = createContext(initContext);
