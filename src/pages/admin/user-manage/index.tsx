import React, { useMemo } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { Space, Form } from 'antd';
import { history } from 'umi';
import { createTableColumns } from './schema';
import { getUserList } from './service';
import useTable from '@/utils/useTable';
export default function UserManage() {
  const [form] = Form.useForm();
  const columns = useMemo(() => {
    return createTableColumns({
      onEdit: (record, index) => {
        history.push({
          pathname: '/matrix/admin/create-user',
          state: record,
        });
      },
      onView: (record, index) => {
        history.push({
          pathname: '/matrix/admin/create-user',
          state: { ...record, optType: 'VIEW' },
        });
      },
    }) as any;
  }, []);

  const {
    tableProps,
    search: { submit, reset },
  } = useTable({
    url: getUserList,
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
        list: result.data?.dataSource || [],
      };
    },
  });

  return (
    <PageContainer>
      <TableSearch
        form={form}
        bordered
        formOptions={[
          {
            key: '1',
            type: 'input',
            label: '姓名',
            dataIndex: 'name',
            width: '200px',
            placeholder: '请输入',
          },
        ]}
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
            <h3>用户列表</h3>
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
