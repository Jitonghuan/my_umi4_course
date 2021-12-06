// 上下布局页面 应用模版页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 14:20

import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, message } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { getRequest, delRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';

/** 编辑页回显数据 */
export interface TmplEdit extends Record<string, any> {
  templateCode: string;
  templateType: string;
  templateName: string;
  tmplConfigurableItem: object;
  appCategoryCode: any;
  envCodes: string;
  templateValue: string;
  remark: string;
}
export default function Launch() {
  const { Option } = Select;
  const [labelForm] = Form.useForm();
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
  return (
    <PageContainer>
      <FilterCard>
        <Form
          layout="inline"
          form={labelForm}
          onReset={() => {
            labelForm.resetFields();
          }}
        >
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
      </FilterCard>
      <ContentCard>
        <div>
          <Table
            rowKey="id"
            dataSource={dataSource}
            bordered
            rowSelection={{ ...rowSelection }}
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
            onChange={pageSizeClick}
          >
            <Table.Column title="ID" dataIndex="id" width="4%" />

            <Table.Column title="应用Code" dataIndex="appCode" width="26%" ellipsis />

            <Table.Column title="标签Code" dataIndex="tagCode" width="12%" />
          </Table>
        </div>
        <div>
          <Space>
            <Button>取消</Button>
            <Button>解绑</Button>
          </Space>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
