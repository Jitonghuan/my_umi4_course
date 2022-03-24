// 产品列表页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/02/21 17:10

import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, message, Tag, Modal } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { addAPIPrefix } from '@/utils';
import { getRequest, delRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';

export interface Item {
  id: string;
  templateName: string;
  templateCode: string;
  appCode: string;
  appVsersion: string;
  envCode: string;
  status?: number;
}
export default function deliveryList() {
  const { Option } = Select;
  const [loading, setLoading] = useState(false);
  const [versionListData, setVersionListData] = useState<any[]>([
    {
      key: '1',
      templateName: '8888',
      appName: '应用模版',
      templateCode: 'xuxu',
      appCategoryCode: 'xiniuyiliao',
      envCode: '天台',
      id: '1',
    },
  ]);
  useEffect(() => {
    versionList();
  }, []);

  const versionList = () => {
    getRequest(addAPIPrefix('/deliverManage/deliverDeploy/list')).then((result) => {
      const source = result?.data?.dataSource;
      setVersionListData(source);
    });
  };
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [formTmpl] = Form.useForm();
  const [pageTotal, setPageTotal] = useState<number>();
  const [createProductVisible, setCreateProductVisible] = useState<boolean>(false); //是否展示抽屉
  const pageSizeClick = () => {};
  //删除数据
  const handleDelItem = (record: any) => {
    let id = record.id;
  };

  const columns = [
    {
      title: '产品名称',
      dataIndex: 'id',
      width: '30%',
    },
    {
      title: '产品描述',
      dataIndex: 'templateName',
      width: '30%',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'time',
      width: '30%',
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: 150,
      render: (_: string, record: Item) => (
        <Space>
          <a>管理</a>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => {}}
            // onCancel={cancel}
            okText="是"
            cancelText="否"
          >
            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const handleSubmit = () => {
    setCreateProductVisible(false);
  };
  return (
    <PageContainer>
      <FilterCard>
        <div className="table-caption">
          <div className="caption-left">
            <Form layout="inline" form={formTmpl}>
              <Form.Item label="产品名称：" name="appCategoryCode">
                <Input placeholder="单行输入"></Input>
              </Form.Item>
              {/*       
          <Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="ghost" htmlType="reset">
              重置
            </Button>
          </Form.Item> */}
            </Form>
          </div>
          <div className="caption-right">
            <Button
              type="primary"
              onClick={() => {
                setCreateProductVisible(true);
              }}
            >
              创建产品
            </Button>
          </div>
        </div>
      </FilterCard>
      <ContentCard>
        <div>
          <Table
            rowKey="id"
            dataSource={versionListData}
            bordered
            columns={columns}
            loading={loading}
            pagination={{
              total: pageTotal,
              pageSize,
              current: pageIndex,
              showSizeChanger: true,
              onShowSizeChange: (_, size) => {
                setPageSize(size);
                setPageIndex(1);
              },
              showTotal: () => `总共 ${pageTotal} 条数据`,
            }}
            // pagination={{ showSizeChanger: true, showTotal: () => `总共 ${pageTotal} 条数据`  }}
            onChange={pageSizeClick}
          ></Table>
        </div>
        <Modal
          title="创建产品"
          visible={createProductVisible}
          footer={
            <div className="drawer-footer">
              <Button type="primary" loading={loading} onClick={handleSubmit}>
                确定
              </Button>
              <Button type="default">取消</Button>
            </div>
          }
        >
          <Form layout="vertical">
            <Form.Item label="产品名称:">
              <Input style={{ width: 470 }}></Input>
            </Form.Item>
            <Form.Item label="产品描述:">
              <Input style={{ width: 470 }}></Input>
            </Form.Item>
          </Form>
        </Modal>
      </ContentCard>
    </PageContainer>
  );
}
