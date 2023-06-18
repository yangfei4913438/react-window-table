import { useCallback, useEffect } from 'react';

const useTableScroll = (tableContainer: HTMLDivElement | null) => {
  const detectTableScrolling = useCallback((event: Event) => {
    const tableOuter = event.currentTarget as HTMLDivElement;
    const tableInner = tableOuter.firstElementChild as HTMLDivElement;

    if (tableInner && tableOuter) {
      const { x, y } = tableInner.getBoundingClientRect();
      const { top, left } = tableOuter.getBoundingClientRect();

      if (y < top && !tableOuter.hasAttribute('data-vertical-scroll')) {
        tableOuter.setAttribute('data-vertical-scroll', '');
      } else if (y >= top && tableOuter.hasAttribute('data-vertical-scroll')) {
        tableOuter.removeAttribute('data-vertical-scroll');
      }

      if (x < left && !tableOuter.hasAttribute('data-horizontal-scroll')) {
        tableOuter.setAttribute('data-horizontal-scroll', '');
      } else if (x >= left && tableOuter.hasAttribute('data-horizontal-scroll')) {
        tableOuter.removeAttribute('data-horizontal-scroll');
      }
    }
  }, []);

  useEffect(() => {
    if (tableContainer === null) return;
    tableContainer.addEventListener('scroll', detectTableScrolling);
    return () => tableContainer.removeEventListener('scroll', detectTableScrolling);
  }, [detectTableScrolling, tableContainer]);
};

export default useTableScroll;
