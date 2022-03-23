import { addAPIPrefix } from '@/utils';
import { useState, useEffect, useCallback } from 'react';
import { getRequest } from '@/utils/request';
import appConfig from '@/app.config';

export function useCommonEnvCode() {
  const [source, setSource] = useState<string>('');
  /** GET 获取envCode */
  const getCommonEnvCode = addAPIPrefix('/opsManage/multiple/common/getEnvCode');

  useEffect(() => {
    if (appConfig.IS_Matrix === 'public') {
      setSource('hbos-test');
    } else {
      getRequest(getCommonEnvCode).then((result) => {
        if (result?.success) {
          setSource(result.data);
        }
      });
    }
  }, []);

  return [source];
}
