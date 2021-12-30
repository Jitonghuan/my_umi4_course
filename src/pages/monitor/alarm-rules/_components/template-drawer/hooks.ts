// hook
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/23 20:38

import { useEffect, useState } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from '../../../basic/services';

export function useUserOptions() {
  const [source, setSource] = useState<any[]>([]);

  useEffect(() => {
    getRequest(APIS.getUserList).then((result) => {
      const { usernames } = result.data || {};
      const next = (usernames || []).map((item: string) => ({
        label: item,
        value: item,
        key: item,
      }));

      setSource(next);
    });
  }, []);

  return [source];
}
