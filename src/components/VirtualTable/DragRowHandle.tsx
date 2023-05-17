import cx from 'classnames';
import { useContext, useMemo } from 'react';
import { dragIconWidth, VirtualTableContext } from './consts';

interface DragRowHandleProps {
  dragRowIcon?: string;
  isDragging?: boolean;
  className?: string;
}

const DragRowHandle = ({ dragRowIcon, isDragging, className, ...rest }: DragRowHandleProps) => {
  const { canChecked, fixedLeftCount } = useContext(VirtualTableContext);

  const leftStyle = useMemo(() => {
    if (fixedLeftCount === 0 && !canChecked) {
      return {
        boxShadow: '1px 0 0 0 #eee',
      };
    }
    return {};
  }, [canChecked, fixedLeftCount]);

  return (
    <div
      role='cell'
      className={cx('sticky left-0 z-2 flex h-full items-center bg-white', className)}
    >
      <div
        aria-label='Drag handle'
        className={cx(
          'group/handle flex h-full items-center justify-center focus:outline-none',
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
        style={{ width: dragIconWidth, ...leftStyle }}
        {...rest}
      >
        {dragRowIcon ?? <i className='bi bi-grip-vertical' />}
      </div>
    </div>
  );
};

export default DragRowHandle;
