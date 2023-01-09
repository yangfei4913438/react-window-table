import cx from 'classnames';
import { dragIconWidth } from './consts';

interface DragRowHandleProps {
  dragRowIcon?: string;
  isDragging?: boolean;
  className?: string;
}

const DragRowHandle = ({ dragRowIcon, isDragging, className, ...rest }: DragRowHandleProps) => {
  return (
    <div role="cell" className={cx('sticky left-0 z-2 flex h-full items-center justify-center bg-body', className)}>
      <div
        aria-label="Drag handle"
        className={cx(
          'group/handle focus:outline-none',
          'flex h-full items-center overflow-hidden',
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
        style={{ width: dragIconWidth }}
        {...rest}
      >
        <div className="rounded-sm p-0.5 ring-primary/50 group-focus/handle:ring-2">
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
      </div>
    </div>
  );
};

export default DragRowHandle;
