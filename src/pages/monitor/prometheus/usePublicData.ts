import { useState, useEffect } from 'react';
import useRequest from '@/utils/useRequest';
import { queryappManageList, queryappManageEnvList } from '../service';

interface UsePublicDataProps {
  appCode: string;
}

const usePublicData = (props: UsePublicDataProps) => {
  const { appCode } = props;
  console.log(appCode, '0000');

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

  return {
    appManageListData,
    appManageEnvData,
  };
};

export default usePublicData;
