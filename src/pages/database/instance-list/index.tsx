import React, { useMemo, useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { Button, Space, Form } from 'antd';
import { history } from 'umi';
import useTable from '@/utils/useTable';
import { getInstanceList } from '../service';
import { createTableColumns, instanceTypeOption, typeOptions } from './schema';
import CreateInstance from './components/create-instance';
import { useDeleteInstance, useGetClusterList } from './hook';
export default function DEMO() {
  const [form] = Form.useForm();
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const [curRecord, setcurRecord] = useState<any>({});
  const [loading, clusterOptions, getClusterList] = useGetClusterList();
  const [delLoading, deleteInstance] = useDeleteInstance();
  const formOptions = [
    {
      key: '1',
      type: 'input',
      label: '实例名称',
      dataIndex: 'name',
      width: '200px',
      placeholder: '请输入',
    },
    {
      key: '3',
      type: 'select',
      label: '类型',
      dataIndex: 'type',
      width: '200px',
      placeholder: '请选择',
      option: instanceTypeOption,
    },
    {
      key: '4',
      type: 'select',
      label: '所属集群',
      dataIndex: 'clusterName',
      width: '200px',
      placeholder: '请选择',
      option: clusterOptions,
    },
  ];
  useEffect(() => {
    getClusterList();
  }, []);
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
            clusterId: record?.clusterId,
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
            usterId: record?.clusterId,
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
      console.log('params', params);
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
        formOptions={[
          {
            key: '1',
            type: 'input',
            label: '实例名称',
            dataIndex: 'name',
            width: '200px',
            placeholder: '请输入',
          },
          {
            key: '2',
            type: 'select',
            label: '类型',
            dataIndex: 'type',
            width: '200px',
            placeholder: '请选择',
            option: typeOptions,
          },
          {
            key: '3',
            type: 'select',
            label: '所属集群',
            dataIndex: 'clusterName',
            width: '200px',
            placeholder: '请选择',
            option: clusterOptions,
          },
        ]}
        // formOptions={formOptions}
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
