export const options: { [key: string]: boolean | number } = {
  multiTitle: false,
  showEmpty: false,
  showScrolling: false,
  canDragSortRow: true,
  canChecked: true,
  canResize: true,
  canDragOrder: true,
  canFilter: true,
  canSort: true,
  fixedLeftCount: 1,
  fixedRightCount: 1,
  fixedTopCount: 3,
};

export const names = {
  multiTitle: '是否显示多行标题',
  showEmpty: '是否显示空态图',
  showScrolling: '是否开启滚动行渲染',
  canDragSortRow: '是否启用行拖拽排序功能',
  canChecked: '是否使用行选中功能',
  canResize: '是否使用列宽调整功能',
  canDragOrder: '是否启用列头排序功能',
  canFilter: '是否使用筛选功能',
  canSort: '是否使用数据排序功能',
  fixedLeftCount: '左边锁定多少列',
  fixedRightCount: '右边锁定多少列',
  fixedTopCount: '顶部锁定多少行',
};
