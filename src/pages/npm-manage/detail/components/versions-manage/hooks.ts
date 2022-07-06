import { useState, useEffect, useCallback } from 'react';
import { getRequest } from '@/utils/request';
import { getVersionList, getTagList } from '@/pages/npm-manage/detail/server';
import { AppItemVO } from '@/pages/npm-manage/detail/interfaces';
import { FeVersionItemVO } from './types';

export function useFeVersions(npmData: AppItemVO): [Record<string, FeVersionItemVO[]>, boolean, () => Promise<void>] {
  const [data, setData] = useState<Record<string, FeVersionItemVO[]>>({});
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!npmData?.npmName) {
      return setData({});
    }

    setLoading(true);

    try {
      const result = await getRequest(getVersionList, {
        data: {
          npmName: npmData.npmName,
          pageSize: 50,
          pageIndex: 1,
        },
      });

      const { dataSource } = result.data || {};
      // 按照 envCode 分组
      const list: FeVersionItemVO[] = dataSource || [];
      const next = list.reduce((prev, curr) => {
        prev[curr.envCode] = prev[curr.envCode] || [];
        prev[curr.envCode].push(curr);
        return prev;
      }, {} as Record<string, FeVersionItemVO[]>);

      setData(next);
    } finally {
      setLoading(false);
    }
  }, [npmData]);

  useEffect(() => {
    void loadData();
  }, [npmData]);

  return [data, loading, loadData];
}

// 获取npm 发布过的tag列表
export function useAppEnvCodeData(appCode?: string): [Record<string, any[]>, boolean] {
  const [data, setData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!appCode) {
      return setData({});
    }

    setLoading(true);
    try {
      const result = await getRequest(getTagList, {
        data: {
          appCode,
          pageSize: -1,
        },
      });
      const next: any[] = result.data || [];
      // 根据 envTypeCode 分成多组
      const map: Record<string, any[]> = {};
      next.forEach((n) => {
        if (n.proEnvType === 'benchmark') {
          map[n.envTypeCode] = map[n.envTypeCode] || [];
          map[n.envTypeCode].push(n);
        }
      });
      setData(map);
    } finally {
      setLoading(false);
    }
  }, [appCode]);

  useEffect(() => {
    void loadData();
  }, [appCode]);

  return [data, loading];
}
