import React, { useState, useEffect } from 'react';
import {Button, Form, Input, Modal, Radio, Select, Table} from 'antd';
import PageContainer from '@/components/page-container';
import UserSelector from "@/components/user-selector";
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import './index.less';
import DebounceSelect from "@/components/debounce-select";
import {searchGitAddress} from "@/pages/application/_components/application-editor/service";


const { Item: FormItem } = Form;

export default function NpmList() {
  const [searchField] = Form.useForm();
  const [dataList, setDataList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  function handleSearch(pagination?: any) {}

  async function handleSubmit() {
    const params = await form.validateFields();
    if (params) {}
  }

  function handleClose() {
    setVisible(false);
    form.resetFields();
  }

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
              <Button
                type="primary"
                onClick={() => {
                  setVisible(true);
                }}
                icon={<PlusOutlined />}
              >新增</Button>
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
      <Modal
        title="新增npm包"
        visible={visible}
        onOk={handleSubmit}
        onCancel={handleClose}
        confirmLoading={loading}
        maskClosable={false}
      >
        <Form form={form} labelCol={{ flex: '100px' }}>
          <Form.Item label="包名" name="branchName" rules={[{ required: true, message: '请输入包名' }]}>
            <Input />
          </Form.Item>
          <FormItem label="Git 地址" name="gitAddress" rules={[{ required: true, message: '请输入 gitlab 地址' }]}>
            <DebounceSelect
              fetchOptions={searchGitAddress}
              labelInValue={false}
              placeholder="输入仓库名搜索"
            />
          </FormItem>
          <FormItem label="负责人" name="ownerList" rules={[{ required: true, message: '请输入负责人' }]}>
            <UserSelector />
          </FormItem>
          <Form.Item label="描述" name="desc">
            <Input.TextArea placeholder="请输入描述" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
