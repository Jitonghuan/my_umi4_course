import { useMemo } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import FELayout from '@cffe/vc-layout';
import { ChartsContext } from '@cffe/fe-datav-components';
import { useSize, useDebounce } from '@umijs/hooks';
import appConfig from '@/app.config';
import { DFSFunc } from '@/utils';
import { queryUserInfoApi, doLogoutApi } from '@/utils/request';
import {
  FeContext,
  useDocumentTitle,
  usePermissionData,
  useCategoryData,
  useBusinessData,
  useEnvTypeData,
} from '@/common/hooks';
import './index.less';

// 屏蔽掉 React Development 模式下红色的警告
if (appConfig.isLocal) {
  const oldError = console.error.bind(console);
  console.error = (...args: string[]) => {
    if (args?.find((n) => n?.includes?.('Warning: '))) {
      return console.log('%c[React Warning] ', 'color:orange', args?.[0]);
    }
    oldError(...args);
  };
}

export default function BasicLayout(props: any) {
  // 初始化 doc title hook
  useDocumentTitle('', props?.location?.pathname);
  // 权限数据
  const [permissionData] = usePermissionData();
  // 所属数据
  const [categoryData] = useCategoryData();
  // 业务线
  const [businessData] = useBusinessData();
  // 环境
  const [envTypeData] = useEnvTypeData();

  // 处理 breadcrumb, 平铺所有的路由
  const breadcrumbMap = useMemo(() => {
    const map = {} as Record<string, any>;
    DFSFunc(props.routes, 'routes', (node) => (map[node.path] = node));
    return map;
  }, [props.routes]);

  // 页面图表宽度自动适配
  const [{ width }] = useSize(() => document.querySelector(`.vc-layout-inner`) as HTMLElement);
  const effectResize = useDebounce(width, 100);

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
