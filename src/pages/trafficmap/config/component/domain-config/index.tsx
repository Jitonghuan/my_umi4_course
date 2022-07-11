import React, { useState, useEffect, useRef } from 'react';
import { Form, Select, Input, Button, Table, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import './index.less';
import { deleteRegion, getRegionList } from '../../../service';
import CreateRegionDrawer from '../create-region-drawer';
import { useEnvOptions } from '../../../hooks';

const DomainConfig: React.FC = () => {
  // 工单创建表单对象

  const [domianList, setDomianList] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false);
  // const [searchValue, setSearchValue] = useState<any>({});
  const [envOptions] = useEnvOptions();
  const [form] = Form.useForm();

  const createRegionRef = useRef<any>();

  useEffect(() => {
    requestRegionList();
  }, []);

  useEffect(() => {
    requestRegionList();
  }, [pageIndex, pageSize]);

  const requestRegionList = async () => {
    const searchValue = form.getFieldsValue();
    let data = {
      pageSize,
      pageIndex,
      ...searchValue,
    };
    setIsTableLoading(true);

    let res = await getRegionList(data);

    setDomianList(res?.data?.dataSource);
    setTotal(res?.data?.pageInfo?.total);
    setIsTableLoading(false);
  };

  // const onSearch = (values: any) => {
  //   setSearchValue(values);
  // };

  const handleEdit = (record: any) => {
    createRegionRef.current.editDrawer(record);
  };

  const handleDeleteRegion = async (id: string) => {
    await deleteRegion(id);
    await requestRegionList();
  };

  const handleView = (record: any) => {
    createRegionRef.current.viewDrawer(record);
  };

  const columns = [
    {
      title: '域名',
      dataIndex: 'regionName',
      key: 'regionName',
    },
    {
      title: '域CODE',
      dataIndex: 'regionCode',
      key: 'regionCode',
    },
    {
      title: '环境CODE',
      dataIndex: 'envCode',
      key: 'envCode',
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      key: 'createUser',
    },
    {
      title: '修改人',
      dataIndex: 'modifyUser',
      key: 'modifyUser',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'action',
      render: (text: string, record: any) => {
        return (
          <>
            <Button type="link" onClick={() => handleView(record)}>
              查看
            </Button>
            <Button type="link" onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Popconfirm
              title="确认删除"
              okText="是"
              cancelText="否"
              onConfirm={() => {
                handleDeleteRegion(record.id);
              }}
            >
              <Button type="link">删除</Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <div className="domain-config">
      {/* <FilterCard style={{ backgroundColor: '#F7F8FA' }}> */}
      <Form
        layout="inline"
        onFinish={requestRegionList}
        form={form}
        onReset={() => {
          form.resetFields();
          requestRegionList();
        }}
      >
        <Form.Item label="域名" name="regionName">
          <Input />
        </Form.Item>
        <Form.Item label="域code" name="regionCode">
          <Input />
        </Form.Item>
        <Form.Item label="环境code" name="envCode">
          <Select options={envOptions} style={{ width: '200px' }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="ghost" htmlType="reset" danger>
            重置
          </Button>
        </Form.Item>
      </Form>
      {/* </FilterCard> */}
      {/* <ContentCard style={{ backgroundColor: '#F7F8FA' }}> */}
      <div className="domian-table-header">
        {/* <h3>配置域列表</h3> */}
        <Button
          type="primary"
          ghost
          onClick={() => {
            createRegionRef.current.showDrawer();
          }}
        >
          <PlusOutlined />
          新增域
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={domianList}
        loading={isTableLoading}
        pagination={{
          current: pageIndex,
          total,
          pageSize,
          showSizeChanger: true,
          onShowSizeChange: (_, size) => {
            setPageSize(size);
            setPageIndex(1); //
          },
          showTotal: () => `总共 ${total} 条数据`,
        }}
      />
      {/* </ContentCard> */}
      <CreateRegionDrawer ref={createRegionRef} requestRegionList={requestRegionList} envOptions={envOptions} />
    </div>
  );
};

export default DomainConfig;
