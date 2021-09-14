import React, { useEffect, useState, useRef, useMemo, useCallback, useContext } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import FELayout from '@cffe/vc-layout';
// import type { IUmiRrops } from '@cffe/vc-layout/lib/bus-layout';
// import type { IPermission } from '@cffe/vc-layout/lib/sider-menu';
import { ChartsContext } from '@cffe/fe-datav-components';
import { useSize, useDebounce } from '@umijs/hooks';
import appConfig from '@/app.config';
import { DFSFunc } from '@/utils';
import { queryUserInfoApi, doLogoutApi } from '@/utils/request';
// import DocumentTitle from './document-title';
// import FeContext from './fe-context';
// import { queryPermission } from './service';
import {
  FeContext,
  useDocumentTitle,
  usePermissionData,
  useCategoryData,
  useBusinessData,
  useEnvTypeData,
} from '@/common/hooks';
// import { useCategoryData, useBusinessData, useEnvTypeData } from './hooks';
import './index.less';
// import logo from './logo.svg';

export default function BasicLayout(props: any) {
  // 初始化 doc title hook
  useDocumentTitle();
  // 权限数据
  const [permissionData] = usePermissionData();
  // const FeGlobalRef = useRef(window.FE_GLOBAL);
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [ready, setReady] = useState(false);
  // 所属数据
  const [categoryData] = useCategoryData();
  // 业务线
  const [businessData] = useBusinessData();
  // 环境
  const [envTypeData] = useEnvTypeData();
  // // 权限数据
  // const [permissionData, setPermissionData] = useState<IPermission[]>([]);

  // 处理 breadcrumb, 平铺所有的路由
  const breadcrumbMap = useMemo(() => {
    const map = {} as Record<string, any>;
    DFSFunc(props.routes, 'routes', (node) => (map[node.path] = node));
    return map;
  }, [props.routes]);

  // 获取用户权限
  // const queryPermissionData = useCallback(async () => {
  //   const result = await getRequest(queryPermission);
  //   const next =
  //     result.data?.map((el: any) => ({
  //       permissionId: el.menuCode,
  //       permissionName: el.menuName,
  //       permissionUrl: el.menuUrl,
  //     })) || [];

  //   setPermissionData(next);

  //   // 确认权限后获取数据
  //   setReady(true);
  // }, []);

  // 页面图表宽度自动适配
  const [{ width }] = useSize(() => document.querySelector(`.vc-layout-inner`) as HTMLElement);
  const effectResize = useDebounce(width, 100);

  // useEffect(() => {
  //   if (appConfig.isOpenPermission) {
  //     queryPermissionData();
  //   } else {
  //     setReady(true);
  //   }
  // }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <FeContext.Provider
        value={{
          breadcrumbMap,
          isOpenPermission: appConfig.isOpenPermission,
          permissionData,
          businessData,
          categoryData,
          envTypeData,
        }}
      >
        <ChartsContext.Provider value={{ effectResize }}>
          <FELayout.SSOLayout
            {...(props as any)}
            pagePrefix={appConfig.pagePrefix}
            showFooter={false}
            title={appConfig.title}
            siderMenuProps={{
              isOpenPermission: appConfig.isOpenPermission,
              permissionData,
              scriptUrl: appConfig.menuIconUrl,
            }}
            headerProps={{
              logo: appConfig.logo,
              isShowGlobalMenu: false,
              onBrandClick: () => {
                props.history.push('/matrix/index');
              },
            }}
            userApi={queryUserInfoApi}
            logoutApi={doLogoutApi}
            // loginUrl={}
          />
        </ChartsContext.Provider>
      </FeContext.Provider>
    </ConfigProvider>
  );
}
