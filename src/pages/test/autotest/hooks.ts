// common hooks for autotest
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/05 15:10

import { useState, useEffect, useCallback, useRef } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from './service';
import { ProjectItemVO, CaseItemVO } from './interfaces';

export function useEnvOptions() {
  const [data, setData] = useState<IOption[]>([]);

  useEffect(() => {
    getRequest(APIS.envList).then((result) => {
      const source = (result.data || []).map((n: any) => ({
        label: n.name,
        value: n.id,
      }));

      setData(source);
    });
  }, []);

  return [data];
}

// 当前可选的项目列表
export function useProjectOptions(): [
  IOption<number, ProjectItemVO>[],
  React.Dispatch<React.SetStateAction<IOption<number, ProjectItemVO>[]>>,
  () => void,
] {
  const [data, setData] = useState<IOption<number, ProjectItemVO>[]>([]);

  const loadData = useCallback(() => {
    getRequest(APIS.getProjects).then((result) => {
      const list = (result.data || []).map((n: any) => ({
        label: n.name,
        value: n.id,
        data: n,
      }));

      setData(list);
    });
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return [data, setData, loadData];
}

/** 获取场景下的 case 列表 */
export function useCaseListByScene(
  sceneId: number,
): [CaseItemVO[], boolean, React.Dispatch<React.SetStateAction<CaseItemVO[]>>, () => Promise<void>] {
  const [data, setData] = useState<CaseItemVO[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const result = await getRequest(APIS.getSceneList, {
        data: { id: sceneId, type: 2, pageIndex: 1, pageSize: 100 },
      });

      const { dataSource } = result.data || {};
      setData(dataSource || []);
    } catch (ex) {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [sceneId]);

  useEffect(() => {
    if (!sceneId) return;

    loadData();
  }, [sceneId]);

  return [data, loading, setData, loadData];
}

export function usePreSavedVars(preCases: React.Key[]) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (preCases?.length === 0) return;
    getRequest(APIS.getPreSavedVars, {
      data: {
        preCases,
      },
    }).then((res) => {
      setData(res.data);
    });
  }, [preCases]);

  return [data];
}
