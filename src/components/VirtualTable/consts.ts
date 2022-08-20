import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  type MouseEvent,
  createContext,
} from 'react';

// 勾选框的宽度
export const checkBoxWidth = 44;

// 标题行的树形结构
export interface IHeaderTree {
  label: string;
  children?: IHeaderTree[];
}

export interface IWidths {
  [key: string]: number;
}

export const VirtualTableContext = createContext<{
  // 展示的数据
  list: any[];
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
  rowClass: (index: number) => string;
  // 行点击事件
  rowClick: (e: MouseEvent<HTMLDivElement>, index: number) => void;
  // 文字布局
  textLayout?: 'left' | 'center';
  // 列名的国际化变量, 如: { name: strings.NAME, description: strings.DESCRIPTION }
  labels: string[];
  // 改变列的顺序，也可以修改多语言（当前组件内，只用于改变列的显示顺序）
  changeLabels: Dispatch<SetStateAction<string[]>>;
  // 列的显示比例,完整为1，如: { name: 0.3, description: 0.7 }
  widths: IWidths;
  // 列头拖动时的响应方法，用于更新宽度
  changeWidths: Dispatch<SetStateAction<IWidths>>;
  // 能否拖拽列顺序
  canDragSortColumn: boolean;
  // 能否改变列宽度
  canChangeWidths: boolean;
  // 是否启用选中
  canChecked: boolean;
  // 选中的对象
  checked: number[];
  // 更新选中的对象
  setChecked: Dispatch<SetStateAction<number[]>>;
  // 列的筛选渲染
  filterRenders?: { [key: string]: ReactNode };
  // 列的排序渲染
  sortRenders?: { [key: string]: ReactNode };
  // 修改拖拽偏移量
  onChangeWidth: (key: string, x: number) => void;
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
}>({
  list: [],
  columns: [],
  fixedTopCount: 0,
  fixedLeftCount: 0,
  fixedRightCount: 0,
  titleHeight: 50,
  rowHeight: 45,
  textLayout: 'left',
  canDragSortColumn: true,
  canChecked: true,
  checked: [],
  setChecked: () => undefined,
  labels: [],
  changeLabels: () => undefined,
  canChangeWidths: true,
  widths: {},
  changeWidths: () => undefined,
  onChangeWidth: () => undefined,
  realWidth: 0,
  getLeftWidth: () => 0,
  getRightWidth: () => 0,
  headerList: [],
  headerColumnWidth: () => 0,
  headRenders: {},
  headerTrees: [],
  rowClass: () => '',
  rowClick: () => undefined,
});
