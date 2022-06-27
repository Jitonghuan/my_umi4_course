
import {AppItemVO} from "@/pages/application/interfaces";
import { useCallback, useEffect, useState} from 'react';
import { queryApps } from "@/pages/application/service";

// 获取详情
export function useNpmDetail(appId?: number, appCode?: string): [AppItemVO | undefined, boolean, () => Promise<void>] {
  const [data, setData] = useState<AppItemVO>();
  const [loading, setLoading] = useState(false);
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const appList = await queryApps({
        id: appId || undefined,
        // 有 appId 时就不需要 appCode
        appCode: appId ? undefined : appCode,
        pageIndex: 1,
        pageSize: 10,
      });
      appList?.map((item: any) => {
        if (appCode) {
          if (item?.appCode === appCode) {
            setData(item);
          }
          return;
        } else if (appId) {
          if (item?.id === appId) {
            setData(item);
          }
          return;
        }
      });
    } finally {
      setLoading(false);
    }
  }, [appId, appCode]);

  useEffect(() => {
    if (!appId && !appCode) {
      setLoading(false);
      return setData(undefined);
    }

    loadData();
  }, [appId, appCode]);

  return [data, loading, loadData];
}
