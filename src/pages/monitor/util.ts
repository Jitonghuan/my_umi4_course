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
