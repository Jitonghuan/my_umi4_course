import { useEffect } from 'react';
import useRequest from '@/utils/useRequest';
import appConfig from '@/app.config';
import { OptionProps } from '@/components/table-search/typing';

/** 应用名 */
export const queryappManageList = `${appConfig.apiPrefix}/appManage/list`;
/** 环境名 */
export const queryappManageEnvList = `${appConfig.apiPrefix}/monitorManage/app/env`;
/** 应用分类接口 */
export const queryAppTypeLists = `${appConfig.apiPrefix}/appManage/category/list`;
/** 应用分支 */
export const queryAppBranchLists = `${appConfig.apiPrefix}/releaseManage/branch/list`;
/** 环境类型 */
// export const queryEnvListType = `${appConfig.apiPrefix}/appManage/env/listType`;
export const queryEnvListType = `${appConfig.apiPrefix}/appManage/env/listAppEnvType`;
/** 根据应用分类code查询发布环境列表 */
const queryEnvsUrl = `${appConfig.apiPrefix}/appManage/env/list`;

interface UsePublicDataProps {
  appCode?: string;
  appCategoryCode?: string;

  // 启用 app 类型
  isUseAppType?: boolean;

  // 启动应用列表接口
  isUseAppLists?: boolean;

  // 启用应用环境接口
  isUseAppEnv?: boolean;

  // 应用分支
  isUseAppBranch?: boolean;

  // 环境类型
  isEnvType?: boolean;

  // 发布环境
  isEnvsUrl?: boolean;

  /** 是否使用 code 作为 value 值 */
  useCodeValue?: boolean;
}

const usePublicData = (props: UsePublicDataProps) => {
  const {
    appCode,
    appCategoryCode,
    isUseAppType = true,
    isUseAppLists = true,
    isUseAppEnv = true,
    isUseAppBranch = true,
    isEnvType,
    isEnvsUrl,

    useCodeValue = false,
  } = props;

  // 查询应用分类
  const { run: queryAppTypeListsFun, data: appTypeData } = useRequest({
    api: queryAppTypeLists,
    method: 'GET',
    formatData: (data) => {
      return data.dataSource?.map((v: any) => {
        return {
          ...v,
          key: v?.categoryCode,
          value: useCodeValue ? v?.categoryCode : v?.categoryName,
          label: v?.categoryName,
        };
      });
    },
  });

  // 查询应用
  const { run: queryappManageListFun, data: appManageListData } = useRequest({
    api: queryappManageList,
    method: 'GET',
    formatData: (data) => {
      return data.dataSource?.map((v: any) => {
        return {
          ...v,
          key: v?.appCode,
          value: v?.appCode,
          label: v?.appCode,
        };
      });
    },
  });

  // 查询应用环境
  const { run: queryappManageEnvListFun, data: appManageEnvData } = useRequest({
    api: queryappManageEnvList,
    method: 'GET',
    formatData: (data) => {
      return data.dataSource?.map((v: any) => {
        return {
          ...v,
          key: v?.envCode,
          value: v?.envCode,
          label: v?.envCode,
        };
      });
    },
  });

  // 查询应用分支
  const { run: queryappBranch, data: appBranchData } = useRequest({
    api: queryAppBranchLists,
    method: 'GET',
    formatData: (data) => {
      return data.dataSource?.map((v: any) => {
        return {
          ...v,
          key: v?.branchName,
          value: v?.branchName,
          label: v?.branchName,
        };
      });
    },
  });

  // 查询环境类型
  // const { run: envTypeListFun, data: envListType } = useRequest({
  //   api: queryEnvListType,
  //   method: 'GET',
  //   formatData: (data) => {
  //     return data?.map((v: any) => {
  //       return {
  //         ...v,
  //         key: v?.typeCode,
  //         value: useCodeValue ? v?.typeCode : v?.typeName,
  //         label: v?.typeName,
  //       };
  //     });
  //   },
  // });

  // 查询环境类型
  const { run: envsUrlFun, data: envsUrlList } = useRequest({
    api: queryEnvsUrl,
    method: 'GET',
    formatData: (data) => {
      return data?.dataSource?.map((v: any) => {
        return {
          ...v,
          key: v?.envCode,
          value: useCodeValue ? v?.envCode : v?.envName,
          label: v?.envName,
        };
      });
    },
  });

  useEffect(() => {
    if (isUseAppType) {
      queryAppTypeListsFun({ pageSize: '-1' });
    }
    // if (isEnvType) {
    //   envTypeListFun({ pageSize: '-1' });
    // }
    if (isEnvsUrl) {
      envsUrlFun({ pageSize: '-1' });
    }
  }, []);

  useEffect(() => {
    if (!appCode) return;

    isUseAppBranch && queryappBranch({ appCode, pageSize: '-1' });

    isUseAppEnv && queryappManageEnvListFun({ appCode, pageSize: '-1' });
  }, [appCode]);

  useEffect(() => {
    if (!appCategoryCode || !isUseAppLists) return;
    queryappManageListFun({ appCategoryCode, pageSize: '-1' });
  }, [appCategoryCode]);

  return {
    appManageListData,
    appManageEnvData,
    appTypeData,
    appBranchData,
    // envListType,
    envsUrlList,
  } as {
    appManageListData: OptionProps[];
    appManageEnvData: OptionProps[];
    appTypeData: OptionProps[];
    appBranchData: OptionProps[];
    envListType: OptionProps[];
    envsUrlList: OptionProps[];
  };
};

export default usePublicData;
