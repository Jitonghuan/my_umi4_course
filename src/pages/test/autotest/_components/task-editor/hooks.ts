// hooks for task editor
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/11 15:36

import { useState, useEffect, useCallback } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from '../../service';
import { formatTreeSelectData } from '../../common';

export function useCaseListForTaskEditor() {
  const [data, setData] = useState<any[]>([]);

  const loadData = useCallback(async () => {
    const result = await getRequest(APIS.getProjectsSuiteTree, {
      data: { suiteType: 0 },
    });

    // 项目-模块-接口-用例
    const tree = formatTreeSelectData(result.data || [], 4);
    setData(tree);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return [data];
}

export function useSceneListForTaskEditor() {
  const [data, setData] = useState<any[]>([]);

  const loadData = useCallback(async () => {
    const result = await getRequest(APIS.getProjectsSuiteTree, {
      data: { suiteType: 1 },
    });

    // 项目-模块-场景
    const tree = formatTreeSelectData(result.data || [], 3);
    setData(tree);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return [data];
}
