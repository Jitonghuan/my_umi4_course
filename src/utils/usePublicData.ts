import { useEffect } from 'react';
import useRequest from '@/utils/useRequest';
import ds from '@config/defaultSettings';
import { OptionProps } from '@/components/table-search/typing';

/** 应用名 */
export const queryappManageList = `${ds.apiPrefix}/appManage/list`;
/** 环境名 */
export const queryappManageEnvList = `${ds.apiPrefix}/monitorManage/app/env`;
/** 应用分类接口 */
export const queryAppTypeLists = `${ds.apiPrefix}/appManage/category/list`;
/** 应用分支 */
export const queryAppBranchLists = `${ds.apiPrefix}/releaseManage/branch/list`;
/** 环境类型 */
export const queryEnvListType = `${ds.apiPrefix}/appManage/env/listType`;

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
  } = props;

  // 查询应用分类
  const { run: queryAppTypeListsFun, data: appTypeData } = useRequest({
    api: queryAppTypeLists,
    method: 'GET',
    formatData: (data) => {
      return data.dataSource?.map((v: any) => {
        return {
          ...v,
          value: v?.categoryName,
          key: v?.categoryCode,
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
        };
      });
    },
  });

  // 查询环境类型
  const { run: envTypeListFun, data: envListType } = useRequest({
    api: queryEnvListType,
    method: 'GET',
    formatData: (data) => {
      return data?.map((v: any) => {
        return {
          ...v,
          key: v?.typeCode,
          value: v?.typeName,
        };
      });
    },
  });

  useEffect(() => {
    if (isUseAppType) {
      queryAppTypeListsFun({ pageSzie: '-1' });
    }
    if (isEnvType) {
      envTypeListFun({ pageSzie: '-1' });
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
    envListType,
  } as {
    appManageListData: OptionProps[];
    appManageEnvData: OptionProps[];
    appTypeData: OptionProps[];
    appBranchData: OptionProps[];
    envListType: OptionProps[];
  };
};

export default usePublicData;
