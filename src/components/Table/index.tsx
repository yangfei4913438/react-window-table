import { type FC, type ReactNode, useState, useLayoutEffect, useMemo } from 'react';
import { type IPerson, makeData, PersonLabels } from './makeData';
import { VirtualTable, inArray } from '../VirtualTable';

interface IProps {}
const Table: FC<IProps> = () => {
  // 表单数据相关
  // 第几页
  const [pageOffset, setPageOffset] = useState(0);
  // 每页多少条记录
  const [pageSize] = useState(100);
  // 表格数据
  const [list, setList] = useState<IPerson[]>([]);
  // 选中的对象
  const [checked, setChecked] = useState<string[]>([]);
  // 列排序
  const [sort, setSort] = useState<{ [key: string]: 'asc' | 'desc' | undefined }>({});
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
    if (!item?.children || item.children.length === 0) return;

    const data = Array.from(list);
    if (groups[item.id]) {
      data.splice(index + 1, groups[item.id].length);
      setGroups((prevState) => {
        delete prevState[item.id];
        return prevState;
      });
    } else {
      setGroups((prevState) => ({ ...prevState, [item.id]: item.children }));
      data.splice(index + 1, 0, ...item.children);
    }
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
    root: (
      <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3 text-lg font-bold">
        {PersonLabels.root}
      </div>
    ),
    base: (
      <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3 text-lg font-bold">
        {PersonLabels.base}
      </div>
    ),
    more: (
      <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3 text-lg font-bold">
        {PersonLabels.more}
      </div>
    ),
    name: (
      <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3 pl-12 text-lg font-bold">
        {PersonLabels.name}
      </div>
    ),
    age: (
      <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3 text-lg font-bold">
        {PersonLabels.age}
      </div>
    ),
    status: (
      <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3 text-lg font-bold">
        {PersonLabels.status}
      </div>
    ),
    region: (
      <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3 text-lg font-bold">
        {PersonLabels.region}
      </div>
    ),
    city: (
      <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3 text-lg font-bold">
        {PersonLabels.city}
      </div>
    ),
    email: (
      <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3 text-lg font-bold">
        {PersonLabels.email}
      </div>
    ),
    phone: (
      <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3 text-lg font-bold">
        {PersonLabels.phone}
      </div>
    ),
    visits: (
      <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3 text-lg font-bold">
        {PersonLabels.visits}
      </div>
    ),
    last_visit: (
      <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3 text-lg font-bold">
        {PersonLabels.last_visit}
      </div>
    ),
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
          <span className="iconfont">&#xe87b;</span>
        ) : (
          <span className="iconfont">&#xe9ce;</span>
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
      return <span className="iconfont">&#xe674;</span>;
    } else if (sortIcon === 'desc') {
      return <span className="iconfont">&#xe671;</span>;
    } else {
      return <span className="iconfont">&#xe625;</span>;
    }
  };

  const sortRenders = {
    name: (
      <div onClick={() => handleChangeSort('name', sort['name'])}>
        {renderSortIcon(sort['name'])}
      </div>
    ),
    age: (
      <div onClick={() => handleChangeSort('age', sort['age'])}>{renderSortIcon(sort['age'])}</div>
    ),
    status: (
      <div onClick={() => handleChangeSort('status', sort['status'])}>
        {renderSortIcon(sort['status'])}
      </div>
    ),
    region: (
      <div onClick={() => handleChangeSort('region', sort['region'])}>
        {renderSortIcon(sort['region'])}
      </div>
    ),
    city: (
      <div onClick={() => handleChangeSort('city', sort['city'])}>
        {renderSortIcon(sort['city'])}
      </div>
    ),
    email: (
      <div onClick={() => handleChangeSort('email', sort['email'])}>
        {renderSortIcon(sort['email'])}
      </div>
    ),
    phone: (
      <div onClick={() => handleChangeSort('phone', sort['phone'])}>
        {renderSortIcon(sort['phone'])}
      </div>
    ),
    visits: (
      <div onClick={() => handleChangeSort('visits', sort['visits'])}>
        {renderSortIcon(sort['visits'])}
      </div>
    ),
    last_visit: (
      <div onClick={() => handleChangeSort('last_visit', sort['last_visit'])}>
        {renderSortIcon(sort['last_visit'])}
      </div>
    ),
  };

  // 所有列的渲染方法
  const cellRenders: { [key: string]: (row: IPerson, index: number) => ReactNode } = {
    name: (item, index) => {
      const renderIcon = () => {
        if (!item?.children) {
          return (
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
        if (!item?.children || item.children.length === 0) {
          return <span className="w-4" />;
        }
        if (!groups[item.id]) {
          return (
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
          );
        }
        return (
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
        );
      };
      return (
        <div
          className="flex items-center space-x-2 overflow-hidden text-ellipsis whitespace-nowrap pr-3"
          onClick={() => handleGroup(item, index)}
        >
          {renderPointer()}
          {renderIcon()}
          <span className={''}>
            {item.name} - {index}
          </span>
        </div>
      );
    },
    age: (item) => {
      return (
        <div
          className="overflow-hidden text-ellipsis whitespace-nowrap px-3"
          onClick={(e) => {
            e.stopPropagation();
            console.log('-------e:', e);
          }}
        >
          {item.age}
        </div>
      );
    },
    status: (item) => {
      return (
        <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3">{item.status}</div>
      );
    },
    region: (item) => {
      return (
        <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3">{item.region}</div>
      );
    },
    city: (item) => {
      return (
        <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3">{item.city}</div>
      );
    },
    email: (item) => {
      return (
        <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3">{item.email}</div>
      );
    },
    phone: (item) => {
      return (
        <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3">{item.phone}</div>
      );
    },
    visits: (item) => {
      return (
        <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3">{item.visits}</div>
      );
    },
    last_visit: (item) => {
      return (
        <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3">
          {item.last_visit}
        </div>
      );
    },
  };

  // 渲染滚动行（滚动的时候，不显示原始内容，显示这个替代行内容）
  // const scrollingRender = (index: number) => {
  //   return <div className="w-full text-center">Scrolling {index}</div>;
  // };

  // 空态图
  const emptyDom = useMemo(
    () => (
      <div className="flex h-full w-full items-center justify-center bg-[#f6f6f6] text-gray-500">
        Empty Table
      </div>
    ),
    []
  );

  return (
    <div className="flex h-screen w-full flex-col p-2">
      <div className="navbar flex justify-between bg-neutral px-8 text-neutral-content">
        <div className="select-none text-xl">React Window Table</div>
        <div className="gap-2">
          <a className="btn" onClick={initData}>
            刷新数据
          </a>
        </div>
      </div>

      <div className="flex-1">
        <VirtualTable
          titleHeight={50}
          rowHeight={45}
          headerClass=""
          rowClass={({ row }) =>
            checked.includes(row.id) ||
            (row.children &&
              row.children.length > 0 &&
              inArray(
                checked,
                row.children.map((o) => o.id)
              ))
              ? '!bg-green-500' + ' hover:bg-green-200'
              : ''
          }
          rowClick={({ event, index, row }) => console.log(index, event, row)}
          list={list}
          widths={widths}
          labels={labels}
          changeLabels={changeLabels}
          nextPage={nextPageData}
          changeWidths={changeWidths}
          canChangeWidths={true}
          canDragSortColumn={true}
          textLayout="left"
          headerTrees={headerTrees}
          headRenders={headRenders}
          cellRenders={cellRenders}
          // scrollingRender={scrollingRender}
          fixedTopCount={1}
          fixedLeftCount={1}
          fixedRightCount={1}
          canChecked={true}
          checked={checked}
          setChecked={setChecked}
          sortRenders={sortRenders}
          filterRenders={filterRenders}
          emptyNode={emptyDom}
        />
      </div>
    </div>
  );
};

export default Table;
