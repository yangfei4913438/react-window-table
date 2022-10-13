import cx from 'classnames';
import { dragIconWidth } from './consts';

interface DragRowHandleProps {
  dragRowIcon?: string;
  isDragging?: boolean;
}

const DragRowHandle = ({ dragRowIcon, isDragging, ...rest }: DragRowHandleProps) => {
  return (
    <div
      className={cx('tx-virtual-table__drag_icon', isDragging ? 'cursor-grabbing' : 'cursor-grab')}
      style={{ width: dragIconWidth }}
      {...rest}
    >
      {dragRowIcon ?? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-grip-vertical"
          viewBox="0 0 16 16"
        >
          <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
        </svg>
      )}
    </div>
  );
};

export default DragRowHandle;
