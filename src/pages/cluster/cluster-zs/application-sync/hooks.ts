// 应用同步 hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/28 10:12

import { useState, useEffect } from 'react';
import * as APIS from '../service';
import { getRequest } from '@/utils/request';
import { getCommonEnvCode } from '../../hook';
import appConfig from '@/app.config';

export function useAppOptions() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    let commonEnvCode = '';
    if (appConfig.IS_Matrix !== 'public') {
      getRequest(getCommonEnvCode)
        .then((result) => {
          if (result?.success) {
            commonEnvCode = result.data;
          }
        })
        .then(() => {
          getRequest(APIS.queryAppList, { data: { envCode: commonEnvCode } }).then((result) => {
            const next = (result.data || []).map((item: any) => {
              return { label: item.appCode, value: item.appCode };
            });
            setData(next);
          });
        });
    }
  }, []);

  return [data];
}
