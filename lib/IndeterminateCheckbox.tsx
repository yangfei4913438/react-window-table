import { Checkbox } from 'antd';
import cx from 'classnames';
import React, { FC, useContext, useMemo, useState } from 'react';

import { checkBoxWidth, dragIconWidth, VirtualTableContext } from './consts';

interface IndeterminateCheckboxProps {
  order?: number;
  indeterminate: boolean;
  checked: boolean;
  onClick: () => void;
  className?: string;
}

const IndeterminateCheckbox: FC<IndeterminateCheckboxProps> = ({
  order = 0,
  indeterminate = false,
  checked = false,
  className = '',
  onClick,
}) => {
  const { canDragSortRow, fixedLeftCount, canChecked } = useContext(VirtualTableContext);
  const [hover, setHover] = useState(false);

  const leftStyle = useMemo(() => {
    if (fixedLeftCount === 0) {
      return {
        boxShadow: '1px 0 0 0 #eee',
      };
    }
    return {};
  }, [fixedLeftCount]);

  const RenderNumber = () => {
    if (order > 0) {
      return <div className='text-gray-700'>{order}</div>;
    }
    return null;
  };

  return (
    <div
      role='cell'
      className={cx(
        'sticky left-0 z-2 flex h-full items-center justify-center bg-white',
        className
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        minWidth: checkBoxWidth,
        left: canDragSortRow ? dragIconWidth : 0,
        ...leftStyle,
      }}
      onClick={(e) => {
        // 阻止冒泡，避免触发行点击事件。
        e.stopPropagation();
        // 判断是否能点击
        if (!canChecked) return;
        // 执行回掉方法
        onClick();
      }}
      onKeyPress={(e) => {
        // 判断是否能点击
        if (!canChecked) return;
        // 空格键响应
        if (e.code === 'Space') {
          // 阻止冒泡，避免触发行点击事件。
          e.stopPropagation();
          // 执行回掉方法
          onClick();
        }
      }}
      onKeyDown={(e) => {
        // 判断是否能点击
        if (!canChecked) return;
        // 回车响应
        if (e.key === 'Enter') {
          // 阻止冒泡，避免触发行点击事件。
          e.stopPropagation();
          // 执行回掉方法
          onClick();
        }
      }}
    >
      {canChecked && (hover || checked || indeterminate) ? (
        <Checkbox indeterminate={indeterminate} checked={checked} />
      ) : (
        <RenderNumber />
      )}
    </div>
  );
};

IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';

export default IndeterminateCheckbox;
