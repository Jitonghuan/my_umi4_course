import React, { useEffect, useState, useRef, useMemo, useCallback, useContext } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import FELayout from '@cffe/vc-layout';
import type { IUmiRrops } from '@cffe/vc-layout/lib/bus-layout';
import type { IPermission } from '@cffe/vc-layout/lib/sider-menu';
import { ChartsContext } from '@cffe/fe-datav-components';
import { useSize, useDebounce } from '@umijs/hooks';
import ds from '@config/defaultSettings';
import { DFSFunc } from '@/utils';
import { getRequest, queryUserInfoApi, doLogoutApi } from '@/utils/request';
import DocumentTitle from './document-title';
import FeContext from './fe-context';
import { queryPermission } from './service';
import { useCategoryData, useBusinessData, useEnvTypeData } from './hooks';
import './index.less';
import logo from './logo.svg';

export default function BasicLayout(props: IUmiRrops) {
  const FeGlobalRef = useRef(window.FE_GLOBAL);
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [ready, setReady] = useState(false);
  // 所属数据
  const [categoryData] = useCategoryData(ready);
  // 业务线
  const [business] = useBusinessData(ready);
  // 环境
  const [envData] = useEnvTypeData(ready);
  // 权限数据
  const [permissionData, setPermissionData] = useState<IPermission[]>([]);

  // 处理 breadcrumb, 平铺所有的路由
  const breadcrumbMap = useMemo(() => {
    const { routes } = props;

    const map = {} as any;
    DFSFunc(routes, 'routes', (node) => {
      map[node.path] = node;
    });

    return map;
  }, [props]);

  // 获取用户权限
  const queryPermissionData = useCallback(async () => {
    const result = await getRequest(queryPermission);
    const next =
      result.data?.map((el: any) => ({
        permissionId: el.menuCode,
        permissionName: el.menuName,
        permissionUrl: el.menuUrl,
      })) || [];

    setPermissionData(next);

    // 确认权限后获取数据
    setReady(true);
  }, []);

  const [{ width }] = useSize(() => document.querySelector(`.vc-layout-inner`) as HTMLElement);
  const effectResize = useDebounce(width, 100);

  useEffect(() => {
    if (ds.isOpenPermission) {
      queryPermissionData();
    } else {
      setReady(true);
    }
  }, []);

  console.log('>>>>> ', userInfo);

  return (
    <ConfigProvider locale={zhCN}>
      <FeContext.Provider
        value={{
          ...FeGlobalRef.current,
          breadcrumbMap,
          isOpenPermission: ds.isOpenPermission,
          permissionData,
          businessData: business,
          categoryData,
          envData,
        }}
      >
        <ChartsContext.Provider
          value={{
            effectResize,
          }}
        >
          <DocumentTitle title={FeGlobalRef.current.title} favicon={FeGlobalRef.current.favicon}>
            <FELayout.SSOLayout
              {...(props as any)}
              pagePrefix={ds.pagePrefix}
              showFooter={false}
              // 全局插入配置覆盖默认配置
              {...FeGlobalRef.current}
              siderMenuProps={{
                isOpenPermission: ds.isOpenPermission,
                permissionData,
                // https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=2486191
                scriptUrl: '//at.alicdn.com/t/font_2486191_bmiy8l0nqn.js',
              }}
              headerProps={{
                logo,
                isShowGlobalMenu: false,
                onBrandClick: () => {
                  props.history.push('/matrix/index');
                },
              }}
              userApi={queryUserInfoApi}
              logoutApi={doLogoutApi}
              // loginUrl={}
            />
          </DocumentTitle>
        </ChartsContext.Provider>
      </FeContext.Provider>
    </ConfigProvider>
  );
}
