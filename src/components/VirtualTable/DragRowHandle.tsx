import cx from 'classnames';

interface DragRowHandleProps {
  dragRowIcon?: string;
  isDragging?: boolean;
}

const DragRowHandle = ({ dragRowIcon, isDragging, ...rest }: DragRowHandleProps) => {
  return (
    <div
      className={cx(
        'sticky left-0 z-50 flex h-full items-center bg-inherit px-3 px-4',
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      )}
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
