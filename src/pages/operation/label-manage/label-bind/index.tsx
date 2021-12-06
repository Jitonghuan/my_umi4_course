// 上下布局页面 应用模版页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 14:20

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, message } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
export default function LabelBind(props: any) {
  const { Option } = Select;
  const [labelBindForm] = Form.useForm();
  const tagName = props?.tagName;
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [pageTotal, setPageTotal] = useState<number>();
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);
      setCurrentData(selectedRows);
    },
  };
  //触发分页
  const pageSizeClick = (pagination: any) => {
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    // loadListData(obj);
    setPageIndex(pagination.current);
  };
  const appTypeOptions = useMemo(
    () => [
      { value: 'backend', label: '后端' },
      { value: 'frontend', label: '前端' },
    ],
    [],
  );
  return (
    <PageContainer>
      <FilterCard>
        <Form
          layout="inline"
          form={labelBindForm}
          onReset={() => {
            labelBindForm.resetFields();
          }}
        >
          <Form.Item label="应用类型" name="appType">
            <Select options={appTypeOptions} placeholder="请选择" style={{ width: 100 }} allowClear />
          </Form.Item>
          <Form.Item label="应用分类：" name="appCategoryCode">
            <Select showSearch style={{ width: 120 }} options={categoryData} />
          </Form.Item>
          <Form.Item label="应用CODE" name="appCode">
            <Input placeholder="单行输入"></Input>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="ghost" htmlType="reset">
              重置
            </Button>
          </Form.Item>
        </Form>
        <span>{tagName}</span>
      </FilterCard>
      <ContentCard>
        <div>
          <Table
            rowKey="id"
            dataSource={dataSource}
            bordered
            rowSelection={{ ...rowSelection }}
            loading={loading}
            scroll={{ y: window.innerHeight - 330, x: '100%' }}
            // pagination={{
            //   total: pageTotal,
            //   pageSize,
            //   current: pageIndex,
            //   showSizeChanger: true,
            //   onShowSizeChange: (_, size) => {
            //     setPageSize(size);
            //     setPageIndex(1);
            //   },
            //   showTotal: () => `总共 ${pageTotal} 条数据`,
            // }}
            // pagination={{ showSizeChanger: true, showTotal: () => `总共 ${pageTotal} 条数据`  }}
            onChange={pageSizeClick}
          >
            <Table.Column title="ID" dataIndex="id" width="4%" />
            <Table.Column title="应用名" dataIndex="appName" width="20%" ellipsis />
            <Table.Column title="应用Code" dataIndex="appCode" width="26%" ellipsis />
            <Table.Column title="应用分类" dataIndex="appCategoryCode" width="12%" />
            <Table.Column title="应用标签" dataIndex="tagName" width="12%" />
          </Table>
        </div>
        <div>
          <Space>
            <Button>取消</Button>
            <Button>绑定</Button>
          </Space>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
