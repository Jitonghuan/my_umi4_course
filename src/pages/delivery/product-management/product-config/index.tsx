//制品管理-配置交付参数
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import moment from 'moment';
import AceEditor from '@/components/ace-editor';
import {
  Form,
  Tabs,
  Input,
  Select,
  Button,
  Descriptions,
  Typography,
  Table,
  message,
  Popconfirm,
  Divider,
  Tag,
} from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import './index.less';
import { compontentsColums, configDeliverycolums } from './columns';
export default function ComponentDetail() {
  const configInfoData: any = history.location.state;
  const { TabPane } = Tabs;
  const tabOnclick = (key: any) => {};
  const { Paragraph } = Typography;
  const [editableStr, setEditableStr] = useState(configInfoData.indentDescription);
  return (
    <PageContainer>
      <ContentCard>
        <div>
          <Descriptions
            title="局点管理"
            column={2}
            bordered
            className="local-management-info-description"
            extra={
              <Button
                type="primary"
                onClick={() => {
                  history.push('/matrix/delivery/product-management');
                }}
              >
                返回
              </Button>
            }
          >
            <Descriptions.Item label="局点名称">{configInfoData.indentName}</Descriptions.Item>
            <Descriptions.Item label="局点描述">
              <Paragraph editable={{ onChange: setEditableStr }}>{editableStr}</Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="交付产品">{configInfoData.productName}</Descriptions.Item>
            <Descriptions.Item label="交付版本">{configInfoData.productVersion}</Descriptions.Item>
            <Descriptions.Item label="交付项目">{configInfoData.deliveryProject}</Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {moment(configInfoData.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            {/* <Descriptions.Item label="创建时间" span={2}>
                  empty
                </Descriptions.Item> */}
          </Descriptions>
          <Divider />
          <div>
            <div className="delivery-management-instruction">
              <h3>交付管理</h3>
            </div>
          </div>
        </div>
        <Tabs defaultActiveKey="1" onChange={tabOnclick} type="card">
          <TabPane tab="配置交付参数" key="1">
            {/* <div style={{ paddingLeft: 12 }}>配置参数</div> */}
            <Tabs defaultActiveKey="1" onChange={tabOnclick}>
              <TabPane tab="全局参数" key="1">
                <Table columns={configDeliverycolums as any[]}></Table>
              </TabPane>
              <TabPane tab="组件参数" key="2">
                <Table columns={compontentsColums as any[]}></Table>
              </TabPane>
            </Tabs>
          </TabPane>
          <TabPane tab="出包和部署" key="2">
            <div>
              <p>
                产品部署包：<Tag>暂未出包</Tag>
                <Button>出部署包</Button>
              </p>
              {/* <p>
                产品部署包：<Tag>已出包</Tag>
                <Button>下载部署包</Button>
                <Button>重新出包</Button>
              </p> */}
            </div>
            <div style={{ marginBottom: 10 }}>
              安装配置文件：<Button type="primary"> 复制</Button>（请将文件中的内容复制到安装包所在目录下的global.yaml）
            </div>
            <div>
              <AceEditor mode="yaml" height={450} />
            </div>
          </TabPane>
        </Tabs>
      </ContentCard>
    </PageContainer>
  );
}
