// editor hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/16 17:00

import { useState, useEffect } from 'react';
// import * as APIS from '../../service';

export function useVarTypeOptions() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData([
      // { value: 'function', label: '函数' },
      // { value: 'env', label: '环境变量' },
      //{ value: 'custom', label: '自定义值' },
      { value: 'String', label: 'String' }, // 字符串
      { value: 'Integer', label: 'Integer' }, // 整数
      { value: 'Float', label: 'Float' }, // 浮点数
      { value: 'Boolean', label: 'Boolean' }, // 布尔型
      { value: 'List', label: 'List' }, // 数组
      { value: 'Dict', label: 'Dict' }, // 对象
      { value: 'None', label: 'None' },
    ]);
  }, []);

  return [data];
}

export function useOperationTypeOptions() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData([
      { value: 'SQL', label: 'SQL 脚本' },
      { value: 'HTTP', label: 'HTTP 请求' },
      { value: 'DUBBO', label: 'DUBBO 请求' },
    ]);
  }, []);

  return [data];
}
