// 日志告警
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/23 09:25

import React, { useCallback, useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Tag } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { getRequest } from '@/utils/request';
import * as APIS from './service';
import { useAppOptions, useEnvOptions, useStatusOptions } from './hooks';
import './index.less';

export default function LoggerAlarm() {
  const [searchField] = Form.useForm();
  const [appOptions] = useAppOptions();
  const [envOptions] = useEnvOptions();
  const [statusOptions] = useStatusOptions();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [tableSource, setTableSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const queryTableData = (page = pageIndex) => {
    const values = searchField.getFieldsValue();

    setLoading(true);
    getRequest(APIS.getMonitorList, {
      data: {
        ...values,
        pageIndex: page,
        pageSize,
      },
    })
      .then((result) => {
        const { dataSource, pageInfo } = result.data || {};
        setTableSource(dataSource || []);
        setTotal(pageInfo?.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearch = () => {
    setPageIndex(1);
    queryTableData(1);
  };

  useEffect(() => {
    queryTableData();
  }, [pageSize]);

  return (
    <MatrixPageContent className="page-logger-alarm">
      <FilterCard>
        <Form form={searchField} layout="inline" onReset={() => handleSearch()}>
          <Form.Item label="告警名称" name="name">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="应用名称" name="appCode">
            <Select
              placeholder="请选择"
              options={appOptions}
              style={{ width: 168 }}
            />
          </Form.Item>
          <Form.Item label="环境名称" name="envCode">
            <Select
              placeholder="请选择"
              options={envOptions}
              style={{ width: 168 }}
            />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select
              placeholder="请选择"
              options={statusOptions}
              style={{ width: 168 }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" ghost onClick={handleSearch}>
              查询
            </Button>
            <Button type="default" htmlType="reset" style={{ marginLeft: 12 }}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </FilterCard>
      <ContentCard>
        <div className="table-caption">
          <h3>告警列表</h3>
          <Button type="primary">+ 新增日志告警</Button>
        </div>
        <Table
          loading={loading}
          dataSource={tableSource}
          pagination={{
            current: pageIndex,
            total: total,
            defaultPageSize: 20,
            onChange: (page, pageSize) => {
              console.log('>>>> page, pageSize', page, pageSize);
            },
          }}
        >
          <Table.Column dataIndex="id" title="ID" />
          <Table.Column dataIndex="name" title="报警名称" />
          <Table.Column dataIndex="appName" title="应用名称" />
          <Table.Column dataIndex="envName" title="环境名称" />
          <Table.Column dataIndex="message" title="报警分类" />
          <Table.Column dataIndex="expression" title="报警表达式" />
          <Table.Column
            dataIndex="status"
            title="状态"
            render={(v, record) => {
              return v === 1 ? (
                <Tag color="success">已启用</Tag>
              ) : v === 0 ? (
                <Tag color="default">已关闭</Tag>
              ) : null;
            }}
          />
          <Table.Column
            title="操作"
            render={(_, record, index) => (
              <div className="action-cell">
                <Button type="text">编辑</Button>
                <Button type="text">删除</Button>
              </div>
            )}
          />
        </Table>
      </ContentCard>
    </MatrixPageContent>
  );
}
