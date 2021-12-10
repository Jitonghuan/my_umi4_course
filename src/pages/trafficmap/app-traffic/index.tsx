/*
 * @Author: shixia.ds
 * @Date: 2021-11-17 16:07:16
 * @Description:Page 流量地图-应用流量
 */
import React, { useState } from 'react';
import { FilterCard, CardRowGroup } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import { Button, DatePicker, Form, Select, Tabs, Tree, Card } from 'antd';
import './index.less';
import * as echarts from 'echarts';
import { IAppInfo } from '../interface';
import VCCardLayout from '@cffe/vc-b-card-layout';
import LineChart from './_component/line-chart';
import { TreePro } from '@cffe/h2o-design';

const { TabPane } = Tabs;
const lineChartTmp = [
  {
    title: '请求数/每分钟',
    key: 'requests' as 'requests',
  },
  {
    title: '平均响应时间/分钟',
    key: 'averageResponseTime' as 'averageResponseTime',
  },
  {
    title: 'HTTP-响应码',
    key: 'responseCodes' as 'responseCodes',
  },
  {
    title: '错误数',
    key: 'errors' as 'errors',
  },
];

const treeData = [
  {
    title: 'parent 0',
    key: '0-0',
    children: [
      { title: 'leaf 0-0', key: '0-0-0' },
      { title: 'leaf 0-1', key: '0-0-1' },
    ],
  },
];

const dataDemo = {
  requests: {
    data: [
      {
        data: ['9', '9', '9', '9', '9', '9', '9'],
        name: 'http',
        type: 'line',
        color: '#4BA2FF',
      },
      {
        data: ['10', '10', '10', '10', '10', '10', '10'],
        name: 'dubbo',
        type: 'line',
        color: '#00BFAA',
      },
    ],
    xAxis: ['2021-10-24', '2021-10-31', '2021-11-07', '2021-11-14', '2021-11-21', '2021-11-28', '2021-11-29'],
  },
  averageResponseTime: {
    data: [
      {
        data: ['9', '9', '9', '9', '9', '9', '9'],
        name: 'hbos/hbos-osc',
        type: 'line',
        color: 'rgba(101,159,235,1)',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(101,159,235,0.2)',
            },
            {
              offset: 1,
              color: 'rgba(101,159,235,0)',
            },
          ]),
        },
      },
    ],
    xAxis: ['2021-10-24', '2021-10-31', '2021-11-07', '2021-11-14', '2021-11-21', '2021-11-28', '2021-11-29'],
  },
  responseCodes: {
    data: [
      {
        data: ['9', '9', '9', '9', '9', '9', '9'],
        name: '200',
        type: 'line',
        color: '#4BA2FF',
      },
      {
        data: ['3', '4', '5', '7', '9', '3', '1'],
        name: '300',
        type: 'line',
        color: '#5C61F3',
      },
      {
        data: ['6', '7', '8', '9', '4', '3', '5'],
        name: '400',
        type: 'line',
        color: '#FFCB30',
      },

      {
        data: ['4', '5', '3', '3', '3', '6', '2'],
        name: '500',
        type: 'line',
        color: '#F66A51',
      },
    ],
    xAxis: ['2021-10-24', '2021-10-31', '2021-11-07', '2021-11-14', '2021-11-21', '2021-11-28', '2021-11-29'],
  },
  errors: {
    data: [
      {
        data: ['9', '9', '9', '9', '9', '9', '9'],
        name: '错误码',
        type: 'line',
        color: 'rgba(246,106,81,1)',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(246,106,81,0.3)',
            },
            {
              offset: 1,
              color: 'rgba(246,106,81,0)',
            },
          ]),
        },
      },
    ],
    xAxis: ['2021-10-24', '2021-10-31', '2021-11-07', '2021-11-14', '2021-11-21', '2021-11-28', '2021-11-29'],
  },
};
const AppTraffic: React.FC = () => {
  // const [appInfo, setAppInfo] = useState<IAppInfo>(
  //   {
  //     id: '1',
  //     name: 'app1',
  //     chartData: dataDemo,
  //   }
  // );

  const [appTrendMap, setAppTrendMap] = useState<any>(dataDemo);

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
  };

  const onCheck = (checkedKeys: React.Key[], info: any) => {
    console.log('onCheck', checkedKeys, info);
  };

  const layoutGrid = {
    xs: 1,
    sm: 1,
    md: 1,
    lg: 2,
    xl: 2,
    xxl: 2,
    xxxl: 2,
  };

  return (
    <PageContainer className="app-traffic">
      <FilterCard style={{ backgroundColor: '#F7F8FA' }}>
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
            <Button type="primary" ghost>
              查询
            </Button>
          </Form.Item>
        </Form>
      </FilterCard>
      <CardRowGroup>
        <CardRowGroup.SlideCard width={200} style={{ backgroundColor: '#F7F8FA' }}>
          <div className="table-caption">
            <h3>应用列表</h3>
          </div>
          <div>
            <TreePro defaultExpandAll treeData={treeData} showSearch={false} />
          </div>
        </CardRowGroup.SlideCard>

        <Card className="app-traffic-content" style={{ backgroundColor: '#F7F8FA' }}>
          <Tabs activeKey={'1'} type="card" className="action-tabs">
            <TabPane tab="应用详情" key="1">
              <div className="tab-content">
                <div className="app-topo"></div>
                {/* <div className="chart-group"> */}
                <VCCardLayout grid={layoutGrid} className="chart-group">
                  {lineChartTmp.map((item, index: number) => {
                    return (
                      <div className="chart-group-item">
                        <LineChart title={item.title} {...appTrendMap[item.key]} key={index} />
                      </div>
                    );
                  })}
                </VCCardLayout>
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
