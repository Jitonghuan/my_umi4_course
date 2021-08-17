// prometheus editor hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/17 09:17

import { useState, useEffect } from 'react';
import useRequest from '@/utils/useRequest';
import { queryappManageList, queryappManageEnvList } from '../../services';
import { SelectOptions } from '../../interfaces';

interface UsePublicDataProps {
  appCode: string;
}

export const usePublicData = (props: UsePublicDataProps) => {
  const { appCode } = props;

  const { run: queryappManageListFun, data: appManageListData } = useRequest({
    api: queryappManageList,
    method: 'GET',
    formatData: (data) => {
      return data.dataSource?.map((v: any) => {
        return {
          ...v,
          key: v?.appCode,
          value: v?.appCode,
        };
      });
    },
  });

  const { run: queryappManageEnvListFun, data: appManageEnvData } = useRequest({
    api: queryappManageEnvList,
    method: 'GET',
    formatData: (data) => {
      return data.dataSource?.map((v: any) => {
        return {
          ...v,
          key: v?.envCode,
          value: v?.envCode,
        };
      });
    },
  });

  useEffect(() => {
    queryappManageListFun({ pageSize: '-1' });
  }, []);

  useEffect(() => {
    if (!appCode) return;
    queryappManageEnvListFun({ appCode, pageSize: '-1' });
  }, [appCode]);

  return {
    appManageListData,
    appManageEnvData: appCode ? appManageEnvData : [],
  };
};

export function useIntervalOptions() {
  const [data, setData] = useState<SelectOptions[]>([]);

  useEffect(() => {
    setData([
      { label: '15s', value: '15s', key: '15s' },
      { label: '30s', value: '30s', key: '30s' },
      { label: '60s', value: '60s', key: '60s' },
    ]);
  }, []);

  return [data];
}
