import cx from 'classnames';
import React, { forwardRef, useContext, useEffect, useRef, useMemo } from 'react';
import { checkBoxWidth, dragIconWidth, VirtualTableContext } from './consts';

interface IndeterminateCheckboxProps {
  indeterminate: boolean;
  onClick: () => void;
  className?: string;
}

const IndeterminateCheckbox = forwardRef(
  (
    {
      indeterminate = false,
      className,
      onClick,
      ...rest
    }: IndeterminateCheckboxProps &
      React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    ref: any
  ) => {
    const { canDragSortRow, fixedLeftCount } = useContext(VirtualTableContext);

    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    const leftStyle = useMemo(() => {
      if (fixedLeftCount === 0) {
        return {
          boxShadow: '1px 0 0 0 #eee',
        };
      }
      return {};
    }, [fixedLeftCount]);

    return (
      <div
        role='cell'
        className={cx(
          'sticky left-0 z-2 flex h-full items-center justify-center bg-white',
          className
        )}
        style={{
          minWidth: checkBoxWidth,
          left: canDragSortRow ? dragIconWidth : 0,
          ...leftStyle,
        }}
        onClick={(e) => {
          // 阻止冒泡，避免触发行点击事件。
          e.stopPropagation();
          // 执行回掉方法
          onClick();
        }}
        onKeyPress={(e) => {
          // 空格键响应
          if (e.code === 'Space') {
            // 阻止冒泡，避免触发行点击事件。
            e.stopPropagation();
            // 执行回掉方法
            onClick();
          }
        }}
        onKeyDown={(e) => {
          // 回车响应
          if (e.key === 'Enter') {
            // 阻止冒泡，避免触发行点击事件。
            e.stopPropagation();
            // 执行回掉方法
            onClick();
          }
        }}
      >
        <input
          type='checkbox'
          className='checkbox checkbox-sm'
          ref={resolvedRef}
          onChange={() => undefined}
          {...rest}
        />
      </div>
    );
  }
);

IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';

export default IndeterminateCheckbox;
