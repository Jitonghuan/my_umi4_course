import React, { useMemo, useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { ContentCard } from '@/components/vc-page-content';
import { FilterCard } from '@/components/vc-page-content';
import { Button, Space, Form, Input } from 'antd';
import useTable from '@/utils/useTable';
export default function DEMO() {
  const [form] = Form.useForm();
  const [mode, setMode] = useState<EditorMode>('HIDE');

  return (
    <PageContainer>
      <FilterCard>
        <Form form={form}>
          <Form.Item label="姓名">
            <Input style={{ width: 220 }} />
          </Form.Item>
        </Form>
      </FilterCard>
      <ContentCard></ContentCard>
    </PageContainer>
  );
}
