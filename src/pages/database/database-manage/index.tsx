import React, { useMemo, useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { Button, Space, Form } from 'antd';
import useTable from '@/utils/useTable';
import { createTableColumns } from './schema';
import CreateDataBase from './create-database';
import { getSchemaList } from '../service';
import { useDeleteSchema } from './hook';
export interface SchemaProps {
  clusterId: number;
}

export default function DEMO(props: SchemaProps) {
  const [form] = Form.useForm();
  const { clusterId } = props;
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const [delLoading, deleteSchema] = useDeleteSchema();
  useEffect(() => {
    if (!clusterId) return;
  }, [clusterId]);
  const columns = useMemo(() => {
    return createTableColumns({
      onDelete: async (record) => {
        deleteSchema({ clusterId, id: record?.id }).then(() => {
          reset();
        });
      },
      delLoading: delLoading,
    }) as any;
  }, []);
  const {
    tableProps,
    search: { submit, reset },
  } = useTable({
    url: getSchemaList,
    method: 'GET',
    form,
    formatter: (params) => {
      return {
        ...params,
        clusterId,
      };
    },
    formatResult: (result) => {
      return {
        total: result.data?.pageInfo?.total,
        list: result.data?.dataSource || [],
      };
    },
  });

  return (
    <PageContainer>
      <CreateDataBase
        mode={mode}
        clusterId={clusterId}
        onClose={() => {
          setMode('HIDE');
        }}
        onSave={() => {
          setMode('HIDE');
          reset();
        }}
      />

      <TableSearch
        bordered
        splitLayout={false}
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Button
              type="primary"
              ghost
              onClick={() => {
                setMode('ADD');
              }}
            >
              创建数据库
            </Button>
          </div>
        }
        className="table-form"
        onSearch={submit}
        reset={reset}
        // scroll={tableProps.dataSource.length > 0 ? { x: '100%' } : {}}
        searchText="查询"
      />
    </PageContainer>
  );
}
