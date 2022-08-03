import React, { useEffect, useRef, useState } from 'react';
import { Form, Button, Table, Select, Input } from 'antd';
import CardItem from './card-item';
import './index.less';
const data = [{ neicun: '11' }, { neicun: '22' }, { neicun: '33' }, { neicun: '44' }];
export default function ResourceStatistics() {
  const tableColumns = [
    {
      title: '命名空间',
      dataIndex: 'neicun',
      width: 80,
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: 'CPU使用率',
      dataIndex: ['memoryInfo', 'total'],
      width: 80,
    },
    {
      title: '内存使用率',
      dataIndex: 'load',
      width: 80,
    },
    {
      title: 'deployment',
      dataIndex: 'status',
      width: 80,
    },
    {
      title: 'pads',
      dataIndex: 'status',
      width: 80,
    },
    {
      title: 'service',
      dataIndex: 'status',
      width: 80,
    },
    {
      title: 'StatefulSet',
      dataIndex: 'status',
      width: 80,
    },
    {
      title: 'PVC',
      dataIndex: 'status',
      width: 80,
    },
  ];
  return (
    <div className="resource-info">
      {/* 上方图表部分 */}
      <div className={`resource-info-wrapper flex-column`}>
        <div className="flex-row">
          <CardItem width={200} height={120} />
          <CardItem width={200} height={120} showPie />
          <CardItem width={200} height={120} showPie />
          <CardItem width={200} height={120} showPie />
          <CardItem width={200} height={120} showPie />
        </div>
        <div className="flex-row">
          <CardItem /> <CardItem /> <CardItem /> <CardItem />
        </div>
        <div className="flex-row">
          <CardItem /> <CardItem /> <CardItem /> <CardItem /> <CardItem /> <CardItem /> <CardItem />
        </div>
      </div>
      {/* 中间表格部分 */}
      <div className="flex-column">
        <div style={{ margin: '6px', fontWeight: '600' }}>命名空间资源排行：</div>
        <Table
          dataSource={data}
          bordered
          rowKey="id"
          pagination={false}
          columns={tableColumns}
          // scroll={{ x: 1800 }}
        ></Table>
      </div>
      {/* 下方图表部分 */}
      <div className="flex-column">
        <div className="flex-row" style={{ justifyContent: 'space-between', margin: '10px 0px' }}>
          <div>
            命名资源统计：<Select options={[]} style={{ width: '240px' }} size="small"></Select>
          </div>
          <div>
            搜索：<Input size="small"></Input>
          </div>
        </div>
        <div className={`resource-info-wrapper flex-row`} style={{ flexWrap: 'wrap' }}>
          <CardItem /> <CardItem /> <CardItem /> <CardItem /> <CardItem /> <CardItem /> <CardItem /> <CardItem />{' '}
          <CardItem /> <CardItem /> <CardItem /> <CardItem /> <CardItem />
        </div>
      </div>
    </div>
  );
}
