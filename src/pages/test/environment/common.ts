// common
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/28 10:37

// export const ENV_CODE_OPTIONS = [
//   { label: '开发环境', value: '1001' },
//   { label: '测试环境', value: '1002' },
//   { label: '预发环境', value: '1003' },
//   { label: '默认环境', value: '0' },
// ];

/** 生成随机的字符串作为 key */
export function randomKey() {
  return Math.round(Date.now() * Math.random())
    .toString(36)
    .toUpperCase();
}
