//制品管理-配置交付参数
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import moment from 'moment';
import AceEditor from '@/components/ace-editor';
import type { ColumnsType } from 'antd/lib/table';
import { Form, Tabs, Spin, Button, Descriptions, Typography, Table, Tag } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { useQueryIndentInfo, useQueryIndentParamList, useSaveIndentParam, useEditDescription } from '../hook';
import './index.less';
// import { compontentsColums, configDeliverycolums } from './columns';
export const compontentsColums: ColumnsType<any> = [
  {
    title: '参数来源组件',
    dataIndex: 'ranking',
    key: 'ranking',
  },
  {
    title: '作用组件',
    dataIndex: 'calculateCycle',
  },
  {
    title: '参数名称',
    dataIndex: 'envCode',
  },
  {
    title: '描述',
    dataIndex: 'file',
  },
  {
    title: '参数值',
    dataIndex: 'file',
  },
  {
    title: '操作',
    dataIndex: 'operate',
    render: (text: string, record: any) => <span>编辑</span>,
  },
];

export const configDeliverycolums: ColumnsType<any> = [
  {
    title: '组件名称',
    dataIndex: 'componentName',
    key: 'componentName',
  },
  {
    title: '组件描述',
    dataIndex: 'componentDescription',
    key: 'componentDescription',
  },
  {
    title: '创建时间',
    dataIndex: 'gmtCreate',
    key: 'gmtCreate',
  },

  {
    title: '操作',
    key: 'action',
    render: (text: string, record: any) => <span>编辑</span>,
  },
];

export default function ProductConfig() {
  const configInfo: any = history.location.state;
  const { TabPane } = Tabs;
  const { Paragraph } = Typography;
  const [infoLoading, configInfoData, queryIndentInfo] = useQueryIndentInfo();
  const [editableStr, setEditableStr] = useState(configInfo.indentDescription);
  const [loading, dataSource, queryIndentParamList] = useQueryIndentParamList();
  const [saveLoading, saveIndentParam] = useSaveIndentParam();
  const [editLoading, editDescription] = useEditDescription();
  useEffect(() => {
    if (configInfo.id) {
      queryIndentInfo(configInfo.id);
      queryIndentParamList({ id: configInfo.id, isGlobal: true });
    } else {
      return;
    }
  }, [configInfo.id]);
  const tabOnclick = (key: any) => {
    console.log('key', key);
  };
  return (
    <PageContainer>
      <ContentCard>
        <div>
          <Spin spinning={infoLoading}>
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
                {/* <Spin spinning={saveLoading}> */}
                <Paragraph
                  editable={{
                    onChange: (description: string) => {
                      editDescription(configInfo.id, description).then(() => {
                        setEditableStr(description);
                      });
                    },
                  }}
                >
                  {editableStr}
                </Paragraph>
                {/* </Spin> */}
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
          </Spin>
          {/* <Divider /> */}
          <div>
            <h3 style={{ borderLeft: '4px solid #1973cc', paddingLeft: 8, height: 20, fontSize: 16, marginTop: 16 }}>
              交付管理
            </h3>
          </div>
        </div>
        <div style={{ paddingTop: 10 }}>
          <Tabs defaultActiveKey="1" onChange={tabOnclick} type="card">
            <TabPane tab="配置交付参数" key="1">
              {/* <div style={{ paddingLeft: 12 }}>配置参数</div> */}
              <Tabs defaultActiveKey="1" onChange={tabOnclick}>
                <TabPane tab="全局参数" key="1">
                  <Table columns={configDeliverycolums}></Table>
                </TabPane>
                <TabPane tab="组件参数" key="2">
                  <Table columns={compontentsColums}></Table>
                </TabPane>
              </Tabs>
            </TabPane>
            <TabPane tab="出包和部署" key="2">
              <div>
                <p>
                  产品部署包：<Tag>暂未出包</Tag>
                  <Button type="primary">出部署包</Button>
                </p>
                {/* <p>
                产品部署包：<Tag>已出包</Tag>
                <Button>下载部署包</Button>
                <Button>重新出包</Button>
              </p> */}
              </div>
              <div style={{ marginBottom: 10 }}>
                安装配置文件：<Button type="primary"> 复制</Button>
                （请将文件中的内容复制到安装包所在目录下的global.yaml）
              </div>
              <div>
                <AceEditor mode="yaml" height={450} />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
