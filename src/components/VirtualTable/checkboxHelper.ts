import React, { Dispatch } from 'react';

// 选中行
export const handleCheckBox = (
  num: number,
  checked: number[],
  setChecked: Dispatch<React.SetStateAction<number[]>>
) => {
  if (checked.includes(num)) {
    const idx = checked.indexOf(num);
    const list1 = checked.slice(0, idx);
    const list2 = checked.slice(idx + 1, checked.length);
    setChecked(() => list1.concat(list2));
  } else {
    setChecked((prevState) => prevState.concat([num]));
  }
};
