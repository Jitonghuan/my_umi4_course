// 操作日志
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:35

import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Button, DatePicker } from 'antd';
import moment from 'moment';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import * as APIS from '../app-tmpl/service';
import { getRequest } from '@/utils/request';

export default function Operation() {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchParams, setSearchParams] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [detailItem, setDetailItem] = useState<any>();
  const [pageTotal, setPageTotal] = useState<number>();
  const [logList, setLogList] = useState<any>([]); //查看日志列表信息
  const [formLog] = Form.useForm();
  //进入页面架加载信息
  useEffect(() => {
    setLoading(true);
    getLogQuery({ pageIndex: 1, pageSize: 20 });
  }, []);

  const getLogQuery = (value: any) => {
    getRequest(APIS.logList, { data: { pageIndex: value.pageIndex, pageSize: value.pageSize } })
      .then((res: any) => {
        if (res.success) {
          const logList = (res.data.dataSource || []).map((n: any) => ({
            id: n.id,
            operator: n.operator,
            operateType: n.operateType,
            operateTime: n.operateTime,
            operateEvent: n.operateEvent,
          }));
          setLogList(logList);
          let pageTotal = res.data.pageInfo.total;
          let pageIndex = res.data.pageInfo.pageIndex;
          setPageTotal(pageTotal);
          setPageIndex(pageIndex);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //触发分页
  const pageSizeClick = (pagination: any) => {
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    getLogQuery(obj);
    setPageIndex(pagination.current);
  };
  const showLogModal = (record: any) => {
    getRequest(APIS.logList, { data: { id: record.id } }).then((res: any) => {
      if (res.success) {
        const logDetail = res.data.dataSource[0].content || '';
        // console.log('日志详细内容：', logDetail);
        setDetailItem(logDetail);
      }
    });
  };
  //筛选条件 查询信息
  const logQuery = (value: any) => {
    let operator = value?.operator;
    let operateType = value?.operateType;
    let startTime =
      value?.operateTime && value.operateTime[0] ? `${value.operateTime[0].format('YYYY-MM-DD')} 00:00:00` : '';
    let endTime =
      value?.operateTime && value.operateTime[1] ? `${value.operateTime[1].format('YYYY-MM-DD')} 23:59:59` : '';
    let operateTime = startTime + '-' + endTime || '';
    // console.log('1111111', operateTime);
    getRequest(APIS.logList, { data: { operator, operateType, startTime, endTime, pageIndex, pageSize } })
      .then((res: any) => {
        if (res.success) {
          const logList = (res.data.dataSource || []).map((n: any) => ({
            id: n.id,
            operator: n.operator,
            operateType: n.operateType,
            operateTime: n.operateTime,
            operateEvent: n.operateEvent,
          }));
          setLogList(logList);
          let pageTotal = res.data.pageInfo.total;
          let pageIndex = res.data.pageInfo.pageIndex;
          setPageTotal(pageTotal);
          setPageIndex(pageIndex);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <PageContainer className="tmpl-detail">
      <FilterCard>
        <Form
          layout="inline"
          form={formLog}
          onFinish={(values: any) => {
            logQuery({
              ...values,
              pageIndex: 1,
              pageSize: 20,
            });
          }}
          onReset={() => {
            formLog.resetFields();
            logQuery({
              pageIndex: 1,
              // pageSize: pageSize,
            });
          }}
        >
          <Form.Item label="操作人:" name="operator">
            <Input placeholder="请输入"></Input>
          </Form.Item>
          <Form.Item label="操作类型:" name="operateType">
            <Input placeholder="请输入"></Input>
          </Form.Item>
          <Form.Item label="操作时间:" name="operateTime">
            <DatePicker.RangePicker style={{ width: 240 }} />
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
          bordered
          dataSource={logList}
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
          <Table.Column title="id" dataIndex="id" />
          <Table.Column title="操作人" dataIndex="operator" />
          <Table.Column title="操作类型" dataIndex="operateType" />
          <Table.Column title="操作事件" dataIndex="operateEvent" />
          <Table.Column
            title="操作时间"
            dataIndex="operateTime"
            render={(v: string) => (v ? moment(v).format('YYYY-MM-DD HH:mm:ss') : '--')}
          />
          <Table.Column
            title="操作"
            render={(_, record: any) => (
              <div className="action-cell">
                <a onClick={() => showLogModal(record)}>查看日志</a>
              </div>
            )}
            width={180}
          />
        </Table>
        <Modal
          visible={!!detailItem}
          title="查看日志"
          width={1000}
          maskClosable={false}
          footer={false}
          onCancel={() => setDetailItem(undefined)}
        >
          <pre className="pre-block" style={{ height: window.innerHeight - 300 }}>
            {detailItem}
          </pre>
        </Modal>
      </ContentCard>
    </PageContainer>
  );
}
