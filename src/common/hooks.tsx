// 全局通用的 hooks
// @file hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/10 11:37

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import appConfig from '@/app.config';
import DetailContext from '../pages/application/application-detail/context';
import { getRequest, postRequest, delRequest } from '@/utils/request';
import { BasicData } from '@hbos/component-position-switcher';
import { message } from 'antd';
import * as APIS from './apis';
/** 全局上下文 */
// export const GlobalContext = createContext({
//   // 换肤颜色
//   style: 'foneLight',
//   // /** 是否开启权限控制 */
//   // isOpenPermission: false,
//   // /** 权限数据 */
//   // permissionData: [] as IPermission[],
// });
interface IPermission {
  /** 权限 ID */
  permissionId: string | number;
  /** 权限名称 */
  permissionName: string;
  /** 权限对应的路由地址 */
  permissionUrl: string;
}
export interface matrixConfigProps {
  curEnvType: string;
  locationHref: string;
  domainName: string;
  wsPrefixName: string;
  LogoName: string;
  waterMarkName: string;
}

/** 全局上下文 */
export const FeContext = createContext({
  /** 面包屑路由数据 */
  breadcrumbMap: {} as Record<string, any>,
  /** 是否开启权限控制 */
  isOpenPermission: false,
  /** 权限数据 */
  permissionData: [] as IPermission[],
  /** 应用分类数据 */
  categoryData: [] as IOption[],
  /** 应用组 */
  businessData: [] as IOption[],
  envTypeData: [] as IOption[],
  /* matrix 接口获取配置信息数据 */
  matrixConfigData: {} as matrixConfigProps,
  /* matrix 按钮权限*/
  btnPermission: [] as any
});

/** 修改标题和 favicon */
export function useDocumentTitle(subtitle?: string, route?: string) {
  const { appData } = useContext(DetailContext);
  useEffect(() => {
    const link: any = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = appConfig.favicon;
    document.getElementsByTagName('head')[0].appendChild(link);

    setTimeout(() => {
      document.title = subtitle ? `${appConfig.title} | ${subtitle}` : appConfig.title;
    });
  }, [subtitle, route]);
}

/** 页面权限数据 */
export function usePermissionData(): [IPermission[], boolean, () => Promise<any>] {
  const [data, setData] = useState<IPermission[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getRequest(APIS.queryPermission);
      const next =
        result?.data?.map((item: any) => ({
          // permissionId: item.permissionCode,
          permissionName: item.menuName,
          permissionUrl: item.menuUrl,
        })) || [];
      setData(next);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (appConfig.isOpenPermission) {
      loadData();
    }
  }, []);

  return [data, loading, loadData];
}

