import React, { useEffect, useState, useRef, useMemo } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import FELayout from '@cffe/vc-layout';
import { IUmiRrops } from '@cffe/fe-backend-component/es/components/end-layout/bus-layout';
import ds from '@config/defaultSettings';
import DocumentTitle from './DocumentTitle';
import FeContext from './FeContext';
import { doLogoutApi, queryUserInfoApi, queryAllSystem } from './service';
import { DFSFunc } from '@/utils';
import { getRequest } from '@/utils/request';

export default (props: IUmiRrops) => {
  const FeGlobalRef = useRef(window.FE_GLOBAL);
  // 业务线
  const [business, setBusiness] = useState<IOption[]>([
    { label: '业务平台', value: '1' },
    { label: '业务平台2', value: '2' },
  ]);

  // 环境
  const [envData, setEnvData] = useState<IOption[]>([
    { label: 'test', value: 'test' },
  ]);

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
    const resp = await getRequest('', {
      data: {},
    });

    setBusiness(resp.data || []);
  };

  useEffect(() => {
    // queryBusinessData();
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <FeContext.Provider
        value={{
          ...FeGlobalRef.current,
          breadcrumbMap,
          businessData: business,
          envData,
        }}
      >
        <DocumentTitle
          title={FeGlobalRef.current.title}
          favicon={FeGlobalRef.current.favicon}
        >
          <FELayout.BusLayout
            {...(props as any)}
            {...ds}
            isOpenLogin={false}
            // 全局插入配置覆盖默认配置
            {...FeGlobalRef.current}
            headerProps={{ isShowGlobalMenu: false }}
            userApi={queryUserInfoApi}
            logoutApi={doLogoutApi}
            systemApi={queryAllSystem}
          />
        </DocumentTitle>
      </FeContext.Provider>
    </ConfigProvider>
  );
};
