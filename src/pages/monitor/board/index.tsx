import React, { useState, useEffect } from 'react';
import { Select, Tabs } from '@cffe/h2o-design';
import PageContainer from '@/components/page-container';
import BoardCardList from './component/board-card';
import DataSource from './component/datasource';
import { getCluster, graphTableList } from './service';
import './index.less';
import { ConsoleSqlOutlined } from '@ant-design/icons';

const rootCls = 'monitor-board';

export default function Board() {

  const [activeKey, setActiveKey] = useState<string>('board')
  const [clusterList, setClusterList] = useState<any>([])
  const [curCluster, setCurCluster] = useState<number | null>(null)

  useEffect(() => {
    getCluster().then((res) => {
      if (res.success) {
        const data = res.data.map((item: any) => {
          return {
            label: item.clusterName,
            value: item.id
          }
        })
        setClusterList(data);
        const localstorageData = JSON.parse(localStorage.getItem('__monitor_board_cluster_selected') || '{}')
        if (localstorageData?.clusterCode) {
          onClusterChange(localstorageData.clusterCode)
        } else {
          if(data?.[0]?.value){
            onClusterChange(data?.[0]?.value)
          }else{
            setCurCluster(null)
          }
        }
      }
    })
  }, [])

  const onClusterChange = (value: number) => {
    setCurCluster(value)
    const localstorageData = { clusterCode: value }
    localStorage.setItem('__monitor_board_cluster_selected', JSON.stringify(localstorageData))
  }

  return (
    <PageContainer className={rootCls}>
      <div className="app-group-tab-wrapper">
        <div className="env-select-wrapper">
          <span>集群选择：</span>
          <Select
            clearIcon={false}
            style={{ width: '250px' }}
            value={curCluster}
            options={clusterList}
            onChange={onClusterChange} />
        </div>
      </div>
      <div className="app-group-content-wrapper">
        <Tabs
          activeKey={activeKey}
          onChange={(val) => {
            setActiveKey(val);
          }}
        >
          <Tabs.TabPane tab="监控大盘" key="board" />
          <Tabs.TabPane tab="数据源" key="datasource" />
        </Tabs>
        {activeKey === "board" &&
          <BoardCardList cluster={curCluster} />
        }
        {activeKey === "datasource" &&
          <DataSource cluster={curCluster} />
        }
      </div>
    </PageContainer>
  );
}
