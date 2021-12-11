import React from 'react';
import { Modal, Space, Tooltip } from 'antd';

export const createTableSchema = () => [
  {
    title: 'IP',
    dataIndex: 'ip',
    align: 'left',
    width: 200,
  },
  {
    title: '主机名',
    dataIndex: 'hostname',
    align: 'left',
    sorter: {
      compare: (a: any, b: any) => a.hostname.localeCompare(b.hostname),
    },
  },
  {
    title: '内存(GB)',
    dataIndex: 'memoryTotal',
    width: 120,
  },
  {
    title: 'CPU核',
    dataIndex: 'cpuCoreNum',
    width: 120,
  },
  {
    title: '5m负载',
    dataIndex: 'load',
    width: 120,
    sorter: {
      compare: (a: any, b: any) => a.load - b.load,
    },
  },
  {
    title: 'CPU使用率',
    dataIndex: 'cpuUsageRate',
    width: 140,
    sorter: {
      compare: (a: any, b: any) => a.cpuUsageRate - b.cpuUsageRate,
    },
  },
  {
    title: '内存使用率',
    dataIndex: 'memoryUsageRate',
    width: 140,
    sorter: {
      compare: (a: any, b: any) => a.memoryUsageRate - b.memoryUsageRate,
    },
  },
  {
    title: '分区使用率',
    dataIndex: 'diskUsageRate',
    width: 140,
    sorter: {
      compare: (a: any, b: any) => a.diskUsageRate - b.diskUsageRate,
    },
  },
  {
    title: '变更原因',
    dataIndex: 'desc',
    width: 180,
    key: 3,
    ellipsis: {
      showTitle: false,
    },
    // render: (value: string) => (
    // <div>
    //   {value}
    // </div>
    // ),
  },
];

export const resUseTableSchema = [
  {
    title: 'IP',
    dataIndex: 'ip',
    align: 'left',
    width: 200,
  },
  {
    title: '主机名',
    dataIndex: 'hostname',
    align: 'left',
    sorter: {
      compare: (a: any, b: any) => a.hostname.localeCompare(b.hostname),
    },
  },
  {
    title: '内存(GB)',
    dataIndex: 'memoryTotal',
    width: 120,
  },
  {
    title: 'CPU核',
    dataIndex: 'cpuCoreNum',
    width: 120,
  },
  {
    title: '5m负载',
    dataIndex: 'load',
    width: 120,
    sorter: {
      compare: (a: any, b: any) => a.load - b.load,
    },
  },
  {
    title: 'CPU使用率',
    dataIndex: 'cpuUsageRate',
    width: 140,
    sorter: {
      compare: (a: any, b: any) => a.cpuUsageRate - b.cpuUsageRate,
    },
  },
  {
    title: '内存使用率',
    dataIndex: 'memoryUsageRate',
    width: 140,
    sorter: {
      compare: (a: any, b: any) => a.memoryUsageRate - b.memoryUsageRate,
    },
  },
  {
    title: '分区使用率',
    dataIndex: 'diskUsageRate',
    width: 140,
    sorter: {
      compare: (a: any, b: any) => a.diskUsageRate - b.diskUsageRate,
    },
  },
];

export const podUseTableSchema = [
  {
    title: `Na'me'space`,
    dataIndex: 'ip',
    align: 'left',
    width: 200,
  },
  {
    title: 'Name',
    dataIndex: 'hostname',
    align: 'left',
    sorter: {
      compare: (a: any, b: any) => a.hostname.localeCompare(b.hostname),
    },
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    align: 'left',
    width: 200,
  },
  {
    title: '内存(GB)',
    dataIndex: 'memoryTotal',
    width: 120,
  },
  {
    title: 'CPU核',
    dataIndex: 'cpuCoreNum',
    width: 120,
  },

  {
    title: 'CPU使用率',
    dataIndex: 'cpuUsageRate',
    width: 140,
    sorter: {
      compare: (a: any, b: any) => a.cpuUsageRate - b.cpuUsageRate,
    },
  },
  {
    title: '内存使用率(WSS)',
    dataIndex: 'memoryUsageRate',
    width: 140,
    sorter: {
      compare: (a: any, b: any) => a.memoryUsageRate - b.memoryUsageRate,
    },
  },
  {
    title: '内存使用率（RSS)',
    dataIndex: 'diskUsageRate',
    width: 140,
    sorter: {
      compare: (a: any, b: any) => a.diskUsageRate - b.diskUsageRate,
    },
  },
  {
    title: '磁盘使用率（RSS)',
    dataIndex: 'diskUsageRate',
    width: 140,
    sorter: {
      compare: (a: any, b: any) => a.diskUsageRate - b.diskUsageRate,
    },
  },
];
