import React, { useState, useEffect, useContext } from 'react';
import { Select, Tabs, Spin } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import VCCardLayout from '@cffe/vc-b-card-layout';
import { useQueryPerformanceTrends, useQueryInnodbMonitor } from './hooks';
import LineCard from "./line-card";
import { getMemoryOption, getCpuOption, getTpsOption, getTrafficOption, getDiskOption, getExecutionOption } from "./schema";
import { getRowsOpsOption, getReadOption, getWrittenOption, getUsageOption, getHitOption, getDirtyPctOption,getQpsOption,getConnections } from "./schema";
import DetailContext from '../../instance-list/components/instance-info/context';
import { infoLayoutGrid, START_TIME_ENUMS,lonelyLayoutGrid } from "./types";
import './index.less';

const { TabPane } = Tabs;
export default function DashboardsInfo(props: any) {
  const [lineData, loading, queryPerformanceTrends] = useQueryPerformanceTrends();
  const [engineData, engineLoading, getInnodbMonitor] = useQueryInnodbMonitor()
  const [tabKey, setTabKey] = useState<any>('resource');
  // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(30 * 60 * 1000);
  const now = new Date().getTime();
  //默认传最近30分钟，处理为秒级的时间戳
  let start = Number((now - startTime) / 1000).toString();
  let end = Number(now / 1000).toString();
  const [startTimestamp, setStartTimestamp] = useState<any>(start); //开始时间
  const [endTimestamp, setEndTimestamp] = useState<any>(end); //结束时间
  const { instanceId } = useContext(DetailContext)
  useEffect(() => {
    if (instanceId) {
      queryPerformanceTrends({
        instanceId: instanceId,
        start: startTimestamp,
        end: endTimestamp,
      });
      getInnodbMonitor({
        instanceId: instanceId,
        start: startTimestamp,
        end: endTimestamp,
      })
    }
  }, [instanceId, startTimestamp]);

  // 选择就近时间触发的事件
  const selectRelativeTime = (value: any) => {
    const now = new Date().getTime();
    setStartTime(value);
    let startTimepl = Number((now - value) / 1000).toString();
    let endTimepl = Number(now / 1000).toString();
    setStartTimestamp(startTimepl);
    setEndTimestamp(endTimepl);
  };
  const appConfig = [
    {
      title: 'MySQL CPU使用率',
      config: getCpuOption(lineData?.cpuUsage),
    },
    {
      title: 'MySQL 内存使用率',
      config: getMemoryOption(lineData?.memUsage),
    },
    {
      title: 'MySQL 磁盘使用率',
      config: getDiskOption(lineData?.diskUsage),
    },
    {
      title: '流量吞吐（KB）',
      config: getTrafficOption(lineData?.transmit),
    },
  
  ];

  const engineConfig = [
    {
      title: 'TPS',
      config: getTpsOption(engineData?.tps),

    },
    {
      title: 'QPS',
      config: getQpsOption(engineData?.qps),

    },
    {
      title: 'MySQL Connections',
      config: getConnections(engineData?.connections),
    },
    {
      title: 'innodb row ops',
      config: getRowsOpsOption(engineData?.rowsOps),
    },
    {
      title: 'innodb 读数据',
      config: getReadOption(engineData?.innodbDataRead),
    },
    {
      title: 'innodb 写数据',
      config: getWrittenOption(engineData?.innodbDataWritten),
    },
    {
      title: 'buffer pool 脏页比例',
      config: getDirtyPctOption(engineData?.bufferPoolDirtyPct),
    },
    {
      title: 'buffer pool 命中率',
      config: getHitOption(engineData?.bufferPoolHit),
    },
   
   
   
   
   
  ]
  const enginOnlyConfig=[ {
    title: 'buffer pool 利用率',
    config: getUsageOption(engineData?.bufferPoolUsagePct),
  },]
  

  return (
    <ContentCard className="database-line-wrapper">
      <Tabs
        activeKey={tabKey}
        onChange={(val) => {
          setTabKey(val);
        }}
        tabBarExtraContent={
          <div>
            <span style={{ marginRight: 12, float: 'right', paddingTop: 12 }}>
              <Select value={startTime} onChange={selectRelativeTime} style={{ width: 240 }}>
                <Select.OptGroup label="Relative time ranges"></Select.OptGroup>
                {START_TIME_ENUMS.map((time) => (
                  <Select.Option key={time.value} value={time.value}>
                    {time.label}
                  </Select.Option>
                ))}
              </Select>
            </span>
          </div>
        }

      >
        <TabPane tab="资源监控" key="resource">
          <Spin spinning={loading}>

            <VCCardLayout grid={infoLayoutGrid} className="database-line-content">

              {appConfig.map((el, index) => (
                <LineCard
                  key={index}
                  {...el}
                />
              ))}
            </VCCardLayout>
            
          </Spin>


        </TabPane>
        <TabPane tab="引擎监控" key="engine">
          <Spin spinning={engineLoading}>
            <VCCardLayout grid={infoLayoutGrid} className="database-line-content">
              {engineConfig.map((el, index) => (
                <LineCard
                  key={index}
                  {...el}
                />
              ))}
            </VCCardLayout>
            <VCCardLayout grid={lonelyLayoutGrid} className="database-line-content">
              {enginOnlyConfig.map((el, index) => (
                <LineCard
                  key={index}
                  {...el}
                />
              ))}
            </VCCardLayout>

          </Spin>
        </TabPane>
      </Tabs>


    </ContentCard>
  );
}
