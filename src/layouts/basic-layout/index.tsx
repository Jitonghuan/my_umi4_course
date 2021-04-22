import React, { useEffect, useState, useRef, useMemo } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import FELayout from '@cffe/vc-layout';
import { IUmiRrops } from '@cffe/fe-backend-component/es/components/end-layout/bus-layout';
import ds from '@config/defaultSettings';
import DocumentTitle from './DocumentTitle';
import FeContext from './FeContext';
import { queryBelongData, queryBizData, queryEnvData } from './service';
import { DFSFunc } from '@/utils';
import {
  getRequest,
  queryUserInfo as ssoQueryUserInfo,
  queryUserInfoApi,
  doLogoutApi,
} from '@/utils/request';
import { ChartsContext } from '@cffe/fe-datav-components';
import { useSize, useDebounce } from '@umijs/hooks';

export default (props: IUmiRrops) => {
  const FeGlobalRef = useRef(window.FE_GLOBAL);
  // 所属数据
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

  // 查询业务线数据
  const queryBusinessData = async () => {
    // 查询所属数据
    const belongResp = await getRequest(queryBelongData);

    // 查询业务线数据
    const bizResp = await getRequest(queryBizData);

    // 环境数据
    const envResp = await getRequest(queryEnvData);

    const belongData = belongResp.data?.dataSource || [];
    const bizData = bizResp.data?.dataSource || [];
    const envData = envResp.data?.dataSource || [];

    setBelongData(
      belongData.map((el: any) => ({
        ...el,
        label: el.belongName,
        value: el.belongCode,
      })),
    );
    setBusiness(
      bizData.map((el: any) => ({
        ...el,
        label: el.lineName,
        value: el.lineCode,
      })),
    );
    setEnvData(
      envData.map((el: any) => ({
        ...el,
        label: el.belongName,
        value: el.belongCode,
      })),
    );
  };

  const [{ width }] = useSize(
    () => document.querySelector(`.vc-layout-inner`) as HTMLElement,
  );
  const effectResize = useDebounce(width, 100);

  useEffect(() => {
    queryBusinessData();
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <FeContext.Provider
        value={{
          ...FeGlobalRef.current,
          breadcrumbMap,
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
            <FELayout.SSOLayout
              {...(props as any)}
              {...ds}
              // isOpenLogin={false}
              showFooter={false}
              // 全局插入配置覆盖默认配置
              {...FeGlobalRef.current}
              siderMenuProps={{
                scriptUrl: 'http://at.alicdn.com/t/font_2486191_7mbr5t0adq8.js',
              }}
              headerProps={{
                isShowGlobalMenu: false,
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
};
