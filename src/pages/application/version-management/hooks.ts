// version-management hooks
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/04/25 14:29
import appConfig from '@/app.config';
import { useState, useEffect, useCallback } from 'react';
import { postRequest, getRequest, putRequest } from '@/utils/request';
import { message } from 'antd';

/** GET 创建版本 */
export const createVersion = `${appConfig.apiPrefix}/appManage/version/create`;

/** PUT 编辑版本 */
export const updateVersion = `${appConfig.apiPrefix}/appManage/version/update`;

/** GET 查看版本 */
export const getVersionList = `${appConfig.apiPrefix}/appManage/version/list`;

/*  GET 查询所有应用 */
export const getAppList = `${appConfig.apiPrefix}/appManage/list`;

/** 获取应用组数据 */
export const queryBizData = `${appConfig.apiPrefix}/appManage/group/list`;

/*  GET 查询已绑定或者未绑定应用 */
export const getVersionAppList = `${appConfig.apiPrefix}/appManage/version/listApp`;

/**  GET 查看应用分类接口 */
export const appTypeList = `${appConfig.apiPrefix}/appManage/category/list`;

/* POST 执行绑定应用  */
export const boundApp = `${appConfig.apiPrefix}/appManage/version/boundApp`;

/* 接口逻辑 */
// 获取版本列表
export function useGetVersionList(): [
  any,
  any,
  any,
  boolean,
  (paramObj?: { versionCode?: string; versionName?: string; appCategoryCode?: string }) => Promise<any>,
] {
  const [data, setData] = useState<any[]>([]);
  const [pageInfo, setPageInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const loadData = useCallback(
    async (paramObj?: { versionCode?: string; versionName?: string; appCategoryCode?: string }) => {
      setLoading(true);
      await getRequest(getVersionList, { data: paramObj })
        .then((res) => {
          if (res?.success) {
            let dataSource = res.data.dataSource;
            let pageInfo = res.data.pageInfo;
            setData(dataSource);
            setPageInfo({
              pageIndex: pageInfo.pageIndex,
              pageSize: pageInfo.pageSize,
              total: pageInfo.total,
            });
          } else {
            setData([]);
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [],
  );

  useEffect(() => {
    loadData();
  }, []);

  return [data, pageInfo, setPageInfo, loading, loadData];
}

// 创建版本
export function useCreateVersion(): [
  boolean,
  (paramsObj: {
    versionCode: string;
    versionName: string;
    appCategoryCode: string;
    apps: any;
    desc?: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const addVersion = async (paramsObj: {
    versionCode: string;
    versionName: string;
    appCategoryCode: string;
    apps: any;
    desc?: string;
  }) => {
    setLoading(true);
    try {
      await postRequest(createVersion, { data: paramsObj })
        .then((res) => {
          if (res.success) {
            message.success('创建版本成功!');
          } else {
            message.error('创建版本失败！');
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return [loading, addVersion];
}

// 编辑版本
export function useUpdateVersion(): [
  boolean,
  (paramsObj: { id: number; disable: number, versionName: string; desc?: string }) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const editVersion = async (paramsObj: { id: number; disable: number, versionName: string; desc?: string }) => {
    setLoading(true);
    try {
      await putRequest(updateVersion, { data: paramsObj })
        .then((res) => {
          if (res.success) {
            message.success('操作成功!');
          } else {
            // message.error('编辑版本失败！');
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return [loading, editVersion];
}

//创建版本时获取全部应用数据
export function useAppList(): [boolean, any, any, (appCategoryCode: string, appGroupCode?: string) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const [source, setSource] = useState<IOption[]>([]);
  const queryAppsList = async (appCategoryCode: string, appGroupCode?: string) => {
    setLoading(true);
    await getRequest(getAppList, {
      data: { appCategoryCode, appGroupCode, pageSize: -1 },
    })
      .then((result) => {
        if (result?.success) {
          const { dataSource } = result?.data || {};

          setSource(dataSource || []);
        } else {
          setSource([]);
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, source, setSource, queryAppsList];
}

// 获取绑定/未绑定版本的应用
export function useVersionAppList(): [
  boolean,
  any,
  any,
  (paramsObj: { versionCode: string; appCategoryCode: string; isBoundVersion: boolean }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const [source, setSource] = useState<IOption[]>([]);
  const queryVersionAppList = async (paramsObj: {
    versionCode: string;
    appCategoryCode: string;
    isBoundVersion: boolean;
  }) => {
    setLoading(true);
    await getRequest(getVersionAppList, {
      data: paramsObj,
    })
      .then((result) => {
        if (result?.success) {
          const { dataSource } = result.data || {};
          setSource(dataSource || []);
        } else {
          setSource([]);
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [loading, source, setSource, queryVersionAppList];
}

// 获取应用分组选项
export function useAppGroupOptions(categoryCode?: string): [any[], boolean] {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData([]);
    if (!categoryCode) return;

    setLoading(true);
    getRequest(queryBizData, {
      data: { categoryCode },
    })
      .then((result) => {
        const { dataSource } = result.data || {};
        const next = (dataSource || []).map((item: any) => ({
          ...item,
          value: item.groupCode,
          label: item.groupName,
        }));

        setData(next);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryCode]);

  return [data, loading];
}

// 加载应用分类下拉选择
export function useQueryCategory(): [boolean, any] {
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    selectCategory();
  }, []);

  const selectCategory = () => {
    setLoading(true);
    getRequest(appTypeList)
      .then((result) => {
        const list = (result?.data?.dataSource || []).map((n: any) => ({
          label: n.categoryName,
          value: n.categoryCode,
          data: n,
        }));
        setCategoryData(list);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [loading, categoryData];
}

// 绑定应用
export function useBoundApp(): [boolean, (paramsObj: { versionCode: string; apps: any }) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const handleBoundApp = async (paramsObj: { versionCode: string; apps: any }) => {
    setLoading(true);
    try {
      await postRequest(boundApp, { data: paramsObj })
        .then((res) => {
          if (res.success) {
            message.success('绑定应用成功!');
          } else {
            message.error('绑定应用失败！');
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return [loading, handleBoundApp];
}
