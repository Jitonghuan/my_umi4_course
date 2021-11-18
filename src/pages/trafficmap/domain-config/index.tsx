import React, { useState } from 'react';
import { Form, Select, Input, Drawer, Button, Transfer, Table, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';

import './index.less';

const { Item: FormItem } = Form;
const mockData: any[] = [];
for (let i = 0; i < 20; i++) {
  mockData.push({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
  });
}
const initialTargetKeys = mockData.filter((item) => +item.key > 10).map((item) => item.key);

const DomainConfig: React.FC = () => {
  // 工单创建表单对象
  const [createFormRef] = Form.useForm();

  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [envOptions, setEnvOptions] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [targetKeys, setTargetKeys] = useState(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
  const [domianList, setDomianList] = useState<any[]>([]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '域名',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '域CODE',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '环境',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'action',
      render: (text: string, record: any) => {
        return (
          <>
            <Button type="link">查看</Button>
            <Button type="link">编辑</Button>
            <Popconfirm title="确认删除" okText="是" cancelText="否">
              <Button type="link">删除</Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const onChange = (nextTargetKeys: any, direction: any, moveKeys: any) => {
    console.log('targetKeys:', nextTargetKeys);
    console.log('direction:', direction);
    console.log('moveKeys:', moveKeys);
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys: any[], targetSelectedKeys: any[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  return (
    <PageContainer>
      <FilterCard>
        <Form layout="inline">
          <Form.Item label="域名">
            <Input />
          </Form.Item>
          <Form.Item label="域code">
            <Input />
          </Form.Item>
          <Form.Item label="环境code">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary">查询</Button>
          </Form.Item>
        </Form>
      </FilterCard>
      <ContentCard>
        <div className="domian-table-header">
          <h3>配置域列表</h3>
          <Button type="primary" onClick={() => setVisible(true)}>
            <PlusOutlined />
            新增域
          </Button>
        </div>

        <Table columns={columns} dataSource={domianList} />
      </ContentCard>

      <Drawer
        title="创建域"
        visible={visible}
        onClose={() => {
          setVisible(false);
          createFormRef.resetFields();
        }}
        width={800}
        maskClosable={false}
        className="create-ticket-drawer"
      >
        <Form form={form} labelCol={{ flex: '120px' }}>
          <FormItem label="域名" name="name" rules={[{ required: true, message: '请输入域名' }]}>
            <Input placeholder="请输入域名" disabled={isEdit} style={{ width: 320 }} />
          </FormItem>
          <FormItem
            label="域CODE"
            name="code"
            rules={[
              {
                required: true,
                message: '输入的域Code里请不要包含中文',
                pattern: /^[^\u4e00-\u9fa5]*$/,
              },
            ]}
          >
            <Input placeholder="请输入域Code(不要包含中文）" disabled={isEdit} style={{ width: 320 }} />
          </FormItem>
          <FormItem label="环境" name="env" rules={[{ required: true, message: '请选择环境' }]}>
            <Select options={envOptions} placeholder="请选择" style={{ width: 320 }} showSearch />
          </FormItem>
          <FormItem label="备注" name="desc">
            <Input.TextArea placeholder="请输入备注" />
          </FormItem>
          <FormItem label="选择应用">
            <Transfer
              dataSource={mockData}
              titles={['Source', 'Target']}
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              onChange={onChange}
              onSelectChange={onSelectChange}
              render={(item) => item.title}
            />
          </FormItem>
        </Form>
      </Drawer>
    </PageContainer>
  );
};

export default DomainConfig;
