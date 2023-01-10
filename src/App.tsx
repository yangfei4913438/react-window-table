import Table from 'src/components/Table';
import { useState } from 'react';

const options: { [key: string]: boolean | number } = {
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

const names = {
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

const App = () => {
  const [state, setState] = useState<{ [key: string]: boolean | number }>(options);

  const renderOptions = () => {
    return Object.entries(names).map(([key, name]) => {
      return (
        <div className="flex items-center justify-between gap-2" key={key}>
          <span>{name}</span>
          {typeof state[key] === 'boolean' ? (
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
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
            <input
              type="number"
              className="input-bordered input w-1/3"
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

  return (
    <div className="flex">
      <div className="flex w-1/6 flex-col space-y-4 border-r border-r-gray-100 bg-gray-100 p-4">
        <div className="flex h-6 items-center text-xl font-bold">
          <h1>控制面版</h1>
          <i className="" />
        </div>
        <div className="divider" />
        {renderOptions()}
      </div>
      <div className="flex-1">
        <Table
          canDragSortRow={state?.canDragSortRow as boolean}
          canChecked={state?.canChecked as boolean}
          canResize={state?.canResize as boolean}
          canDragOrder={state?.canDragOrder as boolean}
          canFilter={state?.canFilter as boolean}
          canSort={state?.canSort as boolean}
          fixedLeftCount={state?.fixedLeftCount as number}
          fixedRightCount={state?.fixedRightCount as number}
          fixedTopCount={state?.fixedTopCount as number}
          multiTitle={state?.multiTitle as boolean}
          showEmpty={state?.showEmpty as boolean}
          showScrolling={state?.showScrolling as boolean}
        />
      </div>
    </div>
  );
};

export default App;
