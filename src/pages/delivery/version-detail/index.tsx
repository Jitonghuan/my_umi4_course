/*
 * @Author: your name
 * @Date: 2022-03-07 01:01:37
 * @LastEditTime: 2022-03-07 14:11:26
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fe-matrix/src/pages/delivery/version-detail/index.tsx
 */
import React, { useState } from 'react';
import PageContainer from '@/components/page-container';
import { Tabs, Radio, Space, Descriptions, Button, Input, Form } from 'antd';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import EditorTable from './Editor-Table';
import { tabsConfig } from './tab-config';
import './index.less';

const editColumns = [
  {
    title: '键（点击可修改）',
    dataIndex: 'key',
    editable: true,
    width: '45%',
  },
  {
    title: '值（点击可修改）',
    dataIndex: 'value',
    key: 'value',
    editable: true,
    width: '45%',
  },
];
const { TabPane } = Tabs;
export default function VersionDetail() {
  const [matchlabels, setMatchlabels] = useState<any[]>([]);

  const matchlabelsFun = (value: any[]) => {
    setMatchlabels(value);
  };

  return (
    <PageContainer>
      <ContentCard>
        <>
          <Tabs tabPosition="left">
            <TabPane tab="基本信息" key="1">
              <div>
                <Descriptions title="基本信息" column={2} extra={<Button type="primary">编辑</Button>}>
                  <Descriptions.Item label="产品名称">Zhou Maomao</Descriptions.Item>
                  <Descriptions.Item label="产品版本">1810000000</Descriptions.Item>
                  <Descriptions.Item label="版本描述">1810000000</Descriptions.Item>
                  <Descriptions.Item label="创建时间">empty</Descriptions.Item>
                </Descriptions>
              </div>
            </TabPane>
            <TabPane tab="产品编排" key="2">
              <Tabs>
                {tabsConfig?.map((item: any, index: number) => (
                  <TabPane tab={item.label} key={index}>
                    <div className="table-caption-application">
                      <div className="caption-left">
                        <Form layout="inline">
                          <Form.Item>
                            <Input style={{ width: 220 }} placeholder="请输入组件名称"></Input>
                          </Form.Item>
                          <Form.Item>
                            <Button>搜索</Button>
                          </Form.Item>
                        </Form>
                      </div>
                      {/* <div className="caption-right">
                      <Button type="primary">添加应用</Button>
                    </div> */}
                    </div>
                    <div>
                      <EditorTable />
                    </div>
                  </TabPane>
                ))}
              </Tabs>
            </TabPane>
            <TabPane tab="交付配置" key="3">
              Content of Tab 3
            </TabPane>
          </Tabs>
        </>
      </ContentCard>
    </PageContainer>
  );
}
