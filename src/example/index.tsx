import { type FC, type ReactNode, useState, useLayoutEffect, useMemo } from 'react';
import { Navbar, Typography, Button, Checkbox, Input } from '@material-tailwind/react';
import { type IPerson, makeData, PersonLabels } from './makeData';
import { VirtualTable } from 'components/VirtualTable';
import cx from 'classnames';
import { names, options } from './consts';

const Example: FC = () => {
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

  const [state, setState] = useState<{ [key: string]: boolean | number }>(options);

  const renderOptions = () => {
    return Object.entries(names).map(([key, name]) => {
      return (
        <div className="!mt-0 flex items-center justify-between space-x-1" key={key}>
          {typeof state[key] === 'boolean' ? (
            <Checkbox
              id={key}
              label={name}
              checked={state?.[key] as boolean}
              onChange={(e) =>
                setState((prevState) => {
                  return {
                    ...prevState,
                    [key]: e.target.checked,
                  };
                })
              }
            />
          ) : (
            <Input
              id={key}
              label={name}
              type="number"
              value={state?.[key] as number}
              min={0}
              onChange={(e) =>
                setState((prevState) => {
                  return {
                    ...prevState,
                    [key]: Number(e.target.value),
                  };
                })
              }
            />
          )}
        </div>
      );
    });
  };

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
        {filter['name'] ? <i className="bi bi-funnel-fill"></i> : <i className="bi bi-funnel"></i>}
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
      return <i className="bi bi-chevron-down"></i>;
    } else if (sortIcon === 'desc') {
      return <i className="bi bi-chevron-up"></i>;
    } else {
      return <i className="bi bi-chevron-expand"></i>;
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
              <i className="bi bi-file-earmark-text"></i>
            </i>
          );
        } else {
          if (item.children.length === 0 || !groups[item.id]) {
            return <i className="bi bi-folder-fill"></i>;
          }
          return <i className="bi bi-folder2-open"></i>;
        }
      };
      const renderPointer = () => {
        if (!item?.children) {
          return <div className="h-3 w-3" />;
        }
        if (!groups[item.id]) {
          return <i className="bi bi-caret-right-fill"></i>;
        }
        return <i className="bi bi-caret-down-fill"></i>;
      };
      return (
        <div
          className={cx(
            'relative box-border flex cursor-pointer items-center gap-2 overflow-hidden',
            'hover:before:bg-fade-50 before:absolute before:-inset-y-1 before:-inset-x-2 before:rounded-sm',
            {
              'cursor-auto before:hidden': !item?.children,
            }
          )}
          onClick={() => handleGroup(item, index)}
        >
          {renderPointer()}
          {renderIcon()}
          <div className="truncate">
            {item.name}
            {item?.children && `(${item.children.length})`}- {index}
          </div>
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
    () => <div className="text-secondary flex h-full w-full items-center justify-center">Empty Table</div>,
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
    <div className="flex h-screen w-screen flex-col space-y-1">
      <Navbar color="white" fullWidth>
        <div className="flex-between container mx-auto">
          <Typography variant="h5" color="black" className="mr-4 cursor-pointer py-1.5">
            React Window Table
          </Typography>
          <Button color="blue" size="sm" onClick={initData}>
            刷新数据
          </Button>
        </div>
      </Navbar>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-1/6 flex-col space-y-4 overflow-auto border-r border-r-gray-100 bg-gray-100 p-4">
          <div className="flex h-6 items-center text-xl font-bold">
            <h1>控制面版</h1>
          </div>
          {renderOptions()}
        </div>
        <div className="flex-1">
          <VirtualTable
            titleHeight={48}
            rowHeight={40}
            headerClass=""
            // rowClass={({ index }) => (index % 2 === 0 ? '!bg-gray-100' : '')}
            rowClick={({ event, index, row }) => console.log(index, event, row)}
            list={state?.showEmpty ? [] : list}
            setList={setList}
            groups={groups}
            setGroups={setGroups}
            widths={widths}
            labels={labels}
            changeLabels={changeLabels}
            nextPage={nextPageData}
            changeWidths={changeWidths}
            canChangeWidths={state?.canResize as boolean}
            canDragSortColumn={state?.canDragOrder as boolean}
            canDragSortRow={state?.canDragSortRow as boolean}
            canChecked={state?.canChecked as boolean}
            fixedLeftCount={state?.fixedLeftCount as number}
            fixedRightCount={state?.fixedRightCount as number}
            fixedTopCount={state?.fixedTopCount as number}
            onDragRowEnd={handleRowDragEnd}
            textLayout="left"
            disableScroll={false}
            headRenders={headRenders}
            cellRenders={cellRenders}
            headerTrees={state?.multiTitle ? headerTrees : []}
            scrollingRender={state?.showScrolling ? scrollingRender : undefined}
            checked={checked}
            setChecked={setChecked}
            sortRenders={state?.canSort ? sortRenders : undefined}
            filterRenders={state?.canFilter ? filterRenders : undefined}
            emptyNode={emptyDom}
          />
        </div>
      </div>
    </div>
  );
};

export default Example;
