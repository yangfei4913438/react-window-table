import { type FC, type ReactNode, useState, useLayoutEffect, useMemo } from 'react';
import { type IPerson, makeData, PersonLabels } from './makeData';
import { VirtualTable } from '../VirtualTable';
import cx from 'classnames';

export interface TableProps {
  // 是否开启滚动
  showScrolling?: boolean;
  // 顶部锁定多少行
  fixedTopCount?: number;
  // 左边锁定多少列
  fixedLeftCount?: number;
  // 右边锁定多少列
  fixedRightCount?: number;
  // 是否使用行选中功能
  canChecked?: boolean;
  // 是否使用数据排序功能
  canSort?: boolean;
  // 是否使用筛选功能
  canFilter?: boolean;
  // 是否使用列宽调整功能
  canResize?: boolean;
  // 是否启用列头排序功能
  canDragOrder?: boolean;
  // 是否启用行拖拽排序功能
  canDragSortRow?: boolean;
  // 是否显示空态图
  showEmpty?: boolean;
  // 是否显示多行标题
  multiTitle?: boolean;
  // 表格是否禁用滚动
  disableScroll?: boolean;
}

const Table: FC<TableProps> = ({
  showScrolling = false,
  fixedTopCount = 0,
  fixedLeftCount = 0,
  fixedRightCount = 0,
  canChecked = false,
  canSort = false,
  canFilter = false,
  canResize = false,
  canDragOrder = false,
  canDragSortRow = false,
  showEmpty = false,
  multiTitle = false,
  disableScroll = false,
}) => {
  // 表单数据相关
  // 测试用途，请忽略。
  const [initListData, setInitListData] = useState<IPerson[]>([]);
  // 第几页
  const [pageOffset, setPageOffset] = useState(0);
  // 每页多少条记录
  const [pageSize] = useState(50);
  // 表格数据
  const [list, setList] = useState<IPerson[]>([]);
  // 选中的对象
  const [checked, setChecked] = useState<string[]>([]);
  // 列排序
  const [sort, setSort] = useState<{
    [key: string]: 'asc' | 'desc' | undefined;
  }>({});
  // 列筛选
  const [filter, setFilter] = useState<{ [key: string]: any }>({});
  // 分组信息
  const [groups, setGroups] = useState<{ [key: string]: IPerson[] }>({});

  // 宽度百分比配置
  const [widths, changeWidths] = useState<{ [key: string]: number }>({
    name: 0.15,
    age: 0.1,
    region: 0.1,
    city: 0.2,
    email: 0.25,
    phone: 0.15,
    status: 0.1,
    visits: 0.1,
    last_visit: 0.2,
  });

  // 列顺序切换
  const [labels, changeLabels] = useState<string[]>(Object.keys(widths));

  // 获取数据的方式
  const getData = (
    page_offset: number,
    page_size: number,
    sort_data: typeof sort = sort,
    filter_data: typeof filter = filter
  ) => {
    // 处理掉值为undefined的对象
    const sortObj: { [key: string]: 'asc' | 'desc' | undefined } = {};
    Object.entries(sort_data)
      .filter(([_, v]) => !!v)
      .forEach(([k, v]) => {
        sortObj[k] = v;
      });

    const filterObj: { [key: string]: any } = {};
    Object.entries(filter_data)
      .filter(([_, v]) => !!v)
      .forEach(([k, v]) => {
        filterObj[k] = v;
      });

    // 后台需要的请求参数
    const send: { [key: string]: any } = {
      project_id: 'mock',
      page_offset: page_offset, // 第几页
      page_size: page_size, // 每页几条记录
    };

    // 判断是否有排序参数
    if (Object.keys(sortObj).length) {
      send['sort'] = sortObj;
    }

    // 判断是否有筛选参数
    if (Object.keys(filterObj).length) {
      send['filter'] = filterObj;
    }

    console.log('请求数据:', send, ' 选中项:', checked);

    // 返回mock数据
    return makeData(page_size);
  };

  // 下一页数据
  const nextPageData = () => {
    // -1 表示没有后续数据了
    if (pageOffset > -1) {
      // 新的数据
      const res = getData(pageOffset, pageSize);
      if (res.length) {
        setList(list.concat(res));
        // 模拟更新页码, 超过10页，设置为最后一页
        if (pageOffset >= 9) {
          setPageOffset(-1);
        } else {
          // 每次请求，模拟增加1页
          setPageOffset((prev) => prev + 1);
        }
      }
    }
  };

  // 分组响应
  const handleGroup = (item: IPerson, index: number) => {
    // 没有下级属性的返回
    if (!item?.children) return;

    // 拷贝数据
    const data = Array.from(list);

    // 子元素为0的情况
    if (item.children.length === 0) {
      if (groups[item.id]) {
        // 有就移除
        setGroups((prevState) => {
          delete prevState[item.id];
          return prevState;
        });
      } else {
        // 没有就加进去
        setGroups((prevState) => ({ ...prevState, [item.id]: [] }));
      }
    } else {
      if (groups[item.id]) {
        data.splice(index + 1, groups[item.id].length);
        setGroups((prevState) => {
          delete prevState[item.id];
          return prevState;
        });
      } else {
        setGroups((prevState) => ({ ...prevState, [item.id]: item.children! }));
        data.splice(index + 1, 0, ...item.children);
      }
    }

    // 更新数据
    setList(data);
  };

  // 更新排序数据
  const getSortData = (sortData: typeof sort) => {
    // 更新数据
    setSort(() => sortData);

    // 排序变化，需要重新请求，第一页的数据
    const res = getData(0, pageSize, sortData);
    if (res.length) {
      // 重置数据
      setList(res);
      setPageOffset(1);
    }
  };

  useLayoutEffect(() => {
    initData();
  }, []);

  // 初始化
  const initData = () => {
    const arr = getData(0, pageSize);
    if (arr.length) {
      // 更新数据
      setList(arr);
      // 更新页码
      setPageOffset(1);
      // 备份数据
      if (initListData.length === 0) {
        setInitListData(arr);
      }
    }
  };

  // 标题的树形关系(最下层的标题列，必须是widths对象中定义过的，否则无法正确渲染)
  const headerTrees = [
    {
      label: 'root',
      children: [
        {
          label: 'base',
          children: [
            { label: 'name' },
            { label: 'age' },
            { label: 'region' },
            { label: 'city' },
            { label: 'email' },
            { label: 'phone' },
          ],
        },
        {
          label: 'more',
          children: [{ label: 'status' }, { label: 'visits' }, { label: 'last_visit' }],
        },
      ],
    },
  ];

  // 标题列的渲染方法
  const headRenders = {
    root: <span className="truncate">{PersonLabels.root}</span>,
    base: <span className="truncate">{PersonLabels.base}</span>,
    more: <span className="truncate">{PersonLabels.more}</span>,
    name: <span className="truncate">{PersonLabels.name}</span>,
    age: <span className="truncate">{PersonLabels.age}</span>,
    status: <span className="truncate">{PersonLabels.status}</span>,
    region: <span className="truncate">{PersonLabels.region}</span>,
    city: <span className="truncate">{PersonLabels.city}</span>,
    email: <span className="truncate">{PersonLabels.email}</span>,
    phone: <span className="truncate">{PersonLabels.phone}</span>,
    visits: <span className="truncate">{PersonLabels.visits}</span>,
    last_visit: <span className="truncate">{PersonLabels.last_visit}</span>,
  };

  // 更新排序数据
  const getFilterData = (key: string, value: any) => {
    // 更新数据
    setFilter((prevState) => {
      return {
        ...prevState,
        [key]: value,
      };
    });

    // 排序变化，需要重新请求，第一页的数据
    const res = getData(0, pageSize, sort, { ...filter, [key]: value });
    if (res.length) {
      // 重置数据
      setList(res);
      setPageOffset(1);
    }
  };

  // 渲染筛选对象
  const filterRenders = {
    name: (
      <div className="" onClick={() => getFilterData('name', filter['name'] ? undefined : 'aa')}>
        {filter['name'] ? (
          <div className="i-[datasheet/filter-solid] h-3 w-3 text-accent" />
        ) : (
          <div className="i-[datasheet/filter-regular] h-3 w-3 text-secondary" />
        )}
      </div>
    ),
  };

  // 改变排序
  const handleChangeSort = (dataKey: string, status: 'asc' | 'desc' | undefined) => {
    // 判断当前状态，生成下一个状态
    let res: 'asc' | 'desc' | undefined;
    if (status === 'asc') {
      res = 'desc';
    } else if (status === 'desc') {
      res = undefined;
    } else {
      res = 'asc';
    }
    // 更新数据
    getSortData({
      ...sort,
      [dataKey]: res,
    });
  };

  // 渲染排序ICON
  const renderSortIcon = (sortIcon: 'asc' | 'desc' | undefined) => {
    if (sortIcon === 'asc') {
      return <div className="i-[datasheet/arrow-down-small-big-solid] h-3 w-3 text-accent" />;
    } else if (sortIcon === 'desc') {
      return <div className="i-[datasheet/arrow-down-big-small-solid] h-3 w-3 text-accent" />;
    } else {
      return <div className="i-[datasheet/arrow-down-arrow-up-regular] h-3 w-3 text-secondary" />;
    }
  };

  const sortRenders = {
    name: <div onClick={() => handleChangeSort('name', sort['name'])}>{renderSortIcon(sort['name'])}</div>,
    age: <div onClick={() => handleChangeSort('age', sort['age'])}>{renderSortIcon(sort['age'])}</div>,
    status: <div onClick={() => handleChangeSort('status', sort['status'])}>{renderSortIcon(sort['status'])}</div>,
    region: <div onClick={() => handleChangeSort('region', sort['region'])}>{renderSortIcon(sort['region'])}</div>,
    city: <div onClick={() => handleChangeSort('city', sort['city'])}>{renderSortIcon(sort['city'])}</div>,
    email: <div onClick={() => handleChangeSort('email', sort['email'])}>{renderSortIcon(sort['email'])}</div>,
    phone: <div onClick={() => handleChangeSort('phone', sort['phone'])}>{renderSortIcon(sort['phone'])}</div>,
    visits: <div onClick={() => handleChangeSort('visits', sort['visits'])}>{renderSortIcon(sort['visits'])}</div>,
    last_visit: (
      <div onClick={() => handleChangeSort('last_visit', sort['last_visit'])}>{renderSortIcon(sort['last_visit'])}</div>
    ),
  };

  const hasParent = (id: string) => {
    for (const item of list) {
      if (item?.children && item.children.length > 0) {
        const data = item.children.find((o) => o.id === id);
        if (data) {
          return true;
        }
      }
    }
    return false;
  };

  // 所有列的渲染方法
  const cellRenders: {
    [key: string]: (row: IPerson, index: number) => ReactNode;
  } = {
    name: (item, index) => {
      const renderIcon = () => {
        if (!item?.children) {
          return (
            <i className={cx(hasParent(item.id) && 'ml-6')}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-file-earmark-text"
                viewBox="0 0 16 16"
              >
                <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
              </svg>
            </i>
          );
        } else {
          if (item.children.length === 0 || !groups[item.id]) {
            return (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-folder-fill"
                viewBox="0 0 16 16"
              >
                <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z" />
              </svg>
            );
          }
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-folder2-open"
              viewBox="0 0 16 16"
            >
              <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z" />
            </svg>
          );
        }
      };
      const renderPointer = () => {
        if (!item?.children) {
          return <div className="h-3 w-3" />;
        }
        if (!groups[item.id]) {
          return (
            <i className="h-3 w-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-caret-right-fill"
                viewBox="0 0 16 16"
              >
                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
              </svg>
            </i>
          );
        }
        return (
          <i className="h-3 w-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-caret-down-fill"
              viewBox="0 0 16 16"
            >
              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
            </svg>
          </i>
        );
      };
      return (
        <div
          className={cx(
            'relative flex cursor-pointer items-center gap-2',
            'before:absolute before:-inset-y-1 before:-inset-x-2 before:rounded-sm hover:before:bg-fade-50',
            {
              'cursor-auto before:hidden': !item?.children,
            }
          )}
          onClick={() => handleGroup(item, index)}
        >
          {renderPointer()}
          {renderIcon()}
          <span className="truncate">
            {item.name}
            {item?.children && `(${item.children.length})`}- {index}
          </span>
        </div>
      );
    },
    age: (item) => {
      return (
        <div
          onClick={(e) => {
            e.stopPropagation();
            console.log('-------e:', e);
          }}
        >
          <span className="truncate">{item.age}</span>
        </div>
      );
    },
    status: (item) => {
      return <span className="truncate">{item.status}</span>;
    },
    region: (item) => {
      return <span className="truncate">{item.region}</span>;
    },
    city: (item) => {
      return <span className="truncate">{item.city}</span>;
    },
    email: (item) => {
      return <span className="truncate">{item.email}</span>;
    },
    phone: (item) => {
      return <span className="truncate">{item.phone}</span>;
    },
    visits: (item) => {
      return <span className="truncate">{item.visits}</span>;
    },
    last_visit: (item) => {
      return <span className="truncate">{item.last_visit}</span>;
    },
  };

  // 渲染滚动行（滚动的时候，不显示原始内容，显示这个替代行内容）
  const scrollingRender = (index: number) => {
    return <div className="w-full text-center">Scrolling {index}</div>;
  };

  // 空态图
  const emptyDom = useMemo(
    () => <div className="flex h-full w-full items-center justify-center text-secondary">Empty Table</div>,
    []
  );

  // 响应行拖拽放置
  const handleRowDragEnd = (
    source: { row: IPerson; isGroup: boolean; index: number },
    target: { row: IPerson; isGroup: boolean; index: number },
    change: {
      origin: string; // 拖拽对象id
      after?: string; //  放置的目的地的对象ID。target id. 从上往下
      into?: string; // 放进的组的ID.  target id
      before?: string; // 目的地之前的对象ID.  target id   从下往上
    }
  ) => {
    console.log('source:', source);
    console.log('target:', target);
    console.log('change:', change);
  };

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="navbar flex justify-between bg-neutral px-8 text-neutral-content">
        <div className="select-none text-xl">React Window Table</div>
        <div className="gap-2">
          <button className="btn-outline btn-info btn cursor-pointer" onClick={initData}>
            刷新数据
          </button>
        </div>
      </div>
      <div className="flex-1">
        <VirtualTable
          titleHeight={48}
          rowHeight={40}
          headerClass=""
          // rowClass={({ index }) => (index % 2 === 0 ? '!bg-gray-100' : '')}
          rowClick={({ event, index, row }) => console.log(index, event, row)}
          list={showEmpty ? [] : list}
          setList={setList}
          groups={groups}
          setGroups={setGroups}
          widths={widths}
          labels={labels}
          changeLabels={changeLabels}
          nextPage={nextPageData}
          changeWidths={changeWidths}
          canChangeWidths={canResize}
          canDragSortColumn={canDragOrder}
          canDragSortRow={canDragSortRow}
          onDragRowEnd={handleRowDragEnd}
          textLayout="left"
          disableScroll={disableScroll}
          headRenders={headRenders}
          cellRenders={cellRenders}
          headerTrees={multiTitle ? headerTrees : []}
          scrollingRender={showScrolling ? scrollingRender : undefined}
          fixedTopCount={fixedTopCount}
          fixedLeftCount={fixedLeftCount}
          fixedRightCount={fixedRightCount}
          canChecked={canChecked}
          checked={checked}
          setChecked={setChecked}
          sortRenders={canSort ? sortRenders : undefined}
          filterRenders={canFilter ? filterRenders : undefined}
          emptyNode={emptyDom}
        />
      </div>
    </div>
  );
};

export default Table;
