export const options: TableType = {
  fixedLeftCount: 1,
  fixedRightCount: 1,
  fixedTopCount: 2,
  multiTitle: false,
  showEmpty: false,
  showScrolling: false,
  canDragSortRow: true,
  canChecked: true,
  canResize: true,
  canDragOrder: true,
  canFilter: true,
  canSort: true,
};

export interface TableType {
  fixedLeftCount?: number;
  fixedRightCount?: number;
  fixedTopCount?: number;
  multiTitle?: boolean;
  showEmpty?: boolean;
  showScrolling?: boolean;
  canDragSortRow?: boolean;
  canChecked?: boolean;
  canResize?: boolean;
  canDragOrder?: boolean;
  canFilter?: boolean;
  canSort?: boolean;
}
