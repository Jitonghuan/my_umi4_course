import React, { useMemo, useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { Button, Modal, Form, Input, message } from 'antd';
import useTable from '@/utils/useTable';
import { createTableColumns } from './schema';
import CreateDataBase from './create-database';
import { getSchemaList } from '../service';
import { useDeleteSchema } from './hook';
import { ExclamationCircleOutlined } from '@ant-design/icons';
export interface SchemaProps {
  clusterId: number;
}

export default function DEMO(props: SchemaProps) {
  const [form] = Form.useForm();
  const { clusterId } = props;
  const [ensureForm] = Form.useForm();
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const [delLoading, deleteSchema] = useDeleteSchema();
  useEffect(() => {
    if (!clusterId) return;
  }, [clusterId]);
  const columns = useMemo(() => {
    return createTableColumns({
      onDelete: async (record) => {
        ensureModal(record);
      },
      delLoading: delLoading,
    }) as any;
  }, []);

  const ensureModal = (record: any) => {
    Modal.confirm({
      title: '确定删除该数据库吗？',
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <p>
            您确定要删除此数据库吗？如果是这样，<b>请在此输入数据库名称</b>(
            <span style={{ color: 'red' }}>{record?.name}</span>)并点击确认删除数据库按钮
          </p>
          <Form form={ensureForm}>
            <Form.Item name="schema">
              <Input />
            </Form.Item>
          </Form>
          <span>注意：生产环境禁止直接删除数据库！</span>
        </>
      ),
      okText: '确认删除数据库',
      onOk: async () => {
        const ensure = record?.name === ensureForm.getFieldsValue()?.schema;
        if (!ensure) {
          message.warning('数据库名不一致！');
        } else {
          await deleteSchema({ clusterId, id: record?.id }).then(() => {
            reset();
          });
        }
      },
    });
  };
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
