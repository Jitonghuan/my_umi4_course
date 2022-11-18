import React, { useEffect, useState } from 'react';
import { Select, Tabs } from 'antd';
import clusterContext from './context';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import './index.less';
import { useClusterListData } from '../cluster-info/hook';
import VCPermission from '@/components/vc-permission';
import { history, useLocation, Outlet } from 'umi';
import { parse, stringify } from 'query-string';
const { TabPane } = Tabs;

const TabList = [
  { label: '资源详情', key: 'resource-detail' },
  { label: '节点列表', key: 'node-list' },
  { label: '弹性伸缩', key: 'hpa' }
  // { label: '资源统计', key: 'resource-statistics' },
  // { label: '事件告警', key: 'event-warning' },
  // { label: '任务管理', key: 'task-manage' }
];
const path = '/matrix/pedestal/cluster-detail';
const temp = [
  { label: '集群1', value: 'code1' },
  { label: '集群2', value: 'code2' },
];

export default function ClusterDetail(props: any) {
  let location: any = useLocation();
  const query: any = parse(location.search);
  // const { location, children } = props;
  const { clusterCode, clusterName } = query || {};
  const [clusterOption, setClusterOption] = useState<any>([]);
  const [selectCluster, setSelectCluster] = useState<any>({ value: clusterCode || '', label: clusterName || '' });
  const [activeTab, setActiveTab] = useState<string>(query?.key || 'resource-detail');
  const [data, total] = useClusterListData({ pageSize: -1, pageIndex: -1 });
  useEffect(() => {
    const query: any = parse(location.search);
    if (clusterCode) {
      const path = location.pathname.substring('/matrix/pedestal/cluster-detail/'.length);
      const key = query?.key || 'resource-detail'
      setActiveTab(key);
      const r = {
        pathname: `/matrix/pedestal/cluster-detail/${path || key}`,
        search: stringify(Object.assign(query, {
          key,
        })),
      }
      history.replace(r);
    }
  }, [clusterCode]);

  useEffect(() => {
    if (data && data.length) {
      let res = data.map((item: any) => ({ value: item.clusterCode, label: item.clusterName }));
      setClusterOption(res);
      if (res[0] && !clusterCode) {
        selectChange(res[0])
      }
    }
  }, [data, clusterCode]);

  // 集群选择下拉框change
  const selectChange = (v: any) => {
    const query: any = parse(location.search);
    setSelectCluster({ label: v.label, value: v.value });
    const r = {
      pathname: location.pathname,
      search: stringify(Object.assign(query, {
        clusterCode: v?.value,
        clusterName: v?.label,
      })),
    };

    history.replace(r);
  };

  // tab页切换
  const keyChange = (key: any) => {
    setActiveTab(key);
    const query: any = parse(location.search);
    const r = {
      pathname: `/matrix/pedestal/cluster-detail/${key}`,
      search: stringify(Object.assign(query, {
        key: key || 'resource-detail',
      })),
    }
    history.replace(r);
  }

  return (
    <PageContainer className="cluster-main">
      <ContentCard>
        <div className="search-wrapper">
          <div>
            {' '}
            选择集群：
            <Select
              style={{ width: 200 }}
              size="small"
              value={selectCluster}
              onChange={selectChange}
              options={clusterOption}
              labelInValue
            ></Select>
          </div>
          <div>
            <span style={{ fontWeight: '600', fontSize: '16px', marginRight: '10px' }}>
              {selectCluster?.value || '---'}
            </span>
            <span style={{ color: '#776e6e', fontSize: '13px' }}>{selectCluster?.label || '---'}</span>
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          // type='card'
          onChange={keyChange}
        >
          {TabList.map((item: any) => (
            <TabPane tab={item.label} key={item.key} />
          ))}
        </Tabs>
        <clusterContext.Provider
          value={{ clusterCode: selectCluster?.value || '', clusterName: selectCluster?.label || '' }}
        >
          <VCPermission code={window.location.pathname} isShowErrorPage>
            {selectCluster?.value ? <Outlet /> : <div className="tip-wrapper">请先选择集群</div>}
          </VCPermission>
        </clusterContext.Provider>
      </ContentCard>
    </PageContainer>
  );
}
