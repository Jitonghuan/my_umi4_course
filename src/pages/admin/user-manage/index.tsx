import React, { useMemo, useState } from 'react';
import PageContainer from '@/components/page-container';
import TableSearch from '@/components/table-search';
import { Space, Form, Button, Modal, Input } from 'antd';
import { history } from 'umi';
import { createTableColumns } from './schema';
import { getUserList } from './service';
import useTable from '@/utils/useTable';
import { useCreateUser } from './hook';
export default function UserManage() {
  const [form] = Form.useForm();
  const [createUserForm] = Form.useForm();
  const [loading, createUser] = useCreateUser();
  const [visible, setVisible] = useState<boolean>(false);
  const handleSubmit = () => {
    const values = createUserForm.getFieldsValue();
    createUser({ ...values }).then(() => {
      setVisible(false);
      reset();
    });
  };
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
            <p>
              <Button
                type="primary"
                onClick={() => {
                  createUserForm.resetFields();
                  setVisible(true);
                }}
              >
                批量导入导出
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  createUserForm.resetFields();
                  setVisible(true);
                }}
              >
                新增用户
              </Button>
            </p>
          </Space>
        }
        className="table-form"
        onSearch={submit}
        reset={reset}
        searchText="查询"
      />
      <Modal
        title="新增用户"
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        onOk={handleSubmit}
        confirmLoading={loading}
      >
        <Form labelCol={{ flex: '110px' }} form={createUserForm}>
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 320 }} />
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 320 }} />
          </Form.Item>
          <Form.Item label="手机号" name="mobile" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 320 }} />
          </Form.Item>
          <Form.Item label="Sso用户名" name="ssoUsername">
            <Input style={{ width: 320 }} />
          </Form.Item>
          <Form.Item label="LeaderDingUid" name="leaderDingUid">
            <Input style={{ width: 320 }} />
          </Form.Item>
          <Form.Item label="DingUid" name="dingUid">
            <Input style={{ width: 320 }} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
