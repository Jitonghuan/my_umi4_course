import React, { useMemo, useState } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { Button, Space, Form } from 'antd';
import { createTableColumns, typeOptions } from './schema';
import { useDeleteArticle } from './hook';
import * as APIS from './service';
import useTable from '@/utils/useTable';
import CreatArticle from './creat-message';
export default function AdminList() {
  const [form] = Form.useForm();
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const [curRecord, setcurRecord] = useState<any>({});
  const [delLoading, deleteArticle] = useDeleteArticle();

  const columns = useMemo(() => {
    return createTableColumns({
      onEdit: (record, index) => {
        setcurRecord(record);
        setMode('EDIT');
      },
      onView: (record, index) => {
        setcurRecord(record);
        setMode('VIEW');
      },
      onDelete: async (id) => {
        await deleteArticle({ id }).then(() => {
          submit();
        });
      },
    }) as any;
  }, []);

  const {
    tableProps,
    search: { submit, reset },
  } = useTable({
    url: APIS.getContentList,
    method: 'GET',
    form,
    formatter: (params) => {
      return {
        ...params,
        group: 'admin',
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
      <CreatArticle
        mode={mode}
        initData={curRecord}
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
        formOptions={[
          {
            key: '1',
            type: 'select',
            label: '类型',
            dataIndex: 'type',
            width: '200px',
            placeholder: '请选择',
            option: typeOptions,
          },
        ]}
        formLayout="inline"
        columns={columns}
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          // size: 'small',
          defaultPageSize: 20,
        }}
        extraNode={
          <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <h3>消息列表</h3>
            <Button
              type="primary"
              onClick={() => {
                setMode('ADD');
              }}
            >
              + 新增
            </Button>
          </Space>
        }
        className="table-form"
        onSearch={submit}
        reset={reset}
        searchText="查询"
      />
    </PageContainer>
  );
}
