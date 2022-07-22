import React, { useMemo, useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import { FilterCard } from '@/components/vc-page-content';
import { history } from 'umi';
import { Card, Segmented, Table } from 'antd';
import { tableSchema } from './schema';
import { useQueryOverviewDashboards, useQueryOverviewInstances } from './hook';
import { options } from './schema';
import PieOne from './dashboard/pie-one';
import SchemaChart from './dashboard/chart-histogram';
export default function DatabaseOverView() {
  const [loading, infodata, getOverviewDashboards] = useQueryOverviewDashboards();
  const [tableLoading, tableData, getOverviewInstances] = useQueryOverviewInstances();
  const [activeValue, setActiveValue] = useState<number>(3);

  useEffect(() => {
    getOverviewInstances({ instanceType: activeValue });
  }, [activeValue]);
  useEffect(() => {
    getOverviewDashboards();
  }, []);

  // 表格列配置
  const tableColumns = useMemo(() => {
    return tableSchema({
      onPerformanceTrendsClick: (record, index) => {
        history.push({
          pathname: 'info',
          state: {
            instanceId: record?.id,
            clusterId: record?.clusterId,
            optType: 'overview-list-trend',
          },
        });
      },
    }) as any;
  }, []);
  const upperGridStyle: React.CSSProperties = {
    width: '50%',
    // textAlign: 'center',
    height: 280,
    margin: 12,
  };

  return (
    <PageContainer>
      <FilterCard>
        <div style={{ display: 'flex' }}>
          <Card style={upperGridStyle}>
            <PieOne dataSource={infodata} />
          </Card>

          <Card style={upperGridStyle}>
            <SchemaChart dataSource={infodata} />
          </Card>
        </div>
      </FilterCard>
      <ContentCard>
        <Segmented
          size="large"
          //  block
          options={options}
          defaultValue="mysql"
          value={activeValue}
          onChange={(value: any) => {
            setActiveValue(value);
          }}
        />
        <div style={{ marginTop: 10 }}>
          <Table loading={tableLoading} columns={tableColumns} dataSource={tableData || []} />
        </div>
      </ContentCard>
    </PageContainer>
  );
}
