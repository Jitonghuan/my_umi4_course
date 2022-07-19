import React, { useMemo, useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { ContentCard } from '@/components/vc-page-content';
import { FilterCard } from '@/components/vc-page-content';
import { Button, Space, Form, Card, Descriptions } from 'antd';
import useTable from '@/utils/useTable';
export default function DEMO() {
  const [form] = Form.useForm();
  const [mode, setMode] = useState<EditorMode>('HIDE');

  return (
    <ContentCard>
      <Card title="集群拓扑"></Card>
      <Descriptions title="基本信息" bordered extra={<Button type="primary">同步元数据</Button>}>
        <Descriptions.Item label="实例ID">Cloud Database</Descriptions.Item>
        <Descriptions.Item label="实例名称">Prepaid</Descriptions.Item>
        <Descriptions.Item label="数据库类型">YES</Descriptions.Item>
        <Descriptions.Item label="所属集群">2018-04-24 18:00:00</Descriptions.Item>
        <Descriptions.Item label="所属环境">2019-04-24 18:00:00</Descriptions.Item>
        <Descriptions.Item label="部署类型"></Descriptions.Item>
        <Descriptions.Item label="实例地址">$80.00</Descriptions.Item>
        <Descriptions.Item label="CPU">$20.00</Descriptions.Item>
        <Descriptions.Item label="内存(GB)">$60.00</Descriptions.Item>
        <Descriptions.Item label="最大连接数">Data disk type: MongoDB</Descriptions.Item>
        <Descriptions.Item label="描述">Data disk type: MongoDB</Descriptions.Item>
        <Descriptions.Item label="存储空间">Data disk type: MongoDB</Descriptions.Item>
      </Descriptions>
    </ContentCard>
  );
}
