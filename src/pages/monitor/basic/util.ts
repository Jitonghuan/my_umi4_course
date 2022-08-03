import { Item } from './typing';
/**
 * 根据百分比返回颜色值，0~80绿色，80~80橙色，90~100红色
 * @param value 百分比值
 * @returns 颜色值
 */
export const getColorByValue = (value: string) => {
  if (!value || isNaN(Number(value))) {
    return '';
  }
  const nVal = Number(value);
  if (nVal < 80) {
    return '#439D75';
  } else if (nVal < 90) {
    return '#D16F0D';
  } else {
    return '#CC4631';
  }
};

export const stepTableMap = (data: Item[]) => {
  const obj: Record<string, string> = {};
  data.forEach((item) => {
    const str = item.key;
    if (str) {
      obj[str] = item.value as string;
    }
  });
  return obj;
};

// 数组转map
export const formatTableDataMap = (value: Record<string, string> = {}) => {
  const item = value ?? {};

  const labels = Object.keys(item).map((v, i) => {
    return {
      id: i,
      key: v,
      value: item[v],
    };
  });

  return labels;
};
