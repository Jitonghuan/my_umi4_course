import React, { useEffect, useState } from 'react';
import { Tabs, Table } from 'antd';
import Header from '../header';
import moment from 'moment';
import './index.less';
import { queryOverview } from '../server';

const now = [moment(moment().format('YYYY-MM-DD 00:00:00')), moment()];
const { TabPane } = Tabs;

interface IProps {
  appGroup: string;
}

const BasicApi = ({ appGroup }: IProps) => {
  const [timeList, setTimeList] = useState<any>(now);
  const [active, setActive] = useState('1');

  // 失败
  const [errorTotal, setErrorTotal] = useState<number>(0);
  const [errorIndex, setErrorIndex] = useState<number>(1);
  const [errorSize, setErrorSize] = useState<number>(20);
  const [errorData, setErrorData] = useState<any[]>([]);

  // 超时
  const [timeOutTotal, setTimeOutTotal] = useState<number>(0);
  const [timeOutIndex, setTimeOutIndex] = useState<number>(1);
  const [timeOutSize, setTimeOutSize] = useState<number>(20);
  const [timeOutData, setTimeOutData] = useState<any[]>([]);

  async function onSearchError(page?: number, size?: number) {
    const res = await queryOverview({
      appGroup,
      startTime: timeList[0] ? moment(timeList[0]).format('YYYY-MM-DD HH:mm:ss') : null,
      endTime: timeList[1] ? moment(timeList[1]).format('YYYY-MM-DD HH:mm:ss') : null,
      pageIndex: errorIndex,
      pageSize: errorSize,
    });
  }

  async function onSearchTimeOut(page?: number, size?: number) {
    const res = await queryOverview({
      appGroup,
      startTime: timeList[0] ? moment(timeList[0]).format('YYYY-MM-DD HH:mm:ss') : null,
      endTime: timeList[1] ? moment(timeList[1]).format('YYYY-MM-DD HH:mm:ss') : null,
      pageIndex: timeOutIndex,
      pageSize: timeOutSize,
    });
  }

  useEffect(() => {
    if (active === '1') {
      void onSearchError();
    } else {
      void onSearchTimeOut();
    }
  }, [timeList, appGroup]);

  return (
    <div className="basic-api-wrapper">
      <Header onChange={setTimeList} defaultTime={timeList} />
      <Tabs activeKey={active} onChange={setActive}>
        <TabPane tab="API失败接口" key="1">
          <Table
            dataSource={errorData}
            bordered
            rowKey="url"
            columns={[
              {
                title: 'API',
                dataIndex: 'd1',
              },
              {
                title: '页面名称',
                dataIndex: 'url',
              },
              {
                title: 'TraceId',
                render: (value, record) => <span>{record.d3?.split('-')[1] || '-'}</span>,
              },
              {
                title: '耗时',
                render: (value, record) => <span>{record.d3?.split('-')[0] || '-'}</span>,
              },
              {
                title: '上报时间',
                dataIndex: 'time',
              },
              {
                title: '入参',
                dataIndex: 'd5',
              },
              {
                title: '出参',
                dataIndex: 'd4',
              },
            ]}
            pagination={{
              pageSize: errorSize,
              current: errorIndex,
              total: errorTotal,
              onChange: (page, size) => {
                setErrorIndex(page);
                setErrorSize(size);
                void onSearchError(page, size);
              },
            }}
          />
        </TabPane>
        <TabPane tab="慢接口列表" key="2">
          <Table
            dataSource={timeOutData}
            bordered
            rowKey="url"
            columns={[
              {
                title: 'API',
                dataIndex: 'd1',
              },
              {
                title: '页面名称',
                dataIndex: 'url',
              },
              {
                title: 'TraceId',
                render: (value, record) => <span>{record.d3?.split('-')[1] || '-'}</span>,
              },
              {
                title: '入参',
                dataIndex: 'd5',
              },
              {
                title: '耗时',
                render: (value, record) => <span>{record.d3?.split('-')[0] || '-'}</span>,
              },
              {
                title: '上报时间',
                dataIndex: 'time',
              },
            ]}
            pagination={{
              pageSize: timeOutSize,
              current: timeOutIndex,
              total: timeOutTotal,
              onChange: (page, size) => {
                setTimeOutIndex(page);
                setTimeOutSize(size);
                void onSearchTimeOut(page, size);
              },
            }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default BasicApi;
