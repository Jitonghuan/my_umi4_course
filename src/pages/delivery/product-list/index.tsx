// 产品列表页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/02/21 17:10

import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, Spin, Tag, Modal } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import moment from 'moment';
import { addAPIPrefix } from '@/utils';
import { getRequest, delRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { useCreateProduct, useDeleteProduct, useQueryProductList } from './hooks';
import './index.less';

export interface Item {
  id: number;
  productName: string;
  productDescription: string;
  gmtCreate: string;
}
export default function deliveryList() {
  const { Option } = Select;
  const [creatForm] = Form.useForm();
  const [creatLoading, createProduct] = useCreateProduct();
  const [delLoading, deleteProduct] = useDeleteProduct();
  const [tableLoading, dataSource, pageInfo, setPageInfo, queryProductList] = useQueryProductList();
  const [searchform] = Form.useForm();
  const [createProductVisible, setCreateProductVisible] = useState<boolean>(false); //是否展示抽屉
  //触发分页
  const pageSizeClick = (pagination: any) => {
    setPageInfo({ pageIndex: pagination.current });
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    queryProductList(obj);
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
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      width: '30%',
      render: (value: any, record: Item) => <span>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: 150,
      render: (_: string, record: Item) => (
        <Space>
          <a
            onClick={() => {
              history.push({
                pathname: '/matrix/delivery/product-description',
                state: record,
              });
            }}
          >
            管理
          </a>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => {
              deleteProduct(record.id).then(() => {
                queryProductList();
              });
            }}
            okText="是"
            cancelText="否"
          >
            <Spin spinning={delLoading}>
              <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
            </Spin>
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
  const searchList = (values: any) => {
    queryProductList(pageInfo.pageIndex, pageInfo.pageSize, values.productName);
  };
  return (
    <PageContainer>
      <FilterCard>
        <div className="deliveryList-table-caption">
          <div className="deliveryList-caption-left">
            <Form
              layout="inline"
              form={searchform}
              onFinish={searchList}
              onReset={() => {
                searchform.resetFields();
                queryProductList(1, 20);
              }}
            >
              <Form.Item label="产品名称：" name="productName">
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
