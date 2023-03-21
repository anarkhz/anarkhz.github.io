import _ from "lodash";

export function randomExtraction(
  arr: any[],
  length = 1,
  allowDuplicates = false
) {
  if (arr.length < length) return arr;

  const indexArr: number[] = [];

  while (indexArr.length < length) {
    const sign = Math.floor(Math.random() * arr.length);
    if (allowDuplicates) {
      indexArr.push(sign);
    } else if (!indexArr.includes(sign)) {
      indexArr.push(sign);
    }
  }

  const result = _.cloneDeep(indexArr.map((i) => arr[i]));

  return result;
}
