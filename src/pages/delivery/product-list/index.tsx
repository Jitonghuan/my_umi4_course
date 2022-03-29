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
import { useCreateProduct, useDeleteProduct, useQueryProductList } from './hooks';
import './index.less';

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
  const [creatForm] = Form.useForm();
  const [creatLoading, createProduct] = useCreateProduct();
  const [delLoading, deleteProduct] = useDeleteProduct();
  const [tableLoading, dataSource, pageInfo, setPageInfo, queryProductList] = useQueryProductList();
  const [versionListData, setVersionListData] = useState<any[]>([
    {
      id: '1',
      productName: '8888',
      productDescription: '应用模版',
      gmtCreate: 'xuxu',
    },
  ]);

  const [formTmpl] = Form.useForm();
  const [createProductVisible, setCreateProductVisible] = useState<boolean>(false); //是否展示抽屉
  const pageSizeClick = () => {};
  //删除数据
  const handleDelItem = (record: any) => {
    let id = record.id;
  };

  const columns = [
    {
      title: '产品名称',
      dataIndex: 'productName',
      width: '30%',
    },
    {
      title: '产品描述',
      dataIndex: 'productDescription',
      width: '30%',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
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
    let params = creatForm.getFieldsValue();
    createProduct(params.product_name, params.product_description).then(() => {
      setCreateProductVisible(false);
      queryProductList();
    });
  };
  return (
    <PageContainer>
      <FilterCard>
        <div className="deliveryList-table-caption">
          <div className="deliveryList-caption-left">
            <Form layout="inline" form={formTmpl}>
              <Form.Item label="产品名称：" name="appCategoryCode">
                <Input placeholder="单行输入"></Input>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="ghost" htmlType="reset">
                  重置
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="deliveryList-caption-right">
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
            dataSource={dataSource}
            bordered
            columns={columns}
            loading={tableLoading}
            pagination={{
              total: pageInfo.total,
              pageSize: pageInfo.pageSize,
              current: pageInfo.pageIndex,
              showSizeChanger: true,
              onShowSizeChange: (_, size) => {
                setPageInfo({
                  pageIndex: 1,
                  pageSize: size,
                });
              },
              showTotal: () => `总共 ${pageInfo.total} 条数据`,
            }}
            // pagination={{ showSizeChanger: true, showTotal: () => `总共 ${pageTotal} 条数据`  }}
            onChange={pageSizeClick}
          ></Table>
        </div>
        <Modal
          title="创建产品"
          visible={createProductVisible}
          onCancel={() => {
            setCreateProductVisible(false);
          }}
          footer={
            <div className="drawer-footer">
              <Button type="primary" loading={creatLoading} onClick={handleSubmit}>
                确定
              </Button>
              <Button
                type="default"
                onClick={() => {
                  setCreateProductVisible(false);
                }}
              >
                取消
              </Button>
            </div>
          }
        >
          <Form layout="vertical" form={creatForm}>
            <Form.Item label="产品名称:" name="product_name">
              <Input style={{ width: 470 }}></Input>
            </Form.Item>
            <Form.Item label="产品描述:" name="product_description">
              <Input style={{ width: 470 }}></Input>
            </Form.Item>
          </Form>
        </Modal>
      </ContentCard>
    </PageContainer>
  );
}
