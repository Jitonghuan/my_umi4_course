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
    <PageContainer>
      <ContentCard>
        <div>
          <Form layout="inline">
            <Form.Item label="选择集群">
              <Select style={{ width: 140 }}></Select>
            </Form.Item>
            <Divider />
          </Form>
        </div>
        <div className="volume-status"></div>
        <div style={{ marginTop: 20 }}>
          <Table rowKey="id" bordered>
            <Table.Column title="类型" dataIndex="id" width="4%" />
            <Table.Column title="数量" dataIndex="templateName" width="20%" ellipsis />
            <Table.Column title="可用" dataIndex="languageCode" width="8%" ellipsis />
            <Table.Column title="不可用" dataIndex="templateType" width="8%" ellipsis />
          </Table>
        </div>
        <div className="volume-dashboard-one"></div>
        <div className="cluster-node-info">
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
        <div className="volume-dashboard-two">
          <div className="volume-dashboard-two-left"></div>
          <div className="volume-dashboard-two-right"></div>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
