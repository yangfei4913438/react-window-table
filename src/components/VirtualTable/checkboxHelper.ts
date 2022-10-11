import intersection from 'lodash-es/intersection';

export const inArray = (maxArr: string[], minArr: string[]) => {
  const arr = intersection(maxArr, minArr);
  return arr.length === minArr.length;
};
