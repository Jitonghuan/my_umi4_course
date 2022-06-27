import React, { useState, useEffect } from 'react';
import {Button, Form, Input, Table} from 'antd';
import PageContainer from '@/components/page-container';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import './index.less';


const { Item: FormItem } = Form;

export default function NpmList() {
  const [searchField] = Form.useForm();
  const [dataList, setDataList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  function handleSearch(pagination?: any) {}

  useEffect(() => {
    handleSearch();
  }, [])

  return (
    <PageContainer className="npm-list-page">
      <FilterCard>
        <Form
          layout="inline"
          form={searchField}
          onFinish={handleSearch}
          onReset={() => {
            searchField.resetFields();
          }}
        >
          <FormItem label="包名" name="appCode">
            <Input placeholder="请输入" style={{ width: 140 }} />
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}>
              查询
            </Button>
            <Button type="default" htmlType="reset">
              重置
            </Button>
          </FormItem>
          <FormItem noStyle>
            <div className="list-btn-wrapper">
              <Button type="primary" icon={<PlusOutlined />}>新增</Button>
            </div>
          </FormItem>
        </Form>
      </FilterCard>
      <ContentCard>
        <Table
          bordered
          dataSource={dataList}
          rowKey='name'
          scroll={{ x: '100%' }}
          pagination={{
            total,
            pageSize,
            current: page,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
              handleSearch({
                page,
                pageSize
              })
            }
          }}
          columns={[
            {
              title: '包名',
              dataIndex: 'name'
            },
            {
              title: '描述',
              dataIndex: 'desc'
            },
            {
              title: '负责人',
              dataIndex: 'owner'
            },
            {
              width: 140,
              title: '操作',
              fixed: 'right',
              dataIndex: 'operate',
              align: 'center',
              render: (_: any, record: any, index: number) => (
                <div className="action-cell">
                  <a
                    onClick={() => {
                      history.push({
                        pathname: 'detail',
                        query: {
                          id: record.id,
                          appCode: record.appCode,
                        },
                      });
                    }}
                  >
                    详情
                  </a>
                </div>
              ),
            }
          ]}
          />
      </ContentCard>
    </PageContainer>
  );
}
