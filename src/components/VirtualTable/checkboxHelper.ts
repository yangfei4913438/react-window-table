import { intersection } from 'lodash';

export const inArray = (maxArr: string[], minArr: string[]) => {
  const arr = intersection(maxArr, minArr);
  return arr.length === minArr.length;
};
