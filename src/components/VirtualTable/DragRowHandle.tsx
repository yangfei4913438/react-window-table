import cx from 'classnames';
import { dragIconWidth, VirtualTableContext } from './consts';
import { useContext, useMemo } from 'react';

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
  }, [fixedLeftCount]);

  return (
    <div role="cell" className={cx('z-2 sticky left-0 flex h-full items-center bg-white', className)}>
      <div
        aria-label="Drag handle"
        className={cx(
          'group/handle flex h-full items-center justify-center focus:outline-none',
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
        style={{ width: dragIconWidth, ...leftStyle }}
        {...rest}
      >
        {dragRowIcon ?? <i className="bi bi-grip-vertical"></i>}
      </div>
    </div>
  );
};

export default DragRowHandle;
