import React, { useMemo, useEffect, useState, useCallback } from 'react';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import VCCardLayout from '@cffe/vc-b-card-layout';
import { history } from 'umi';
import { Card, Segmented, Table, Statistic, Spin, Progress } from 'antd';
import { tableSchema, sqlTableSchema } from './schema';
import { useQueryOverviewDashboards, useQueryOverviewInstances, getEnumerateData } from './hook';
import PieOne from './dashboard/pie-one';
import SchemaChart from './dashboard/chart-histogram';
import './index.less'
export const infoLayoutGrid = {
  xs: 1,
  sm: 1,
  md: 2,
  lg: 4,
  xl: 4,
  xxl: 4,
  xxxl: 4,
};
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
        let databaseType = result?.data?.databaseType || [];
        let clusterDeployType = result?.data?.clusterDeployType;
        let databaseTypeArry: any = [];
        let clusterDeployTypeArry: any = [];
        databaseType?.map((item: any) => {
          databaseTypeArry.push(item?.label);
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
  const sqlTableSchemaColumns = useMemo(() => {
    return sqlTableSchema() as any;

  }, [])
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
    height: 200,
    margin: 12,
  };
  const lowSqlGridStyle: React.CSSProperties = {
    width: '28%',
    height: 370,
    margin: 12,
  };

  return (
    <PageContainer className="database-overview">
      <ContentCard>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '72%', }}>
            <div style={{ width: '100%', display: 'flex' }}>
              <Card style={upperGridStyle}>
                <PieOne dataSource={infodata} pieTypeData={pieTypeData} />
              </Card>
              <Card style={upperGridStyle}>
                <SchemaChart dataSource={infodata} columnTypeData={columnTypeData} />
              </Card>
            </div>
            <Spin spinning={loading}>
              <div className="statistic-content">
                <VCCardLayout grid={infoLayoutGrid}>
                  <Statistic title="备份开启/未开启" value={infodata?.sumBakEnable || 0} suffix={` / ${infodata?.sumBakDisable || 0}`} valueStyle={{ color: '#1E90FF', fontSize: 52, textAlign: 'center' }} />
                  <Statistic title="繁忙实例" value={infodata?.sumFullInstance || 0} valueStyle={{ color: '#00FF00', fontSize: 52, textAlign: 'center' }} />
                  <Statistic title="活跃限流任务" value={infodata?.sumRateLimit || 0} valueStyle={{ color: '#cf1322', fontSize: 52, textAlign: 'center' }} />
                  <Statistic title="今日新增慢sql" value={`${infodata?.increaseSlowLog || 0}`} valueStyle={{ color: '#DAA520', fontSize: 52, textAlign: 'center' }} />
                </VCCardLayout>
              </div>
            </Spin>
          </div>
          <Card style={lowSqlGridStyle} title="慢Sql黑榜" >
            <Table
              columns={sqlTableSchemaColumns}
              loading={loading}
              // bordered
              dataSource={infodata?.slowLogBlackList || []}
              scroll={{ y: window.innerHeight - 450 }}
              // locale={{
              //   emptyText: (
              //     <div className="custom-table-holder">
              //       {loading ? '加载中……' : infodata?.slowLogBlackList?.length < 1 ? '没有数据' : " "
              //       }
              //     </div>
              //   ),
              // }}
              pagination={false}
            />

          </Card>
        </div>
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
          <Table bordered scroll={{ x: "100%" }} loading={tableLoading} columns={tableColumns} dataSource={tableData || []} />
        </div>
      </ContentCard>

    </PageContainer>
  );
}
