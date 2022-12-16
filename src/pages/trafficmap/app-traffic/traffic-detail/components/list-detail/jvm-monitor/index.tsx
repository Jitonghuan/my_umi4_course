
import React, { useContext } from 'react';
import DetailContext from '../../../context';
import AppCard from './app-card';
import VCCardLayout from '@cffe/vc-b-card-layout';
import {
  getGCTimeChartOption,
  getGCNumChartOption,
  getMemoryChartOption,
  getGCDataChartOption,
  getThreadsChartOption
} from './schema';
import {
  queryGcCount,
  queryGcTime,
  queryJvmHeap,
  queryJvmMetaspace,
  queryJvmCurrentThreads
} from './hook';
const layoutGrid = {
  xs: 1,
  sm: 1,
  md: 1,
  lg: 2,
  xl: 2,
  xxl: 2,
  xxxl: 2,
};
const jvmLayoutGrid = {
  xs: 1,
  sm: 1,
  md: 1,
  lg: 1,
  xl: 1,
  xxl: 1,
  xxxl: 1,
};
export default function InstanceMonitor() {
  const { appCode, envCode, startTime, hostName, hostIP, count, endTime, selectTimeType } = useContext(DetailContext);
  const appConfig = [
    {
      title: 'GC瞬时次数/每分钟',
      getOption: getGCNumChartOption,
      hasRadio: true,
      queryFn: queryGcCount,
    },
    {
      title: 'GC瞬时耗时/每分钟',
      getOption: getGCTimeChartOption,
      hasRadio: true,
      queryFn: queryGcTime,
    },
    {
      title: '堆内存详情/每分钟',
      getOption: getMemoryChartOption,
      hasRadio: true,
      queryFn: queryJvmHeap,
    },
    {
      title: '元空间详情/每分钟',
      getOption: getGCDataChartOption,
      queryFn: queryJvmMetaspace,
    },
  ];
  return (
    <div>
      <VCCardLayout grid={layoutGrid} className="monitor-app-content">
        {appConfig.map((el, index) => (
          <AppCard
            key={index}
            {...el}
            requestParams={{ envCode, appCode, ip: hostIP, startTime: startTime, endTime, selectTimeType, hostName: hostName, count }}
          />
        ))}
      </VCCardLayout>
      <VCCardLayout grid={jvmLayoutGrid} >
      <AppCard
            key={5}
            title= 'JVM线程数/每分钟'
            getOption= {getThreadsChartOption}
            queryFn= {queryJvmCurrentThreads}
            requestParams={{ envCode, appCode, ip: hostIP, startTime: startTime, endTime, selectTimeType, hostName: hostName, count }}
          />
      </VCCardLayout>
      <div>

      </div>


    </div>
  )
}