// 业务所属
export function useCategoryData() {
  const [data, setData] = useState<IOption[]>([]);

  const loadData = useCallback(async () => {
    const result = await getRequest(APIS.queryCategoryData);
    const next = (result?.data?.dataSource || []).map((el: any) => ({
      ...el,
      label: el?.categoryName,
      value: el?.categoryCode,
    }));
    setData(next);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return [data];
}

// 业务线
export function useBusinessData() {
  const [data, setData] = useState<IOption[]>([]);

  const loadData = useCallback(async () => {
    const result = await getRequest(APIS.queryBizData);
    const next = (result?.data?.dataSource || []).map((el: any) => ({
      ...el,
      label: el?.groupName,
      value: el?.groupCode,
    }));
    setData(next);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return [data];
}

// 环境类型数据
export function useEnvTypeData() {
  const [data, setData] = useState<IOption[]>([]);
  const { appData } = useContext(DetailContext);
  const loadData = useCallback(async () => {
    const result = await getRequest(APIS.listAppEnvType, { data: { appCode: appData?.appCode, isClient: false } });
    let next: any = [];
    (result?.data || []).map((el: any) => {
      if (el?.typeCode === 'dev') {
        next.push({ ...el, label: el?.typeName, value: el?.typeCode, sortType: 1 });
      }
      if (el?.typeCode === 'test') {
        next.push({ ...el, label: el?.typeName, value: el?.typeCode, sortType: 2 });
      }
      if (el?.typeCode === 'pre') {
        next.push({ ...el, label: el?.typeName, value: el?.typeCode, sortType: 3 });
      }
      if (el?.typeCode === 'prod') {
        next.push({ ...el, label: el?.typeName, value: el?.typeCode, sortType: 4 });
      }
    });
    next.sort((a: any, b: any) => {
      return a.sortType - b.sortType;
    }); //升序
    setData(next);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return [data];
}

// 请求所属机构数据
export function useStaffOrgData(): [any, () => Promise<void>] {
  const [orgData, setOrgData] = useState<BasicData[]>();

  const loadData = useCallback(async () => {
    // @ts-ignore
    let getStaffOrgListApi = window.matrixConfigData?.domainName;
    await postRequest(`${getStaffOrgListApi}/kapi/apex-osc/org/getStaffOrgList`).then((result) => {
      if (result.success) {
        const next = (result?.data || []).map((el: any) => ({
          name: el.name,
          id: el.id,
        }));
        setOrgData(next);
      }
    });
  }, []);
  return [orgData, loadData];
}

// 请求所属机构数据
export function useStaffDepData(): [any, (orgId: any) => Promise<void>] {
  const [deptData, setDeptData] = useState<BasicData[]>();
  const loadData = useCallback(async (orgId: any) => {
    // @ts-ignore
    let getStaffDeptListApi = window.matrixConfigData?.domainName;
    await postRequest(`${getStaffDeptListApi}/kapi/apex-osc/dept/getStaffDeptList`, { data: { orgId } }).then(
      (result) => {
        if (result?.success) {
          const next = (result?.data || []).map((el: any) => ({
            name: el.name,
            id: el.id,
          }));
          setDeptData(next);
        }
      },
    );
  }, []);
  return [deptData, loadData];
}

// 切换部门确认
export function useChooseDept(): [(deptId: any) => Promise<void>] {
  const chooseDept = useCallback(async (deptId: any) => {
    // @ts-ignore
    let chooseDeptApi = window.matrixConfigData?.domainName;
    await postRequest(`${chooseDeptApi}/kapi/apex-sso/chooseDept`, { data: { deptId } });
  }, []);

  return [chooseDept];
}

// 请求查询未读消息数
export function useQueryUnreadNum(): [any, () => Promise<void>] {
  const [data, setData] = useState<number>(0);

  const loadData = useCallback(async () => {
    await getRequest(APIS.unreadNumApi).then((result) => {
      if (result?.success) {
        const next = result?.data?.total || 0;
        setData(next);
      }
    });
  }, []);

  useEffect(() => {
    loadData();
    let intervalId = setInterval(() => {
      loadData();
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return [data, loadData];
}

// 请求查询所有系统消息
export function useQueryStemNoticeList(): [any, (pageIndex?: number, pageSize?: number) => Promise<void>] {
  const [dataSource, setDataSource] = useState<number>(0);

  const loadData = useCallback(async (pageIndex?: number, pageSize?: number) => {
    await getRequest(APIS.systemNoticeListApi, {
      data: { pageIndex: pageIndex || 1, pageSize: pageSize || 2000 },
    }).then((result) => {
      if (result?.success) {
        const next = result?.data?.dataSource || [];
        let dataArry: any = [];
        next?.map((item: any) => {
          dataArry.push({
            id: item.id,
            title: item.title,
            content: item.content,
            // datetime:item.datetime,
            readed: item.state,
            systemNoticeId: item.systemNoticeId,
          });
        });

        setDataSource(dataArry);
      }
    });
  }, []);

  useEffect(() => {
    loadData(1, 2000);
  }, []);

  return [dataSource, loadData];
}

// 请求查询未读消息数
export function useReadList(): [(ids: any) => Promise<void>] {
  const getReadList = useCallback(async (ids: any) => {
    await postRequest(APIS.readListApi, { data: { ids } });
  }, []);

  return [getReadList];
}
export function useDeleteSystemNotice(): [(id: number) => Promise<void>] {
  const deleteSystemNotice = useCallback(async (id: number) => {
    await delRequest(`${APIS.deleteSystemNoticeApi}/${id}`).then((result) => {
      if (result?.success) {
        message.success('删除成功！');
      }
    });
  }, []);

  return [deleteSystemNotice];
}


// 请求matrix配置信息 getMatrixEnvConfig
export function useGetMatrixEnvConfig(): [any, () => Promise<void>] {
  const [configData, setConfigData] = useState<matrixConfigProps>({
    curEnvType: 'dev',
    locationHref: '',
    domainName: 'http://c2f.apex-dev.cfuture.shop',
    wsPrefixName: 'ws://matrix-api-test.cfuture.shop',
    LogoName: '',
    waterMarkName: 'Matrix',
  });
  const loadData = useCallback(async () => {
    await getRequest(APIS.getMatrixEnvConfig).then((result) => {
      if (result?.success) {
        setConfigData(result?.data);
        // @ts-ignore
        window.matrixConfigData = result?.data
      } else {
        return;
      }
    });
  }, []);
  return [configData, loadData];
}
export const getMatrixEnvConfig = () =>
  getRequest(APIS.getMatrixEnvConfig).then((res: any) => {
    if (res?.success) {
      let hostAdress = window.location.origin;
      let envConfigInfo = {
        LogoName: "测试",
        curEnvType: "dev",
        // domainName: "http://c2f.apex-dev.cfuture.shop",
        domainName:"http://c2f.apex.cfuture.shop",
        key: "http://matrix-local.cfuture.shop:9091",
        locationHref: "dev",
        waterMarkName: "测试环境",
        wsPrefixName: "ws://matrix-api-test.cfuture.shop",
      };
      const dataSource = res?.data?.matrixEnvConfigs || {};
      dataSource?.map((item: any) => {
        if (item?.key == hostAdress) {
          envConfigInfo = item
        }

      })

      Object.assign(envConfigInfo, {
        isSkipLogin: res?.data?.isSkipLogin || false
      })

      return envConfigInfo;
    }
    return {};
  });
export const useGetInfoList = (paramsObj: { type: string }) =>
  getRequest(APIS.getInfoList, { data: { ...paramsObj, pageIndex: -1, pageSize: -1 } }).then((res: any) => {
    if (res?.success) {
      const dataSource = res?.data?.dataSource || [];
      return dataSource;
    }
    return [];
  });




export function usegetLatestChangelog(): [any, (version: string) => Promise<void>] {
  const [changeLog, setChangeLog] = useState<any>("")
  const getLatestChangelog = useCallback(async (version: string) => {
    await getRequest(APIS.getLatestChangelog, { data: { version } }).then((result) => {
      if (result?.success) {
        setChangeLog(result?.data)

      }
    });
  }, []);

  return [changeLog, getLatestChangelog];
}
