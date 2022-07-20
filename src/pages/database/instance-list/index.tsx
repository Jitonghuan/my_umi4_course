import React, { useMemo, useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { Button, Space, Form } from 'antd';
import { history } from 'umi';
import useTable from '@/utils/useTable';
import { getInstanceList } from '../service';
import { formOptions, createTableColumns } from './schema';
import CreateInstance from './components/create-instance';
import { useDeleteInstance } from './hook';
export default function DEMO() {
  const [form] = Form.useForm();
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const [curRecord, setcurRecord] = useState<any>({});
  const [delLoading, deleteInstance] = useDeleteInstance();
  const columns = useMemo(() => {
    return createTableColumns({
      onEdit: (record, index) => {
        setcurRecord(record);
        setMode('EDIT');
      },
      onManage: (record, index) => {
        history.push({
          pathname: 'info',
          state: {
            curRecord: record,
            instanceId: record?.id,
            optType: 'instance-list-manage',
          },
        });
      },
      onViewPerformance: (record, index) => {
        history.push({
          pathname: 'info',
          state: {
            curRecord: record,
            instanceId: record?.id,
            optType: 'instance-list-trend',
          },
        });
      },
      onDelete: async (id) => {
        deleteInstance({ id }).then(() => {
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
    url: getInstanceList,
    method: 'GET',
    form,
    formatter: (params) => {
      return {
        ...params,
      };
    },
    formatResult: (result) => {
      let dataSource = result.data?.dataSource;
      let dataArry: any = [];
      dataSource?.map((item: any) => {
        dataArry.push({
          ...item?.instance,
          status: item?.status,
          clusterName: item?.clusterName,
          envCode: item?.envCode,
        });
      });
      return {
        total: result.data?.pageInfo?.total,
        list: dataArry || [],
      };
    },
  });

  return (
    <PageContainer>
      <CreateInstance
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
            <h3>实例列表</h3>
            <Button
              type="primary"
              ghost
              onClick={() => {
                setMode('ADD');
              }}
            >
              新增实例接入
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
