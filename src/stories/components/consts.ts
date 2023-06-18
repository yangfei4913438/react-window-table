export const options: TableType = {
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
  fixedTopCount: 2,
};

export interface TableType {
  multiTitle?: boolean;
  showEmpty?: boolean;
  showScrolling?: boolean;
  canDragSortRow?: boolean;
  canChecked?: boolean;
  canResize?: boolean;
  canDragOrder?: boolean;
  canFilter?: boolean;
  canSort?: boolean;
  fixedLeftCount?: number;
  fixedRightCount?: number;
  fixedTopCount?: number;
}
