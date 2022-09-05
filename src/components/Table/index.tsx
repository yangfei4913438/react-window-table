import { type FC, type ReactNode, useState, useLayoutEffect, useMemo } from 'react';
import { type IPerson, makeData, PersonLabels } from './makeData';
import { VirtualTable } from '../VirtualTable';
import cx from 'classnames';

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
  const [checked, setChecked] = useState<number[]>([]);
  // 列排序
  const [sort, setSort] = useState<{ [key: string]: 'asc' | 'desc' | undefined }>({});
  // 列筛选
  const [filter, setFilter] = useState<{ [key: string]: any }>({});
  // 分组信息
  const [groups, setGroups] = useState<{[key: string]: IPerson[]}>({})

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
  const handleGroup = (id: string, index: number) => {
    const data = Array.from(list);
    if (groups[id]) {
      data.splice(index+1, groups[id].length);
      setGroups(prevState => {
        delete prevState[id];
        return prevState
      })
    } else {
      const newData = makeData(2).map(o => {
        return {
          ...o,
          group: true
        }
      })
      setGroups(prevState => ({...prevState, [id]: newData}))
      data.splice(index+1, 0, ...newData);
    }
    setList(data)
  }

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
      <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3 text-lg font-bold">
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
      return (
        <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3" onClick={() => handleGroup(item.id, index)}>
          <span className={cx(item.group && 'bg-red-400')}>{item.name} - {index}</span>
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
      <div className="w-full h-full flex items-center justify-center text-gray-500 bg-[#f6f6f6]">
        Empty Table
      </div>
    ),
    []
  );

  return (
    <div className="p-2 w-full h-screen flex flex-col">
      <div className="navbar bg-neutral text-neutral-content flex justify-between px-8">
        <div className="text-xl select-none">React Window Table</div>
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
          rowClass={(idx) => (checked.includes(idx) || list[idx].group ? '!bg-green-500 hover:bg-green-200' : '')}
          rowClick={(e, idx) => console.log(idx, e)}
          list={list}
          widths={widths}
          labels={labels}
          changeLabels={changeLabels}
          nextPage={nextPageData}
          changeWidths={changeWidths}
          canChangeWidths={true}
          canDragSortColumn={true}
          textLayout="center"
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
