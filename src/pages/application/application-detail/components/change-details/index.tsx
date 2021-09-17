import React, { useEffect, useMemo } from 'react';
import { Button, Select } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { appChangeChart } from './formatter';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
import AppChangeTable from './change-details-table';

export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}
export default function Dashboards(props: ChartCaseListProps) {
  const { Option } = Select;
  const { ColorContainer } = colorUtil.context;
  const { data, loading } = props;

  const clusterAchartOptions = useMemo(() => {
    return appChangeChart(data);
  }, [data]);
  useEffect(() => {}, []);
  const handleChange = (value: any) => {
    console.log(`selected ${value}`);
  };

  return (
    <ContentCard className="cluster-dashboards">
      <div>
        <div style={{ float: 'right', marginRight: '16%' }}>
          <span>查询周期：</span>
          <Select style={{ width: 120, zIndex: 9 }} onChange={handleChange}>
            <Option value="jack">最近7天</Option>
            <Option value="lucy">最近15天</Option>
            <Option value="Yiminghe">最近30天</Option>
          </Select>
        </div>
        <div style={{ height: '400px' }}>
          <ColorContainer roleKeys={['color']}>
            <EchartsReact option={clusterAchartOptions} />
          </ColorContainer>
        </div>
      </div>
      <div style={{ height: '400px', marginTop: '10%' }}>
        <AppChangeTable loading={loading} />
      </div>
    </ContentCard>
  );
}
