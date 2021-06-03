/**
 * ApplicationDetail
 * @description 应用详情
 * @author moting.nq
 * @create 2021-04-09 18:39
 */

import React, { useContext, useMemo, useState, useEffect } from 'react';
import { history } from 'umi';
import { Tabs } from 'antd';
import VCPageContent, {
  FilterCard,
  ContentCard,
} from '@/components/vc-page-content';
import FEContext from '@/layouts/basic-layout/FeContext';
import DetailContext, { ContextTypes } from './context';
import { tabsConfig } from './config';
import { queryApps } from '../service';
import { IProps } from './types';
import './index.less';
import VCPermission from '@/components/vc-permission';
import MatrixPageContent from '@/components/matrix-page-content';

const rootCls = 'application-detail-page';
const detailPath = '/matrix/application/detail';
const { TabPane } = Tabs;
/** 默认值为概述 */
const defaultTab = 'overview';

const ApplicationDetail = (props: IProps) => {
  const { location, children } = props;
  const isContainClient = Number(location.query.isContainClient) === 1;
  const appId = location.query.id;

  const feContent = useContext(FEContext);
  const [appData, setAppData] = useState<ContextTypes['appData']>();

  const tabActiveKey = useMemo(
    () =>
      Object.keys(tabsConfig).find(
        (key) => location.pathname === `${detailPath}/${key}`,
      ),
    [location.pathname],
  );

  // 请求应用数据
  const queryAppData = () => {
    queryApps({
      id: Number(appId),
      pageIndex: 1,
      pageSize: 10,
    }).then((res: any) => {
      if (res.list.length) {
        setAppData(res.list[0]);
        return;
      }
      setAppData(undefined);
    });
  };

  useEffect(() => {
    if (!appId) return;
    queryAppData();
  }, [appId]);

  // 默认重定向到【概述】路由下
  if (location.pathname === detailPath) {
    history.replace({
      pathname: `${location.pathname}/${defaultTab}`,
      query: {
        ...location.query,
      },
    });
    return null;
  }

  return (
    <MatrixPageContent isFlex>
      {/* tab子路由 */}
      {tabActiveKey && (
        <Tabs
          tabBarStyle={{
            padding: '0 24px',
            background: '#fff',
          }}
          className={`${rootCls}__tabs`}
          activeKey={tabActiveKey}
          onChange={(key) => {
            history.replace({
              pathname: `${detailPath}/${key}`,
              query: {
                ...location.query,
              },
            });
          }}
          tabBarExtraContent={
            <div>
              <span
                style={{
                  color: 'rgba(0,0,0,.85)',
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                {appData?.appCode}
              </span>
              <span style={{ marginLeft: 12, color: 'rgba(0,0,0,.45)' }}>
                {appData?.appName}
              </span>
            </div>
          }
        >
          {Object.keys(tabsConfig)
            // 只有应用为包含二方包属性的时候，才会显示二方包的 tab
            .filter((key) => {
              if (isContainClient) {
                return true;
              }

              // 不包含二方包
              return key !== 'twoPackage';
            })
            .map((key) => (
              <TabPane tab={tabsConfig[key]} key={key}>
                {null}
              </TabPane>
            ))}
        </Tabs>
      )}

      <DetailContext.Provider
        value={{
          appData,
          queryAppData: queryAppData,
        }}
      >
        <VCPermission code={window.location.pathname} isShowErrorPage>
          {children}
        </VCPermission>
      </DetailContext.Provider>
    </MatrixPageContent>
  );
};

ApplicationDetail.defaultProps = {};

export default ApplicationDetail;
