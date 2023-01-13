// hook
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/23 20:38

import { useEffect, useState } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from '../../../basic/services';
import {viewAlertGroup} from '../../../alarm-group/service'

export function useUserOptions() {
  const [source, setSource] = useState<any[]>([]);

  useEffect(() => {
    getRequest(APIS.getUserList).then((result) => {
      if (result?.success) {
        const { usernames } = result?.data || {};
        const next = (usernames || [])?.map((item: string) => ({
          label: item,
          value: item,
          key: item,
        }));
        setSource(next);
      }
    });
  }, []);

  return [source];
}

//viewAlertGroup
export function useGroupOptions() {
  const [source, setSource] = useState<any[]>([]);

  useEffect(() => {
    getRequest(viewAlertGroup,{data:{pageSize:-1,pageIndex:-1}}).then((result) => {
      if (result?.success) {
        const { dataSource } = result?.data || {};
        const next = (dataSource || [])?.map((item: any) => ({
          label: item?.groupName,
          value: item?.groupName,
          key: item?.groupName,
        }));
        setSource(next);
      }
    });
  }, []);

  return [source];
}
