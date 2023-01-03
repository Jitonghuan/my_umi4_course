import React, { useState, useEffect, useContext } from 'react';
import { Select, Tabs, Spin } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import VCCardLayout from '@cffe/vc-b-card-layout';
import { useQueryPerformanceTrends ,useQueryInnodbMonitor} from './hooks';
import LineCard from "./line-card";
import { getMemoryOption, getCpuOption, getTpsOption, getTrafficOption, getSessionOption, getExecutionOption } from "./schema";
import { getRowsOpsOption,getReadOption,getWrittenOption,getUsageOption,getHitOption,getDirtyPctOption } from "./schema";
import DetailContext from '../../instance-list/components/instance-info/context';
import { infoLayoutGrid, START_TIME_ENUMS } from "./types";
import './index.less';

const { TabPane } = Tabs;
export default function DashboardsInfo(props: any) {
  const [lineData, loading, queryPerformanceTrends] = useQueryPerformanceTrends();
  const [engineData, engineLoading, getInnodbMonitor]=useQueryInnodbMonitor()
  const [tabKey, setTabKey] = useState<any>('resource');
  // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(30 * 60 * 1000);
  const now = new Date().getTime();
  //默认传最近30分钟，处理为秒级的时间戳
  let start = Number((now - startTime) / 1000).toString();
  let end = Number(now / 1000).toString();
  const [startTimestamp, setStartTimestamp] = useState<any>(start); //开始时间
  const [endTimestamp, setEndTimestamp] = useState<any>(end); //结束时间
  const { instanceId,envCode } = useContext(DetailContext)
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
        envCode
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
      title: 'MySQL cpu/内存利用率',
      config: getCpuOption(lineData?.cpuMem),
    },
    {
      title: 'MySQL存储空间使用量',
      config: getMemoryOption(lineData?.memLimit),
    },
    {
      title: 'TPS/QPS',
      config: getTpsOption(lineData?.tpsQps),

    },
    {
      title: '会话连接',
      config: getSessionOption(lineData?.connection),
    },
    {
      title: '流量吞吐（KB）',
      config: getTrafficOption(lineData?.transmit),
    },
    {
      title: '执行次数',
      config: getExecutionOption(lineData?.rowsOpsData),
    },
  ];

  const engineConfig=[
    {
      title: 'buffer pool 脏页比例',
      config: getDirtyPctOption(engineData?.bufferPoolDirtyPct),
   },
   {
    title: 'buffer pool 命中率',
    config: getHitOption(engineData?.bufferPoolHit),
 },
 {
  title: 'buffer pool 利用率',
  config: getUsageOption(engineData?.bufferPoolUsagePct),
},
{
  title: 'innodb 写数据',
  config: getWrittenOption(engineData?.innodbDataWritten),
},
{
  title: 'innodb 读数据',
  config: getReadOption(engineData?.innodbDataRead),
},
{
  title: 'innodb row ops',
  config: getRowsOpsOption(engineData?.rowsOps),
},
]

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

          </Spin>
        </TabPane>
      </Tabs>


    </ContentCard>
  );
}
