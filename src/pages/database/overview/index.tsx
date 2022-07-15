import React, { useMemo, useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { ContentCard } from '@/components/vc-page-content';
import { FilterCard } from '@/components/vc-page-content';
import { Button, Space, Form, Card, Segmented } from 'antd';
import useTable from '@/utils/useTable';
import { options } from './schema';
import PieOne from './dashboard/pie-one';
import SchemaChart from './dashboard/chart-histogram';
export default function DatabaseOverView() {
  const [activeValue, setActiveValue] = useState<string>('basic-info');
  const upperGridStyle: React.CSSProperties = {
    width: '50%',
    // textAlign: 'center',
    height: 315,
    margin: 12,
  };
  const lowerGridStyle: React.CSSProperties = {
    width: '50%',
    // textAlign: 'center',
    height: 204,
    margin: 12,
  };
  const [form] = Form.useForm();
  const [mode, setMode] = useState<EditorMode>('HIDE');

  return (
    <PageContainer>
      <FilterCard>
        <div style={{ display: 'flex' }}>
          <Card style={upperGridStyle}>
            <PieOne />
          </Card>
          <Card style={upperGridStyle}>
            <SchemaChart />
          </Card>
        </div>
      </FilterCard>
      <ContentCard>
        <Segmented
          size="large"
          //  block
          options={options}
          defaultValue="basic-info"
          onChange={(value: any) => {
            setActiveValue(value);
          }}
        />
      </ContentCard>
    </PageContainer>
  );
}
