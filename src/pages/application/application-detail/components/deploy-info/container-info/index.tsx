import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Form, Modal, Radio, message, Table, Empty, Descriptions, Divider, Button } from 'antd';
import { columns, containerColumns } from '../components/deployment-list/columns';
import { ContentCard } from '@/components/vc-page-content';
import { history } from 'umi';
import './index.less';

export default function ContainerInfo() {
  return (
    <ContentCard className="container-info">
      <Descriptions
        title="实例信息："
        labelStyle={{ color: '#5F677A', textAlign: 'right', whiteSpace: 'nowrap' }}
        contentStyle={{ color: '#000' }}
        column={3}
        bordered
        extra={
          <Button
            type="primary"
            onClick={() => {
              history.replace({
                pathname: `deployInfo`,
                query: {
                  // appCode: appCode,
                  // envCode: currentEnvData,
                  // viewLogEnvType: envTypeCode,
                },
              });
            }}
          >
            返回
          </Button>
        }
      >
        <Descriptions.Item label="实例名称" contentStyle={{ whiteSpace: 'nowrap' }}>
          --
        </Descriptions.Item>
        <Descriptions.Item label="运行状态">--</Descriptions.Item>
        <Descriptions.Item label="运行镜像">--</Descriptions.Item>
        <Descriptions.Item label="运行环境">--</Descriptions.Item>
        <Descriptions.Item label="实例IP">--</Descriptions.Item>
        <Descriptions.Item label="创建时间">--</Descriptions.Item>
      </Descriptions>
      <Divider />
      <h3 className="container-info-title">容器列表：</h3>
      <Table
        columns={containerColumns}
        locale={{ emptyText: <Empty description="没有容器信息" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
      />

      <Divider />

      <h3 className="deployment-info-title">实例（Pod）事件：</h3>
      <Table
        columns={columns}
        locale={{ emptyText: <Empty description="没有事件" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
      />
    </ContentCard>
  );
}
