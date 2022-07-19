import React, { useMemo, useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { Button, Space, Form } from 'antd';
import useTable from '@/utils/useTable';
import { getClusterList } from '../service';
import { createTableColumns, formOptions } from './schema';
import CreateCluster from './create-cluster';
import { useDeleteCluster } from './hook';
export default function DEMO() {
  const [form] = Form.useForm();
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const [curRecord, setcurRecord] = useState<any>({});
  const [delLoading, deleteCluster] = useDeleteCluster();

  const columns = useMemo(() => {
    return createTableColumns({
      onEdit: (record) => {
        setcurRecord(record);
        setMode('EDIT');
      },
      onView: (record) => {
        setcurRecord(record);
        setMode('VIEW');
      },
      onDelete: async (id) => {
        deleteCluster({ id }).then(() => {
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
    url: getClusterList,
    method: 'GET',
    form,
    formatter: (params) => {
      return {
        ...params,
      };
    },
    formatResult: (result) => {
      return {
        total: result.data?.pageInfo?.total,
        list: result.data?.dataSource,
      };
    },
  });

  return (
    <PageContainer>
      <CreateCluster
        mode={mode}
        curRecord={curRecord}
        onClose={() => {
          setMode('HIDE');
        }}
        onSave={() => {
          setMode('HIDE');
          reset();
        }}
      />
      <TableSearch
        form={form}
        bordered
        // @ts-ignore
        formOptions={formOptions}
        formLayout="inline"
        columns={columns}
        {...tableProps}
        // @ts-ignore
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          size: 'small',
          defaultPageSize: 20,
        }}
        extraNode={
          <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <h3>集群列表</h3>
            <Button
              type="primary"
              ghost
              onClick={() => {
                setMode('ADD');
              }}
            >
              新集群接入
            </Button>
          </Space>
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
