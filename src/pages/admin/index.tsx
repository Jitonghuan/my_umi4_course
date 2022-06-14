import React, { useMemo } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { Button, Space, Form } from 'antd';
import { createFormColumns, createTableColumns } from './schema';
import useTable from '@/utils/useTable';
export default function AdminList() {
  const [form] = Form.useForm();
  const formOptions = [{}];
  const onDelete = () => {};
  const onView = () => {};
  const onEdit = () => {};
  // const columns = useMemo(() => {
  //   return createTableColumns({categoryData, businessData });
  // }, []);

  const curRecord: any = [];
  const businessData: any = [];
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
    url: '',
    method: 'GET',
    form,
    formatter: (params) => {
      return {
        ...params,
        preDeployTime: params.preDeployTime ? params.preDeployTime.format('YYYY-MM-DD') : undefined,
      };
    },
    formatResult: (result) => {
      return {
        total: result.data?.pageInfo?.total,
        list: result.data?.dataSource?.map((el: any) => ({ ...el.plan })) || [],
      };
    },
  });

  return (
    <PageContainer>
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
          // defaultPageSize: 20,
        }}
        extraNode={
          <Space>
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
