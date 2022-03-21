import { addAPIPrefix } from '@/utils';
import { useState, useEffect, useCallback } from 'react';
import { getRequest } from '@/utils/request';
import appConfig from '@/app.config';

export function useCommonEnvCode() {
  const [source, setSource] = useState<string>('hbos-test');
  /** GET 获取envCode */
  const getCommonEnvCode = addAPIPrefix('/opsManage/multiple/common/getEnvCode');

  useEffect(() => {
    if (appConfig.PRIVATE_METHODS === 'public') {
      setSource('hbos-test');
    } else {
      getRequest(getCommonEnvCode, {
        data: { pageSize: -1 },
      }).then((result) => {
        if (result?.success) {
          setSource(result.data);
        }
      });
    }
  }, []);

  return [source];
}
