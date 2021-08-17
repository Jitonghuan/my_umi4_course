// 告警工单页面
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/17 14:20

import React, { useEffect, useState, useCallback } from 'react';
import { Form, message, Alert, Input, Drawer, Button, Select, Space, Table } from 'antd';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import MatrixPageContent from '@/components/matrix-page-content';
import { postRequest, getRequest } from '@/utils/request';
import * as APIS from '../service';
export default function ticketAlarm() {
  const [alertTicketSearch] = Form.useForm();
  const [pageTotal, setPageTotal] = useState<number>();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useState<any>([]);
  useEffect(() => {
    getAlertTickets({ pageIndex: 1, pageSize: 20 });
  }, []);
  // 查询数据
  const getAlertTickets = (value: any) => {
    setLoading(true);
    getRequest(APIS.alertTickets, {
      data: {
        alertName: value.alertName || '',
        appCode: value.appCode || '',
        envCode: value.envCode || '',
        status: value.status || '',
        pageSize: value.pageSize,
        pageIndex: value.pageIndex,
      },
    })
      .then((res: any) => {
        if (res.success) {
          // console.log('.......',res.data)
          const alertData = res.data.dataSource;
          let pageTotal = res.data.pageInfo.total;
          let pageIndex = res.data.pageInfo.pageIndex;

          setPageTotal(pageTotal);
          setAlertData(alertData);
          setPageIndex(pageIndex);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 过滤操作
  //触发分页

  const pageSizeClick = (pagination: any, currentDataSource: any) => {
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    setPageIndex(pagination.current);
    getAlertTickets(obj);
    // console.log('pagination.current:', pagination.current, pagination.pageSize);
  };

  return (
    <MatrixPageContent isFlex>
      <FilterCard>
        <Form
          layout="inline"
          form={alertTicketSearch}
          onFinish={(values) => {
            getAlertTickets({
              ...values,
              pageIndex: pageIndex,
              pageSize: pageSize,
            });
          }}
          onReset={() => {
            alertTicketSearch.resetFields();
            getAlertTickets({
              pageIndex: 1,
            });
          }}
        >
          <Form.Item label="报警名称" name="alertName">
            <Input placeholder="请输入"></Input>
          </Form.Item>
          <Form.Item label="应用名称" name="appCode">
            {' '}
            <Input placeholder="请输入"></Input>
          </Form.Item>
          <Form.Item label="环境" name="envCode">
            <Input placeholder="请输入"></Input>
          </Form.Item>
          <Form.Item label="报警状态" name="status">
            <Select showSearch style={{ width: 200 }} placeholder="请选择">
              <Option value="refuse">拒绝处理</Option>
              <Option value="firing">告警中</Option>
              <Option value="terminate">中断处理</Option>
              <Option value="resolved">已修复</Option>
            </Select>
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
        <Table
          dataSource={alertData}
          rowKey="id"
          bordered
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
          <Table.Column title="ID" dataIndex="id" width="5%" />
          <Table.Column title="报警名称" dataIndex="alertName" ellipsis width="15%" />
          <Table.Column title="应用名" dataIndex="appCode" ellipsis />
          <Table.Column title="环境" dataIndex="envCode" ellipsis />
          <Table.Column title="通知信息" dataIndex="message" width="15%" />
          <Table.Column title="通知对象" dataIndex="receiver" />
          <Table.Column title="工单等级" dataIndex="ticketLevel" />
          <Table.Column title="开始时间" dataIndex="startTime" />
          <Table.Column title="结束时间" dataIndex="endTime" />
          <Table.Column title="报警状态" dataIndex="status" />
          <Table.Column
            title="操作"
            dataIndex="gmtModify"
            key="action"
            render={(text, record: any) => (
              <Space size="large">
                <a
                  onClick={() => {
                    const query = {
                      appCode: record.appCode,
                      templateType: record.templateType,
                      envCode: record.envCode,
                      categoryCode: record.categoryCode,
                      isClient: 0,
                      isContainClient: 0,
                      id: record.id,
                    };
                    //   history.push(`/matrix/application/detail/AppParameters?${stringify(query)}`);
                  }}
                >
                  查看报警历史
                </a>
              </Space>
            )}
          />
        </Table>
      </ContentCard>
    </MatrixPageContent>
  );
}
