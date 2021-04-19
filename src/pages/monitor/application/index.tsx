import React, { useState } from 'react';
import { Card, Button } from 'antd';

import VCForm, { IColumns } from '@cffe/vc-form';
import HulkTable from '@cffe/vc-hulk-table';
import VCCardLayout from '@cffe/vc-b-card-layout';
import MatrixPageContent from '@/components/matrix-page-content';
import AppCard from './app-card';
import {
  tableSchema,
  ITableSchema,
  getGCTimeChartOption,
  getGCNumChartOption,
  getMemoryChartOption,
  getGCDataChartOption,
} from './schema';

import './index.less';

export interface IProps {
  /** 属性描述 */
  [key: string]: any;
}

const layoutGrid = {
  xs: 1,
  sm: 1,
  md: 1,
  lg: 2,
  xl: 2,
  xxl: 2,
  xxxl: 2,
};

/**
 * Application
 * @description 应用监控页面
 * @create 2021-04-12 19:15:42
 */
const Coms = (props: IProps) => {
  const [tableData, setTableData] = useState<ITableSchema[]>([]);

  const filterColumns: IColumns[] = [
    { name: 'biz', label: '环境', type: 'Select', options: [] },
    { name: 'application', label: '应用名', type: 'Select', options: [] },
  ];

  const appConfig = [
    { title: 'GC瞬时次数/每分钟', getOption: getGCNumChartOption },
    { title: 'GC瞬时耗时/每分钟', getOption: getGCTimeChartOption },
    { title: '堆内存详情/每分钟', getOption: getMemoryChartOption },
    { title: '元空间详情/每分钟', getOption: getGCDataChartOption },
  ];

  return (
    <MatrixPageContent className="monitor-app-list">
      <Card className="monitor-app-body">
        <h3 className="monitor-tabs-content-title">资源使用情况</h3>
        <div className="monitor-app-filter">
          <VCForm
            layout="inline"
            columns={filterColumns}
            className="monitor-filter-form"
            isShowReset={false}
            isShowSubmit={false}
            onValuesChange={(vals) => {
              console.log(vals);
            }}
          />

          <Button size="small">刷新</Button>
        </div>

        <HulkTable columns={tableSchema as IColumns[]} />

        <h3 className="monitor-tabs-content-title">监控图表</h3>
        <VCCardLayout grid={layoutGrid} className="monitor-app-content">
          {appConfig.map((el) => (
            <AppCard {...el} />
          ))}
        </VCCardLayout>
      </Card>
    </MatrixPageContent>
  );
};

export default Coms;
