import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Dropdown, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import FELayout from '@cffe/vc-layout';
import { IUmiRrops } from '@cffe/fe-backend-component/es/components/end-layout/bus-layout';
import ds from '@config/defaultSettings';
import DocumentTitle from './DocumentTitle';
import FeContext from './FeContext';
import {
  queryBelongData,
  queryBizData,
  queryEnvData,
  queryPermission,
} from './service';
import { DFSFunc } from '@/utils';
import {
  getRequest,
  queryUserInfo as ssoQueryUserInfo,
  queryUserInfoApi,
  doLogoutApi,
  postRequest,
} from '@/utils/request';
import { ChartsContext } from '@cffe/fe-datav-components';
import { useSize, useDebounce } from '@umijs/hooks';
import { IPermission } from '@cffe/vc-layout/lib/sider-menu';
import logo from './logo.svg';

export default (props: IUmiRrops) => {
  const FeGlobalRef = useRef(window.FE_GLOBAL);
  // 应用分类数据
  const [belongData, setBelongData] = useState<IOption[]>([]);
  // 业务线
  const [business, setBusiness] = useState<IOption[]>([]);
  // 环境
  const [envData, setEnvData] = useState<IOption[]>([]);

  // 处理 breadcrumb, 平铺所有的路由
  const breadcrumbMap = useMemo(() => {
    const { routes } = props;

    const map = {} as any[];
    DFSFunc(routes, 'routes', (node) => {
      map[node.path] = node;
    });

    return map;
  }, [props]);

  // 权限数据
  const [permissionData, setPermissionData] = useState<IPermission[]>([]);

  // 查询业务线数据
  const queryBusinessData = async () => {
    // 查询应用分类数据
    const belongResp = await getRequest(queryBelongData);

    // 查询业务线数据
    const bizResp = await getRequest(queryBizData);

    // 环境数据
    const envResp = await getRequest(queryEnvData);

    const belongData = belongResp.data?.dataSource || [];
    const bizData = bizResp.data?.dataSource || [];
    const envData = envResp?.data || [];

    setBelongData(
      belongData.map((el: any) => ({
        ...el,
        label: el.categoryName,
        value: el.categoryCode,
      })),
    );
    setBusiness(
      bizData.map((el: any) => ({
        ...el,
        label: el.groupName,
        value: el.groupCode,
      })),
    );
    setEnvData(
      envData.map((el: any) => ({
        ...el,
        label: el.typeName,
        value: el.typeCode,
      })),
    );
  };

  // 获取用户权限
  const queryPermissionData = async () => {
    const resp = await getRequest(queryPermission);
    const { data = [] } = resp;

    if (data.length > 0) {
      setPermissionData(
        data.map((el: any) => ({
          permissionId: el.menuCode,
          permissionName: el.menuName,
          permissionUrl: el.menuUrl,
        })),
      );

      // 确认权限后获取数据
      queryBusinessData();
    }
  };

  const [{ width }] = useSize(
    () => document.querySelector(`.vc-layout-inner`) as HTMLElement,
  );
  const effectResize = useDebounce(width, 100);

  useEffect(() => {
    if (ds.isOpenPermission) {
      queryPermissionData();
    } else {
      queryBusinessData();
    }
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <FeContext.Provider
        value={{
          ...FeGlobalRef.current,
          breadcrumbMap,
          isOpenPermission: ds.isOpenPermission,
          permissionData,
          businessData: business,
          belongData,
          envData,
        }}
      >
        <ChartsContext.Provider
          value={{
            effectResize,
          }}
        >
          <DocumentTitle
            title={FeGlobalRef.current.title}
            favicon={FeGlobalRef.current.favicon}
          >
            {belongData.length > 0 && (
              <FELayout.SSOLayout
                {...(props as any)}
                {...ds}
                // isOpenLogin={false}
                showFooter={false}
                // 全局插入配置覆盖默认配置
                {...FeGlobalRef.current}
                siderMenuProps={{
                  isOpenPermission: ds.isOpenPermission,
                  permissionData,
                  scriptUrl:
                    'http://at.alicdn.com/t/font_2486191_tnfcu8v29v.js',
                }}
                headerProps={{
                  logo,
                  isShowGlobalMenu: false,
                }}
                userApi={queryUserInfoApi}
                logoutApi={doLogoutApi}
                // loginUrl={}
              />
            )}
          </DocumentTitle>
        </ChartsContext.Provider>
      </FeContext.Provider>
    </ConfigProvider>
  );
};
