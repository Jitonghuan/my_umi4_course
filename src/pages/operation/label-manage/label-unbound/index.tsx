// 应用标签解绑
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/12/03 14:20

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, message, Row, Col, Tag } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { usebindedLabelList, useAppCategoryOption, useUnBindLabelTag } from '../hook';
import { getRequest, delRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
export default function UnBound(props: any) {
  const { Option } = Select;
  const [labelBindedForm] = Form.useForm();
  const { tagName, tagCode } = props.location?.query;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [bindedLabelsource, getBindedTagAppList, loading] = usebindedLabelList(); //获取未绑定的标签列表
  const [categoryData] = useAppCategoryOption(); //获取应用分类下拉选择
  const [unbindLabelTag] = useUnBindLabelTag(); //解绑标签

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };
  useEffect(() => {
    getBindedTagAppList(tagCode);
  }, []);

  const appTypeOptions = useMemo(
    () => [
      { value: 'backend', label: '后端' },
      { value: 'frontend', label: '前端' },
    ],
    [],
  );
  const search = (values: any) => {
    getBindedTagAppList(tagCode, values?.appCategoryCode, values?.appCode, values?.appType);
  };

  //点击解绑按钮
  let appCodesArry: any = [];
  const unbindTag = () => {
    selectedRows?.map((item) => {
      appCodesArry.push(item.appCode);
    });
    unbindLabelTag(tagCode, appCodesArry).then(() => {
      getBindedTagAppList(tagCode);
    });
    // setSelectedRowKeys(['undefined']);
  };
  return (
    <PageContainer>
      <FilterCard>
        <Row>
          <Col span={22}>
            <Form
              layout="inline"
              form={labelBindedForm}
              onFinish={search}
              onReset={() => {
                labelBindedForm.resetFields();
                getBindedTagAppList(tagCode);
              }}
            >
              <Form.Item label="应用类型" name="appType">
                <Select options={appTypeOptions} placeholder="请选择" style={{ width: 120 }} allowClear />
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
          </Col>
          <Col span={2}>
            <span style={{ justifyContent: 'end', width: 120 }}>
              <Tag color="success">{tagName}</Tag>
            </span>
          </Col>
        </Row>
      </FilterCard>
      <ContentCard>
        <div>
          <Table
            rowKey="id"
            dataSource={bindedLabelsource}
            bordered
            // rowSelection={{ ...rowSelection }}
            rowSelection={{
              selectedRowKeys,
              onChange: (next, selectedRows) => {
                setSelectedRowKeys(next);
                setSelectedRows(selectedRows);
              },
            }}
            loading={loading}
            scroll={{ y: window.innerHeight - 51, x: '100%' }}
          >
            <Table.Column title="ID" dataIndex="id" width="8%" />
            <Table.Column title="应用名" dataIndex="appName" width="30%" ellipsis />
            <Table.Column title="应用Code" dataIndex="appCode" width="36%" ellipsis />
            <Table.Column title="应用分类" dataIndex="appCategoryCode" width="20%" />
          </Table>
        </div>
        <div>
          <Space style={{ float: 'right', marginTop: 10 }}>
            <Button
              onClick={() => {
                setSelectedRowKeys(['undefined']);
              }}
            >
              取消
            </Button>
            <Button type="primary" onClick={unbindTag}>
              解绑
            </Button>
          </Space>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
