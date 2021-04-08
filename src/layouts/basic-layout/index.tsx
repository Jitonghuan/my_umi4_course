import React, { useRef, useMemo } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { FELayout } from '@cffe/fe-backend-component';
import { IUmiRrops } from '@cffe/fe-backend-component/es/components/end-layout/bus-layout';
import ds from '@config/defaultSettings';
import DocumentTitle from './DocumentTitle';
import FeContext from './FeContext';
import { doLogoutApi, queryUserInfoApi, queryAllSystem } from './service';
import { DFSFunc } from '@/utils';

export default (props: IUmiRrops) => {
  const FeGlobalRef = useRef(window.FE_GLOBAL);

  // 处理 breadcrumb, 平铺所有的路由
  const breadcrumbMap = useMemo(() => {
    const { routes } = props;

    const map = {} as any[];
    DFSFunc(routes, 'routes', (node) => {
      map[node.path] = node;
    });

    return map;
  }, [props]);

  return (
    <ConfigProvider locale={zhCN}>
      <FeContext.Provider
        value={{
          ...FeGlobalRef.current,
          breadcrumbMap,
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
            userApi={queryUserInfoApi}
            logoutApi={doLogoutApi}
            systemApi={queryAllSystem}
          />
        </DocumentTitle>
      </FeContext.Provider>
    </ConfigProvider>
  );
};
