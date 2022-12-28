import { useState, useEffect, useCallback } from 'react';
import { getRequest, postRequest } from '@/utils/request';
import { queryBranchListUrl } from '@/pages/application/service';
import {
  queryPortalList,
  getDemandByProjectList,
  getRegulusProjects,
  getRegulusOnlineBugs,
} from '@/pages/application/service';

// 获取主干分支列表
export function useMasterBranchList(props: any) {
  const [data, setData] = useState<any>([]);
  const loadData = useCallback(
    async (extra?: any) => {
      try {
        const result = await getRequest(queryBranchListUrl, {
          data: { ...props },
        });
        const { dataSource, pageInfo } = result.data || {};
        setData(dataSource || []);
      } catch (ex) {
        setData([]);
      } finally {
      }
    },
    [props],
  );

  useEffect(() => {
    loadData({});
  }, []);

  return [data];
}

// 获取项目列表
export function usePortalList(props: any) {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const loadData = useCallback((extra?: any) => {
    setLoading(true);
    postRequest(queryPortalList)
      .then((res: any) => {
        if (res.success) {
          let dataSource = res.data;
          let dataArry: any = [];
          dataSource?.map((item: any) => {
            dataArry.push({ label: item?.projectName, value: item?.projectId });
          });
          setData(dataArry);
        }
      }).finally(() => { setLoading(false) })
  }, [Object.values(props)])
  return [data, loading, loadData]
}

// 获取regules项目列表
export function useRegulesPortal(props: any) {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const loadData = useCallback((extra: any) => {
    setLoading(true)
    getRequest(getRegulusProjects)
      .then((result) => {
        if (result.success) {
          let dataSource = result.data.projects;
          let dataArry: any = [];
          dataSource?.map((item: any) => {
            dataArry.push({ label: item?.name, value: item?.id });
          });
          setData(dataArry);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [Object.values(props)])
  return [data, loading, loadData]
}

// 获取需求下面的需求列表
export function useDemands(props: any) {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const loadData = useCallback((extra?: any) => {
    postRequest(getDemandByProjectList, {
      data: { ...props, ...extra },
    })
      .then((result) => {
        if (result.success) {
          let dataSource = result.data;
          let dataArry: any = [];
          dataSource?.map((item: any) => {
            dataArry.push({ label: item?.title, value: item?.id });
          });
          setData(dataArry);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [Object.values(props)])
  return [data, loading, loadData]
}

// 获取线上bug
export function useRegulusOnlineBugs(props: any) {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const loadData = useCallback((extra?: any) => {
    getRequest(getRegulusOnlineBugs, {
      data: { ...props, ...extra, pageSize: -1 },
    })
      .then((res) => {
        if (res?.success) {
          let dataArry: any = [];
          (res?.data?.dataSource || [])?.map((item: any) => {
            dataArry.push({ label: item?.name, value: item?.id });
          });
          setData(dataArry);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [Object.values(props)])
  return [data, loading, loadData]
}
