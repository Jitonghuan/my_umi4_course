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
      { value: 'custom', label: '自定义值' },
    ]);
  }, []);

  return [data];
}

export function useOperationTypeOptions() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData([
      { value: 'SQL', label: 'SQL' },
      { value: 'HTTP', label: 'HTTP' },
      { value: 'DUBBO', label: 'DUBBO' },
    ]);
  }, []);

  return [data];
}
