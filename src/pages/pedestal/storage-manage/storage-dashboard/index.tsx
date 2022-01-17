/**
 * @description: 基座管理-存储管理-存储大盘
 * @name {muxi.jth}
 * @date {2022/01/11 16:43}
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, message, Tag, Divider, Switch } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { getRequest, delRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import DiskUsagePieChart from './dashboards/disk-usage-pieChart';
import DiskUsageLineChart from './dashboards/disk-usage-lineChart';
import VolumeChangeLineChart from './dashboards/volume-change-lineChart';
import BrickChangeLineChart from './dashboards/brick-change-lineChart';
import './index.less';

export default function Storage() {
  const { Option } = Select;
  //启用配置管理选择
  let useNacosData: number;
  const handleNacosChange = async (checked: any, record: any) => {
    if (checked === 0) {
      useNacosData = 1;
    } else {
      useNacosData = 0;
    }
  };
  return (
    <ContentCard>
      <div className="storage-body">
        <div className="storage-dashboard">
          <Form layout="inline">
            <Form.Item label="选择集群">
              <Select style={{ width: 140 }}></Select>
            </Form.Item>
            <Divider />
          </Form>
        </div>
        <div className="cluster-info">
          <div className="info-title">
            <div>
              <h3>集群概况</h3>{' '}
            </div>
          </div>
          <div className="volume-status">
            <span>
              <Tag>状态：告警</Tag>
            </span>
            <span>
              <Tag>集群类型：GLUSTERFS</Tag>
            </span>
            <span>
              <Tag>HEKETI：健康</Tag>
            </span>
          </div>
          <div style={{ marginTop: 20 }}>
            <Table rowKey="id" bordered>
              <Table.Column title="类型" dataIndex="id" width="4%" />
              <Table.Column title="数量" dataIndex="templateName" width="20%" ellipsis />
              <Table.Column title="可用" dataIndex="languageCode" width="8%" ellipsis />
              <Table.Column title="不可用" dataIndex="templateType" width="8%" ellipsis />
            </Table>
          </div>
        </div>

        <div className="disk-dashboard">
          <div className="disk-usage-pie">
            <DiskUsagePieChart data={[]} />
          </div>
          <div className="disk-usage-divider"></div>
          <div className="disk-usage-line">
            <DiskUsageLineChart data={[]} />
          </div>
        </div>
        <Divider style={{ height: 10, marginTop: 0, marginBottom: 0 }} />
        <div className="cluster-node-info">
          <div className="cluster-info">
            <div className="info-title">
              <div>
                {' '}
                <h3>集群节点</h3>
              </div>
            </div>
          </div>
          <Table rowKey="id" bordered>
            <Table.Column title="主机名" dataIndex="id" width="4%" />
            <Table.Column title="IP" dataIndex="templateName" width="20%" ellipsis />
            <Table.Column title="brick数量" dataIndex="languageCode" width="8%" ellipsis />
            <Table.Column title="device数量" dataIndex="templateType" width="8%" ellipsis />
            <Table.Column title="可用空间" dataIndex="appCategoryCode" width="8%" ellipsis />
            <Table.Column title="已用空间" dataIndex="appCategoryCode" width="8%" ellipsis />
            <Table.Column
              title="状态"
              dataIndex="tagName"
              width="8%"
              render={(current, record) => {
                return <Tag color="success">{current}</Tag>;
              }}
            />
          </Table>
        </div>
        <div className="volume-dashboard">
          <div className="volume-line-chart">
            <VolumeChangeLineChart data={[]} />
          </div>
          {/* <div className='volume-usage-divider'></div> */}
          <div className="brick-line-chart">
            <BrickChangeLineChart data={[]} />
          </div>
        </div>
      </div>
    </ContentCard>
  );
}
