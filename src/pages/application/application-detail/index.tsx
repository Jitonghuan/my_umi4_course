/**
 * ApplicationDetail
 * @description 应用详情
 * @author moting.nq
 * @create 2021-04-09 18:39
 */

import React, { useContext, useMemo, useState } from 'react';
import { history } from 'umi';
import { Tabs } from 'antd';
import VCPageContent, {
  FilterCard,
  ContentCard,
} from '@/components/vc-page-content';
import FEContext from '@/layouts/basic-layout/FeContext';
import { tabsConfig } from './config';
import { IProps } from './types';
import './index.less';

const rootCls = 'application-detail-page';
const detailPath = '/matrix/application/detail';
const { TabPane } = Tabs;
/** 默认值为概述 */
const defaultTab = 'overview';

const ApplicationDetail = (props: IProps) => {
  const { location, route, children } = props;

  const feContent = useContext(FEContext);

  const tabActiveKey = useMemo(
    () =>
      Object.keys(tabsConfig).find(
        (key) => location.pathname === `${detailPath}/${key}`,
      ),
    [location.pathname],
  );

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
    <VCPageContent
      className={rootCls}
      height="calc(100vh - 118px)"
      breadcrumbMap={feContent.breadcrumbMap}
      pathname={location.pathname}
      isFlex
    >
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
        >
          {Object.keys(tabsConfig).map((key) => (
            <TabPane tab={tabsConfig[key]} key={key}>
              {null}
            </TabPane>
          ))}
        </Tabs>
      )}

      {children}
    </VCPageContent>
  );
};

ApplicationDetail.defaultProps = {};

export default ApplicationDetail;
