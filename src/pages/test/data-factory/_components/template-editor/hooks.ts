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
      { value: 'String', label: '字符串' },
      { value: 'Integer', label: '整数' },
      { value: 'Float', label: '浮点数' },
      { value: 'Boolean', label: '布尔型' },
      { value: 'List', label: '数组' },
      { value: 'Dict', label: '对象' },
    ]);
  }, []);

  return [data];
}

export function useOperationTypeOptions() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData([
      { value: 'SQL', label: 'SQL脚本' },
      { value: 'HTTP', label: 'HTTP请求' },
      { value: 'DUBBO', label: 'DUBBO请求' },
    ]);
  }, []);

  return [data];
}
