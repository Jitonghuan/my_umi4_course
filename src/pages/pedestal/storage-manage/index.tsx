// 基座管理-存储管理
// @author muxi.jth
// @create 2022/1/12 14:18

import { useMemo, useEffect, useState } from 'react';
import { history, Link } from 'umi';
import { Tabs, Spin, Empty } from 'antd';
import VCPermission from '@/components/vc-permission';
import PageContainer from '@/components/page-container';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { getRequest } from '@/utils/request';
import DetailContext from '../storage-manage/context';
import { tabsConfig } from '../storage-manage/tab-config';
import { listAppEnv } from '@/pages/application/service';
import VolumeManage from './volume-manage';
import StorageDashboard from './storage-dashboard';
import NodeManage from './node-manage';

const detailPath = '/matrix/pedestal/storage-manage';
const { TabPane } = Tabs;

// 额外的菜单匹配映射规则
const activeKeyMap: Record<string, any> = {
  addConfig: 'configMgr',
  addLaunchParameters: 'launchParameters',
};

export default function ApplicationDetail(props: any) {
  let tabActiveKey = useMemo(() => {
    const currRoute = /\/([\w-]+)$/.exec(props.location.pathname)?.[1];
    return activeKeyMap[currRoute!] || currRoute;
  }, [location.pathname]);
  // 页面销毁时清空缓存
  const volumeManage = props.location.query.info;
  console.log('volumeManage', location.pathname);

  useEffect(() => {}, []);

  // 没有数据的时整体不显示，防止出现空数据异常
  //   if (!appData && isLoading) {
  //     return (
  //       <PageContainer>
  //         <div className="block-loading">
  //           <Spin tip="数据初始化中" />
  //         </div>
  //       </PageContainer>
  //     );
  //   }

  //   if (!appData && !isLoading) {
  //     return (
  //       <PageContainer>
  //         <div className="block-empty">
  //           <Empty
  //             description={
  //               <span>
  //                 未找到应用，返回 <Link to="/matrix/application/all">应用列表</Link>
  //               </span>
  //             }
  //           />
  //         </div>
  //       </PageContainer>
  //     );
  //   }
  const [tabKey, setTabKey] = useState<string>('storage-dashboard');
  useEffect(() => {
    if (volumeManage) {
      setTabKey('volume-manage');
    } else {
      setTabKey('storage-dashboard');
      tabActiveKey = 'storage-dashboard';
      history.replace({
        pathname: `${detailPath}/${tabKey}`,
      });
    }
  }, []);

  return (
    <PageContainer className="application-detail-page">
      <FilterCard className="layout-compact">
        <Tabs
          // defaultActiveKey="storage-dashboard"
          activeKey={tabActiveKey}
          onChange={(key) => {
            setTabKey(key);
            history.replace({
              pathname: `${detailPath}/${key}`,
            });
          }}
        >
          <TabPane tab="存储大盘" key="storage-dashboard"></TabPane>
          <TabPane tab="节点管理" key="node-manage"></TabPane>
          <TabPane tab="卷管理" key="volume-manage"></TabPane>
        </Tabs>
      </FilterCard>

      <div>
        {tabKey === 'volume-manage' && <VolumeManage />}
        {tabKey === 'storage-dashboard' && <StorageDashboard />}
        {tabKey === 'node-manage' && <NodeManage />}
      </div>
    </PageContainer>
  );
}
