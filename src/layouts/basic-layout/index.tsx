import React, { useRef } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { FELayout } from '@cffe/fe-backend-component';
import { IUmiRrops } from '@cffe/fe-backend-component/es/components/end-layout/bus-layout';
import ds from '@config/defaultSettings';
import DocumentTitle from './DocumentTitle';
import FeContext from './FeContext';
import { doLogoutApi, queryUserInfoApi, queryAllSystem } from './service';

export default (props: IUmiRrops) => {
  const FeGlobalRef = useRef(window.FE_GLOBAL);

  return (
    <ConfigProvider locale={zhCN}>
      <FeContext.Provider
        value={{
          ...FeGlobalRef.current,
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
