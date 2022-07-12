import { AppItemVO } from './interfaces';
import { useCallback, useEffect, useState} from 'react';
import { npmList, queryBranchListUrl } from  './server';
import { getRequest } from '@/utils/request';

// 获取详情
export function useNpmDetail(npmId?: number, npmName?: string): [AppItemVO | undefined, boolean, () => Promise<void>] {
  const [data, setData] = useState<AppItemVO>();
  const [loading, setLoading] = useState(false);
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getRequest(npmList, {
        data: {
          id: npmId || undefined,
          npmName: npmId ? undefined : npmName,
          pageIndex: 1,
          pageSize: 10,
        }
      });
      const { dataSource } = res?.data || {}
      dataSource?.map((item: any) => {
        if (npmName) {
          if (item?.npmName === npmName) {
            setData(item);
          }
          return;
        } else if (npmId) {
          if (item?.id === npmId) {
            setData(item);
          }
          return;
        }
      });
    } finally {
      setLoading(false);
    }
  }, [npmId, npmName]);

  useEffect(() => {
    if (!npmId && !npmName) {
      setLoading(false);
      return setData(undefined);
    }

    void loadData();
  }, [npmId, npmName]);

  return [data, loading, loadData];
}



// 获取主干分支列表
export function useMasterBranchList(props: any) {
  const [data, setData] = useState<any>([]);
  const loadData = useCallback(
    async (extra?: any) => {
      try {
        const result = await getRequest(queryBranchListUrl, {
          data: { ...props },
        });
        const { dataSource } = result.data || {};
        setData(dataSource || []);
      } catch (ex) {
        setData([]);
      } finally {
      }
    },
    [props],
  );

  useEffect(() => {
    void loadData({});
  }, []);

  return [data];
}
