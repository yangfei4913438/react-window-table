import cx from 'classnames';
import React, { forwardRef, useContext, useEffect, useRef } from 'react';
import { checkBoxWidth, dragIconWidth, VirtualTableContext } from './consts';

interface IndeterminateCheckboxProps {
  indeterminate: boolean;
  checked: boolean;
  value: string;
  onClick: () => void;
  className?: string;
}

const IndeterminateCheckbox = forwardRef(
  (
    {
      indeterminate = false,
      checked = false,
      value,
      className,
      onClick,
      ...rest
    }: IndeterminateCheckboxProps &
      React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    ref: any
  ) => {
    const { canDragSortRow } = useContext(VirtualTableContext);

    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <div
        role="cell"
        className={cx('sticky left-0 z-2 flex h-full items-center justify-center bg-body', className)}
        style={{
          minWidth: checkBoxWidth,
          left: canDragSortRow ? dragIconWidth : 0,
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
          type="checkbox"
          className="checkbox checkbox-sm"
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
