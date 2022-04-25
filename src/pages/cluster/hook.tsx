import { addAPIPrefix } from '@/utils';
import { useState, useEffect, useCallback } from 'react';
import { getRequest } from '@/utils/request';
import appConfig from '@/app.config';
export const getCommonEnvCode = addAPIPrefix('/opsManage/multiple/common/getEnvCode');

export function useCommonEnvCode(): [string, () => Promise<void>] {
  const [source, setSource] = useState<string>('');
  /** GET 获取envCode */
  const getCommonEnvCode = addAPIPrefix('/opsManage/multiple/common/getEnvCode');
  const queryEnvCode = async () => {
    if (appConfig.IS_Matrix !== 'public') {
      setSource('hbos-test');
    } else {
      await getRequest(getCommonEnvCode).then((result) => {
        if (result?.success) {
          setSource(result.data || '');
        }
      });
    }
  };
  useEffect(() => {
    queryEnvCode();
  }, []);

  return [source, queryEnvCode];
}
