import React, { useMemo, useEffect, useState, useCallback } from 'react';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import { FilterCard } from '@/components/vc-page-content';
import { history } from 'umi';
import { Card, Segmented, Table } from 'antd';
import { tableSchema } from './schema';
import { useQueryOverviewDashboards, useQueryOverviewInstances, getEnumerateData } from './hook';
import PieOne from './dashboard/pie-one';
import SchemaChart from './dashboard/chart-histogram';
export default function DatabaseOverView() {
  const [loading, infodata, getOverviewDashboards] = useQueryOverviewDashboards();
  const [tableLoading, tableData, getOverviewInstances] = useQueryOverviewInstances();
  const [activeValue, setActiveValue] = useState<number>();
  const [databaseType, setDatabaseType] = useState<any>([]);
  const [pieTypeData, setPieTypeData] = useState<any>();
  const [columnTypeData, setColumnTypeData] = useState<any>();

  useEffect(() => {
    getEnumerateData().then((result) => {
      if (result?.success) {
        let databaseType = result?.data?.databaseType||[];
        let clusterDeployType = result?.data?.clusterDeployType;
        let databaseTypeArry: any = [];
        let clusterDeployTypeArry: any = [];
        // let options: any = [];

        databaseType?.map((item: any) => {
          databaseTypeArry.push(item?.label);
          // options.push({
          //   label: item?.label,
          //   value: item?.values,
          // });
        });
        clusterDeployType?.map((item: any) => {
          clusterDeployTypeArry.push(item?.label);
        });

        setDatabaseType(databaseType);
        setPieTypeData(databaseTypeArry);
        setColumnTypeData(clusterDeployTypeArry);
        getOverviewInstances({ instanceType: databaseType[0]?.value });
        setActiveValue(databaseType[0]?.value);
      }
    });
  }, []);
  useEffect(() => {
    getOverviewDashboards();
  }, []);

  // 表格列配置
  const tableColumns = useMemo(() => {
    return tableSchema({
      onPerformanceTrendsClick: (record, index) => {
        history.push({
          pathname: 'info',
         }, {
            instanceId: record?.id,
            clusterId: record?.clusterId,
            optType: 'overview-list-trend',
        
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
            <PieOne dataSource={infodata} pieTypeData={pieTypeData} />
          </Card>

          <Card style={upperGridStyle}>
            <SchemaChart dataSource={infodata} columnTypeData={columnTypeData} />
          </Card>
        </div>
      </FilterCard>
      <ContentCard>
        <Segmented
          size="large"
          //  block
          options={databaseType}
          defaultValue="mysql"
          value={activeValue}
          onChange={(value: any) => {
            setActiveValue(value);
            getOverviewInstances({ instanceType: value });
          }}
        />
        <div style={{ marginTop: 10 }}>
          <Table loading={tableLoading} columns={tableColumns} dataSource={tableData || []} />
        </div>
      </ContentCard>
    </PageContainer>
  );
}
