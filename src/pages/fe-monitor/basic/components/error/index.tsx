import React, { useEffect, useState } from 'react';
import Header from '../header';
import { now } from '../../const';
import { Line } from '@cffe/hulk-wave-chart';
import moment from 'moment';
import { getErrorChart, getErrorList } from '../../server';
import ErrorTable from './components/errortable';
import ResourceErrorTable from './components/resource-error-table';

import { Button, Form, Input, Tabs } from '@cffe/h2o-design';
import './index.less';

interface IProps {
  appGroup: string;
  envCode: string;
  feEnv: string;
}

interface DataSourceItem {
  id: number;
  url?: string;
  colSpan?: number;
  rowSpan?: number;
  d1?: string;
  count?: number;
  len: number;
  i: number;
}

const BasicError = ({ appGroup, envCode, feEnv }: IProps) => {
  const [timeList, setTimeList] = useState<any>(now);
  const [chart, setChart] = useState<any>(null);
  const [total, setTotal] = useState<number>(0);
  const [dataSource, setDataSource] = useState<DataSourceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [importantErrorList, setImportantErrorList] = useState<DataSourceItem[]>([]);
  const [importantErrorLoading, setImportantErrorLoading] = useState<boolean>(false);
  const [importantErrorTotal, setImportantErrorTotal] = useState<number>(0);



  const [activeKey, setActiveKey] = useState<string>("1");

  function getParam(extra = {}) {
    let param: any = {
      envCode,
      feEnv,
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

  // 错误趋势图
  async function onErrorChart() {
    if (!chart) {
      return;
    }
    const res = await getErrorChart(getParam());
    const data: any = res?.data || {};

    let newData = [];
    if (data.jsErrorCount && data.userErrorCount) {
      newData.push(['日期', '错误数', '影响用户数']);

      let arrTimes: any[] = [];
      for (const item of data.jsErrorCount) {
        if (!arrTimes.find((val) => val === item[0])) {
          arrTimes.push(item[0]);
        }
      }

      for (const item of data.userErrorCount) {
        if (!arrTimes.find((val) => val === item[0])) {
          arrTimes.push(item[0]);
        }
      }

      for (let i = 0; i < arrTimes.length; i++) {
        let jsError = data.jsErrorCount.find((val: any) => val[0] === arrTimes[i]);
        let userError = data.userErrorCount.find((val: any) => val[0] === arrTimes[i]);
        newData.push([
          moment(arrTimes[i]).format('YYYY-MM-DD HH:mm'),
          jsError ? jsError[1] : 0,
          userError ? userError[1] : 0,
        ]);
      }
    }
    chart.data(newData);
    chart.draw();
  }

  // 错误列表
  async function onErrorList() {
    if (loading) {
      return;
    }
    setLoading(true);
    const res = await getErrorList(getParam());
    const data = res?.data || [];
    const list: any = [];
    for (const item of data) {
      for (let i = 0; i < item[1].length; i++) {
        const suItem = item[1][i];
        list.push({
          id: (Math.random() * 1000000).toFixed(0),
          url: item[0],
          colSpan: i === 0 ? 1 : 0,
          i,
          len: item[1].length,
          rowSpan: i === 0 ? item[1].length : 1,
          d1: suItem[0],
          count: suItem[1],
        });
      }
    }
    setDataSource(list);
    setTotal(data.length);
    setLoading(false);
  }

  // 错误列表
  async function onImportantErrorList() {
    if (loading) {
      return;
    }
    setImportantErrorLoading(true);
    const res = await getErrorList(getParam());
    const data = res?.data || [];
    const list: any = [];
    for (const item of data) {
      for (let i = 0; i < item[1].length; i++) {
        const suItem = item[1][i];
        list.push({
          id: (Math.random() * 1000000).toFixed(0),
          url: item[0],
          colSpan: i === 0 ? 1 : 0,
          i,
          len: item[1].length,
          rowSpan: i === 0 ? item[1].length : 1,
          d1: suItem[0],
          count: suItem[1],
        });
      }
    }
    setImportantErrorList(list);
    setImportantErrorTotal(data.length);
    setImportantErrorLoading(false);
  }


  useEffect(() => {
    void onErrorList();
    void onErrorChart();
  }, [timeList, appGroup, feEnv]);

  useEffect(() => {
    void onImportantErrorList();
  }, [timeList, appGroup, feEnv, activeKey]);

  useEffect(() => {
    setChart(
      new Line({
        dom: document.querySelector('.error-chart'),
        fieldMap: { x: ['日期'], y: ['错误数', '影响用户数'] },
        layout: {
          padding: [80, 40, 40, 40],
        },
        title: {
          isShow: false,
        },
        secondTitle: {
          isShow: false,
        },
        xAxis: {
          labelInterval: 2,
        },
        yAxis: {
          name: '个',
        },
        line: {
          isCustomColor: true,
          customColor: ['#4BA2FF', '#FFCB30'],
        },
        tooltip: {
          isShow: true,
        },
      }),
    );
  }, []);

  useEffect(() => {
    void onErrorChart();
  }, [chart]);

  return (
    <div className="basic-error-wrapper">
      <Header defaultTime={timeList} onChange={setTimeList} />
      <div className="performance-wrapper">
        <div className="list-title chart-title">错误情况</div>
        <div className="line-chart-wrapper">
          <div className="error-chart"></div>
        </div>
        <div className='important-error'>
          <div className="list-title">重点关注的错误</div>
          <Tabs
            className='error-tabs'
            activeKey={activeKey}
            destroyInactiveTabPane
            onChange={(val) => {
              setActiveKey(val);
            }}
          >
            <Tabs.TabPane tab="组件加载错误" key="1" />
            {/* <Tabs.TabPane tab="定制包加载错误" key="2" /> */}
            <Tabs.TabPane tab="页面重点资源加载错误" key="3" />
            <Tabs.TabPane tab="定制包资源加载错误" key="4" />
          </Tabs>
          {
            activeKey == '1' ?
              <ErrorTable dataSource={importantErrorList} loading={importantErrorLoading} total={importantErrorTotal} getParam={getParam} />
            :
              <ResourceErrorTable dataSource={importantErrorList} loading={importantErrorLoading} total={importantErrorTotal} getParam={getParam} />
          }
        </div>
        <div>
          <div className="list-title">错误列表</div>
          <Form layout="inline">
            <Form.Item>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type='primary'>查询</Button>
            </Form.Item>
          </Form>
          <ErrorTable dataSource={dataSource} loading={loading} total={total} getParam={getParam} />
        </div>
      </div>
    </div>
  );
};

export default BasicError;
