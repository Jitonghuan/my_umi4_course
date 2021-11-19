/*
 * @Author: shixia.ds
 * @Date: 2021-11-17 16:07:16
 * @Description:Page 流量地图-应用流量
 */
import React from 'react';
import { FilterCard, CardRowGroup } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import { Button, DatePicker, Form, Select, Tabs, Tree, Card } from 'antd';
import './index.less';

const { TabPane } = Tabs;

const treeData = [
  {
    title: 'appName',
    key: '0-0',
    children: [
      {
        title: '1-0',
        key: '0-0-1',
      },
      {
        title: '1-1',
        key: '0-0-2',
      },
      {
        title: '1-2',
        key: '0-0-13',
      },
    ],
  },
];

const AppTraffic: React.FC = () => {
  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
  };

  const onCheck = (checkedKeys: React.Key[], info: any) => {
    console.log('onCheck', checkedKeys, info);
  };

  return (
    <PageContainer className="app-traffic">
      <FilterCard>
        <Form layout="inline">
          <Form.Item label="环境">
            <Select style={{ width: '150px' }} />
          </Form.Item>
          <Form.Item label="应用">
            <Select style={{ width: '200px' }} />
          </Form.Item>
          <Form.Item label="时间">
            <DatePicker style={{ width: '200px' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary">查询</Button>
          </Form.Item>
        </Form>
      </FilterCard>
      <CardRowGroup>
        <CardRowGroup.SlideCard width={200}>
          <div className="table-caption">
            <h3>应用列表</h3>
          </div>
          <div>
            <Tree
              defaultExpandedKeys={['0-0-0', '0-0-1']}
              defaultSelectedKeys={['0-0-0', '0-0-1']}
              onSelect={onSelect}
              treeData={treeData}
            />
          </div>
        </CardRowGroup.SlideCard>

        <Card className="app-traffic-content">
          <Tabs activeKey={'1'} type="card" className="action-tabs">
            <TabPane tab="应用详情" key="1">
              <div className="tab-content">
                <div className="app-topo"></div>
                <div className="chart-group">
                  <div style={{ width: 480, height: 330, backgroundColor: 'lightgray' }}></div>
                  <div style={{ width: 480, height: 330, backgroundColor: 'lightgray' }}></div>
                  <div style={{ width: 480, height: 330, backgroundColor: 'lightgray' }}></div>
                  <div style={{ width: 480, height: 330, backgroundColor: 'lightgray' }}></div>
                </div>
              </div>
            </TabPane>
            <TabPane tab="JVM信息" key="2">
              开发中...
            </TabPane>
            <TabPane tab="调用链查询" key="3">
              开发中...
            </TabPane>
          </Tabs>
        </Card>
      </CardRowGroup>
    </PageContainer>
  );
};

export default AppTraffic;
