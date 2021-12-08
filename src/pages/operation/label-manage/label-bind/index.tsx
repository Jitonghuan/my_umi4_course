// 应用标签绑定
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/12/03 14:20

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, message, Row, Col, Tag } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { useUnbindLabelList, useAppCategoryOption, useBindAppTag, useBindLabelTag } from '../hook';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
export default function LabelBind(props: any) {
  const { Option } = Select;
  const [labelBindForm] = Form.useForm();
  const { tagName, tagCode } = props.location?.query;

  const [unbindLabelsource, getUnBindTagAppList, loading, bindTagNamesArry] = useUnbindLabelList(); //获取未绑定的标签列表
  const [categoryData] = useAppCategoryOption(); //获取应用分类下拉选择
  const [bindLabelTag] = useBindLabelTag(); //绑定标签

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  useEffect(() => {
    getUnBindTagAppList(tagCode);
  }, []);
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };

  const appTypeOptions = useMemo(
    () => [
      { value: 'backend', label: '后端' },
      { value: 'frontend', label: '前端' },
    ],
    [],
  );

  //点击绑定按钮
  let appCodesArry: any = [];
  const bindTag = () => {
    selectedRows?.map((item) => {
      appCodesArry.push(item.appCode);
    });
    bindLabelTag(tagCode, tagName, appCodesArry).then(() => {
      getUnBindTagAppList(tagCode);
    });
  };

  const search = (values: any) => {
    getUnBindTagAppList(tagCode, values?.appCategoryCode, values?.appCode, values?.appType);
  };
  return (
    <PageContainer>
      <FilterCard>
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <div style={{ width: 840 }}>
            <Form
              layout="inline"
              form={labelBindForm}
              onFinish={search}
              onReset={() => {
                labelBindForm.resetFields();
                getUnBindTagAppList(tagCode);
              }}
            >
              <Form.Item label="应用类型" name="appType">
                <Select options={appTypeOptions} placeholder="请选择" style={{ width: 120 }} allowClear />
              </Form.Item>
              <Form.Item label="应用分类：" name="appCategoryCode">
                <Select showSearch style={{ width: 120 }} options={categoryData} allowClear />
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
          </div>
          <div style={{ width: '28%' }}>
            <span style={{ display: 'flex', height: 24, width: '100%' }}>
              <h3>当前绑定标签：</h3> <Tag color="success">{tagName}</Tag>
            </span>
          </div>
        </div>
      </FilterCard>
      <ContentCard>
        <div>
          <Table
            rowKey="id"
            dataSource={unbindLabelsource}
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
            <Table.Column title="ID" dataIndex="id" width="4%" />
            <Table.Column title="应用名" dataIndex="appName" width="20%" ellipsis />
            <Table.Column title="应用Code" dataIndex="appCode" width="16%" ellipsis />
            <Table.Column title="应用分类" dataIndex="appCategoryCode" width="12%" />
            <Table.Column
              title="应用标签"
              dataIndex="bindTagNames"
              width="48%"
              ellipsis
              render={(bindTagNames) => (
                <span>
                  {bindTagNames?.map((tag: any) => {
                    let color = 'green';
                    return (
                      <span style={{ marginLeft: 4 }}>
                        <Tag color={color}>{tag}</Tag>
                      </span>
                    );
                  })}
                </span>
              )}
            />
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
            <Button type="primary" onClick={bindTag}>
              绑定
            </Button>
          </Space>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
