import { useRef } from 'react';
import useResizeObserver from 'use-resize-observer';

interface ResizeProps {
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
}

const useResize = ({ setWidth, setHeight }: ResizeProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { width = ref.current?.offsetWidth || 0, height = ref.current?.offsetHeight || 0 } =
    useResizeObserver<HTMLDivElement>({
      ref: ref,
      box: 'border-box',
      round: Math.floor,
      onResize: ({ width, height }) => {
        setWidth(width as number);
        setHeight(height ?? ref.current?.offsetHeight ?? document.body.offsetHeight);
      },
    });

  return {
    resizeRef: ref,
    width,
    height,
  };
};

export default useResize;
