import React, { useEffect, useState, useRef } from 'react';
import { Select, Tabs, Spin } from '@cffe/h2o-design';
import PageContainer from '@/components/page-container';
import ClusterBoard from '../cluster';
import { getCluster } from '@/pages/monitor/board/service';
import { graphDashboard } from './service';
import Detail from './component/detail';
import './index.less';

const rootCls = 'monitor-board';

export default function Board() {
  const [activeKey, setActiveKey] = useState('-1');
  const [clusterList, setClusterList] = useState<any>([]);
  const [clusterCode, setClusterCode] = useState<string | null>(null);
  const [dashboardList, setDashboardList] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const onClusterChange = async (value: string) => {
    setLoading(true);
    setActiveKey('-1');
    setClusterCode(value);
    const localstorageData = { clusterCode: value };
    localStorage.setItem('__monitor_board_cluster_selected', JSON.stringify(localstorageData));
    const res = await graphDashboard(value);
    setDashboardList(res?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    getCluster().then((res) => {
      if (res?.success) {
        const data = res?.data.map((item: any) => {
          return {
            label: item.clusterName,
            value: item.id,
          };
        });
        setClusterList(data);
        const localstorageData = JSON.parse(localStorage.getItem('__monitor_board_cluster_selected') || '{}');
        if (localstorageData?.clusterCode) {
          onClusterChange(localstorageData.clusterCode);
        } else {
          if (data?.[0]?.value) {
            onClusterChange(data?.[0]?.value);
          } else {
            setClusterCode(null);
          }
        }
      }
    });
  }, []);

  return (
    <PageContainer className={rootCls}>
      <div className="monitor-cluster-dashboard">
        <Tabs
          activeKey={activeKey}
          onChange={(val) => {
            setActiveKey(val);
          }}
          tabBarExtraContent={{
            right: (
              <div>
                集群选择：
                <Select
                  clearIcon={false}
                  style={{ width: '250px' }}
                  options={clusterList}
                  value={clusterCode}
                  onChange={onClusterChange}
                />
              </div>
            ),
          }}
        >
          <Tabs.TabPane tab="集群大盘" key={-1} />
          <Tabs.TabPane tab={"详情"} key={3} />
          {dashboardList.map((item, i) => (
            <Tabs.TabPane tab={item.name} key={i} />
            
          ))}
        </Tabs>

        {/* {activeKey === '-1' ? <ClusterBoard clusterCode={clusterCode} /> : null}

        {dashboardList.length && activeKey !== '-1' ? (
          <Spin style={{ display: 'block' }} spinning={loading}>
            <Detail url={dashboardList[Number(activeKey)].url} />
          </Spin>
        ) : null} */}
         <Detail url={'http://grafana-yhyy.seenew.info:4445/d/SdllMIF4k/ji-qun-liu-liang-tuo-bu?viewPanel=2\u0026orgId=1\u0026refresh=5s\u0026kiosk'} />
      </div>
    </PageContainer>
  );
}
