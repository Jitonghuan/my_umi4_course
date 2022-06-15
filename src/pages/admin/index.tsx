import React, { useMemo, useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { Button, Space, Form } from 'antd';
import { createFormColumns, createTableColumns } from './schema';
import * as APIS from './service';
import useTable from '@/utils/useTable';
import CreatArticle from './creat-article';
export default function AdminList() {
  const [form] = Form.useForm();
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const [curRecord, seturRecord] = useState<any>({});
  const onDelete = () => {};
  const onView = () => {
    setMode('VIEW');
  };
  const onEdit = () => {};
  useEffect(() => {
    form.setFieldsValue({ type: 'announcement' });
  }, []);

  const onTypeChange = (type: string) => {};
  const formOptions = useMemo(() => {
    return createFormColumns({
      onTypeChange,
    });
  }, []);
  const columns = createTableColumns({
    onDelete,
    onView,
    onEdit,
    curRecord,
  });

  const {
    tableProps,
    search: { submit, reset },
  } = useTable({
    url: APIS.getInfoList,
    method: 'GET',
    form,
    formatter: (params) => {
      return {
        ...params,
        // preDeployTime: params.preDeployTime ? params.preDeployTime.format('YYYY-MM-DD') : undefined,
      };
    },
    formatResult: (result) => {
      return {
        total: result.data?.pageInfo?.total,
        list: result.data?.dataSource || [],
      };
    },
  });

  const onSave = () => {};

  return (
    <PageContainer>
      <CreatArticle
        mode={mode}
        initData={curRecord}
        onClose={() => {
          setMode('HIDE');
        }}
        onSave={onSave}
      />

      <TableSearch
        form={form}
        formOptions={formOptions}
        formLayout="inline"
        columns={columns}
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          size: 'small',
          defaultPageSize: 20,
        }}
        extraNode={
          <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <h3>列表</h3>
            <Button type="primary" ghost>
              新增
            </Button>
          </Space>
        }
        className="table-form"
        onSearch={submit}
        reset={reset}
        scroll={tableProps.dataSource.length > 0 ? { x: 2000 } : {}}
        searchText="查询"
      />
    </PageContainer>
  );
}
