import { useCallback, useContext, useEffect, useState } from 'react';
import { VirtualTableContext } from './consts';

const useTableScroll = () => {
  const { titleHeight, headerList, headerTrees } = useContext(VirtualTableContext);

  const [containerYClass, setContainerYClass] = useState('');
  const [containerXClass, setContainerXClass] = useState('');

  const getScroll = useCallback(() => {
    const dom = document.querySelector('.tx-virtual-table');
    if (dom) {
      const style = dom.getBoundingClientRect();
      // 计算滚动区域上面的高度
      const start = headerTrees.length ? headerList.length * titleHeight : titleHeight;

      // 页面滚动之后，y的值会小于start的值
      if (style.y < start && containerYClass !== 'tx-virtual-table--y-scrolling') {
        setContainerYClass('tx-virtual-table--y-scrolling');
      } else if (style.y >= start && containerYClass === 'tx-virtual-table--y-scrolling') {
        setContainerYClass('');
      }
      // 页面滚动之后，x的值会小于0
      if (style.x < 0 && containerXClass !== 'tx-virtual-table--x-scrolling') {
        setContainerXClass('tx-virtual-table--x-scrolling');
      } else if (style.x >= 0 && containerXClass === 'tx-virtual-table--x-scrolling') {
        setContainerXClass('');
      }
    }
  }, [headerTrees.length, headerList.length, titleHeight, containerYClass, containerXClass]);

  useEffect(() => {
    const dom = document.querySelector('.tx-virtual-table__container');
    if (dom) {
      dom.addEventListener('scroll', getScroll);
    }
    return () => {
      if (dom) {
        dom.removeEventListener('scroll', getScroll);
      }
    };
  }, [getScroll]);

  // 返回类名
  return { containerYClass, containerXClass };
};

export default useTableScroll;
