// app editor hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/04 17:22

import { useState, useEffect, useCallback } from 'react';
import { queryApps } from '../../service';

export function useFeMicroMainProjectOptions(visible?: boolean) {
  const [data, setData] = useState<IOption[]>([]);

  const loadData = useCallback(async () => {
    const appList = await queryApps({
      appType: 'frontend',
      projectType: 'micro',
      microFeType: 'mainProject',
      pageIndex: 1,
      pageSize: 100,
    });

    let next: IOption[] = appList.map((item) => ({
      label: item.appName,
      value: item.appCode,
    }));

    setData(next);
  }, []);

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  return [data];
}
