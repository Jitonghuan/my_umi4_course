import React, { useEffect, useState } from 'react';
import { Tabs, Table, Tooltip, Input } from 'antd';
import Header from '../header';
import { now } from '../../const';
import moment from 'moment';
import './index.less';
import { getErrorApiList, getSlowApiList } from '../../server';

const { TabPane } = Tabs;

interface IProps {
  appGroup: string;
  envCode: string;
  feEnv: string;
}

const BasicApi = ({ appGroup, envCode, feEnv }: IProps) => {
  const [timeList, setTimeList] = useState<any>(now);
  const [active, setActive] = useState('1');

  // 失败
  const [errorTotal, setErrorTotal] = useState<number>(0);
  const [errorData, setErrorData] = useState<any[]>([]);
  const [errorLoading, setErrorLoading] = useState<boolean>(false);

  // 超时
  const [timeOutTotal, setTimeOutTotal] = useState<number>(0);
  const [timeOutData, setTimeOutData] = useState<any[]>([]);
  const [timeOutLoading, setTimeOutLoading] = useState<boolean>(false);

  function getParam(extra = {}) {
    let param: any = {
      feEnv,
      envCode,
      startTime: timeList[0] ? moment(timeList[0]).unix() : null,
      endTime: timeList[1] ? moment(timeList[1]).unix() : null,
      ...extra,
    };
    if (appGroup) {
      param = {
        ...param,
        appGroup,
      };
    }
    return param;
  }

  async function onSearchError() {
    if (errorLoading) {
      return;
    }
    setErrorLoading(true);
    const res = await getErrorApiList(getParam());
    setErrorData(res?.data || []);
    setErrorTotal(res?.data?.length || 0);
    setErrorLoading(false);
  }

  async function onSearchTimeOut() {
    if (timeOutLoading) {
      return;
    }
    setTimeOutLoading(true);
    const res = await getSlowApiList(getParam());
    setTimeOutData(res?.data || []);
    setTimeOutTotal(res?.data?.length || 0);
    setTimeOutLoading(false);
  }

  useEffect(() => {
    if (active === '1') {
      void onSearchError();
    } else {
      void onSearchTimeOut();
    }
  }, [timeList, appGroup, feEnv]);

  return (
    <div className="basic-api-wrapper">
      <Header onChange={setTimeList} defaultTime={timeList} />
      <Tabs
        activeKey={active}
        onChange={(val) => {
          setActive(val);
          if (val === '1') {
            void onSearchError();
          } else {
            void onSearchTimeOut();
          }
        }}
      >
        <TabPane tab="API失败接口" key="1">
          <Table
            dataSource={errorData}
            bordered
            rowKey="ts"
            scroll={{ x: '100%' }}
            loading={errorLoading}
            columns={[
              {
                title: 'API',
                dataIndex: 'd1',
                width: '300px',
                ellipsis: {
                  showTitle: false,
                },
                render: (text) => <Input bordered={false} disabled value={text}></Input>,
              },
              {
                title: 'TraceId',
                width: '350px',
                render: (value, record) => <span>{record.d3?.split('-')[1] || '-'}</span>,
              },
              {
                title: '入参',
                dataIndex: 'd5',
                width: '400px',
                ellipsis: {
                  showTitle: false,
                },
                render: (text) => <Input bordered={false} disabled value={text}></Input>,
              },
              {
                title: '出参',
                dataIndex: 'd4',
                width: '350px',
                ellipsis: {
                  showTitle: false,
                },
                render: (text) => <Input bordered={false} disabled value={text}></Input>,
              },
              {
                title: '耗时(秒)',
                width: '100px',
                align: 'right',
                render: (value, record) => <span>{(record.timing / 1000).toFixed(2) || 0}</span>,
              },
              {
                title: '页面名称',
                dataIndex: 'url',
                width: '250px',
                render: (text) => <Input bordered={false} disabled value={text}></Input>,
              },
              {
                title: '上报时间',
                width: '180px',
                render: (value, record) => (
                  <span>{moment(Number(record.ts)).format('YYYY-MM-DD HH:mm:ss') || '-'}</span>
                ),
              },
            ]}
            pagination={{
              total: errorTotal,
            }}
          />
        </TabPane>
        <TabPane tab="慢接口列表" key="2">
          <Table
            dataSource={timeOutData}
            bordered
            scroll={{ x: '100%' }}
            rowKey="ts"
            loading={timeOutLoading}
            columns={[
              {
                title: 'API',
                dataIndex: 'd1',
                width: '300px',
                ellipsis: {
                  showTitle: false,
                },
                render: (text) => <Input bordered={false} disabled value={text}></Input>,
              },
              {
                title: '页面',
                dataIndex: 'url',
                width: '250px',
                ellipsis: {
                  showTitle: false,
                },
                render: (text) => <Input bordered={false} disabled value={text}></Input>,
              },
              {
                title: 'TraceId',
                width: '250px',
                render: (value, record) => <span>{record.d3?.split('-')[1] || '-'}</span>,
              },
              {
                title: '耗时(秒)',
                width: '100px',
                align: 'right',
                dataIndex: 'timing',
                render: (value, record) => <span>{(record.timing / 1000).toFixed(2) || 0}</span>,
              },
              {
                title: '上报时间',
                width: '180px',
                render: (value, record) => (
                  <span>{moment(Number(record.ts)).format('YYYY-MM-DD HH:mm:ss') || '-'}</span>
                ),
              },
              {
                title: '入参',
                dataIndex: 'd5',
                width: '400px',
                ellipsis: {
                  showTitle: false,
                },
                render: (text) => <Input bordered={false} disabled value={text}></Input>,
              },
            ]}
            pagination={{
              total: timeOutTotal,
            }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default BasicApi;
