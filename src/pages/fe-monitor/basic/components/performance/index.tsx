import React, { useEffect, useState } from 'react';
import { Radio, Table, Tabs } from 'antd';
import Header from '../header';
import PerformanceMarket from '../performance-market';
import { Line } from '@cffe/hulk-wave-chart';
import moment from 'moment';
import './index.less';
import { queryOverview } from '../server';

const { TabPane } = Tabs;

const now = [moment(moment().format('YYYY-MM-DD 00:00:00')), moment()];
const performanceItem = ['tti', 'ttfb', 'lcp', 'fcp', 'fid', 'root-paint']; // 性能项
const pageItem = [
  {
    name: '高频页面',
  },
  {
    name: '访问速度排行',
  },
];

const groupItem = [
  {
    name: '页面异常（5）',
    desc: '载入时长>20s (5)',
  },
  {
    name: '非常慢（12）',
    desc: '20s≥载入时长>10s (5)',
  },
  {
    name: '较慢（12）',
    desc: '10s≥载入时长>5s (5)',
  },
  {
    name: '正常（12）',
    desc: '5s≥载入时长>2s (5)',
  },
  {
    name: '较快（12）',
    desc: '2s≥载入时长>1s (5)',
  },
  {
    name: '快如闪电（12）',
    desc: '1s≥载入时长 (10)',
  },
];

const BasicPerformance = () => {
  const [timeList, setTimeList] = useState<any>(now);
  const [activeTab, setActiveTab] = useState<string>('tti');
  const [pageTab, setPageTab] = useState<number>(0);
  const [groupTab, setGroupTab] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>([]); // 展开行key
  const [groupExpandedRowKeys, setGroupExpandedRowKeys] = useState<any[]>([]); // 展开行key
  const [dataSource, setDataSource] = useState<any[]>([
    {
      url: 'www.baidu.com',
      tti: '10s',
      pv: '4',
    },
    {
      url: 'www.baidu',
      tti: '10s',
      pv: '4',
    },
  ]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [groupExpanded, setGroupExpanded] = useState<boolean>(false);

  async function onSearch(page?: number, size?: number) {
    const res = await queryOverview({
      startTime: timeList[0] ? moment(timeList[0]).format('YYYY-MM-DD HH:mm:ss') : null,
      endTime: timeList[1] ? moment(timeList[1]).format('YYYY-MM-DD HH:mm:ss') : null,
      pageIndex,
      pageSize,
    });
    // setTotal(res?.data.total);
  }

  useEffect(() => {
    void onSearch();
  }, [timeList]);

  useEffect(() => {
    const chart = new Line({
      dom: document.querySelector('.line-chart'),
      fieldMap: { x: ['日期'], y: ['耗时'] },
      layout: {
        padding: [80, 40, 40, 40],
      },
      title: {
        isShow: false,
      },
      secondTitle: {
        isShow: false,
      },
      yAxis: {
        name: '',
      },
      line: {
        isCustomColor: true,
        customColor: ['#4BA2FFFF', '#54DA81FF'],
      },
      tooltip: {
        isShow: true,
      },
    });
    chart.data([
      ['日期', '耗时'],
      ['日期1', '100'],
      ['日期2', '200'],
      ['日期3', '500'],
      ['日期4', '700'],
      ['日期5', '400'],
      ['日期6', '300'],
    ]);
    chart.draw();
  }, []);

  return (
    <div className="basic-performance-wrapper">
      <Header onChange={setTimeList} defaultTime={timeList} />
      <div className="performance-wrapper">
        <div className="group-performance">
          <Radio.Group value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
            {performanceItem.map((item) => (
              <Radio.Button key={item} value={item}>
                {item}
              </Radio.Button>
            ))}
          </Radio.Group>
          <div className="line-chart"></div>
        </div>
        <div className="group-performance">
          <Radio.Group value={pageTab} onChange={(e) => setPageTab(e.target.value)}>
            {pageItem.map((item, i) => (
              <Radio.Button key={i} value={i}>
                {item.name}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
        <div className="page-performance">
          <Table
            rowKey="url"
            columns={[
              {
                title: '页面名称',
                dataIndex: 'url',
              },
              {
                title: '平均载入时长',
                dataIndex: 'tti',
              },
              {
                title: 'PV',
                dataIndex: 'pv',
              },
            ]}
            pagination={{
              pageSize,
              current: pageIndex,
              total,
              onChange: (page, size) => {
                setPageIndex(page);
                setPageSize(size);
                void onSearch(page, size);
              },
            }}
            dataSource={dataSource}
            expandable={{
              expandRowByClick: true,
              expandedRowKeys,
              onExpand: (expanded, record) => {
                setExpanded(expanded);
                if (expanded) {
                  setExpandedRowKeys([record?.url]);
                } else {
                  setExpandedRowKeys([]);
                }
              },
              expandedRowRender: () => (expanded ? <PerformanceMarket /> : null),
            }}
          />
        </div>
        <div className="group-performance">
          <Radio.Group value={groupTab} onChange={(e) => setGroupTab(e.target.value)}>
            {groupItem.map((item, i) => (
              <Radio.Button key={i} value={i}>
                {item.desc}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
        <div className="page-performance">
          <Table
            rowKey="url"
            columns={[
              {
                title: '页面名称',
                dataIndex: 'url',
              },
              {
                title: '平均载入时长',
                dataIndex: 'tti',
              },
              {
                title: 'PV',
                dataIndex: 'pv',
              },
            ]}
            pagination={{
              pageSize,
              current: pageIndex,
              total,
              onChange: (page, size) => {
                setPageIndex(page);
                setPageSize(size);
                void onSearch(page, size);
              },
            }}
            dataSource={dataSource}
            expandable={{
              expandRowByClick: true,
              groupExpandedRowKeys,
              onExpand: (expanded, record) => {
                setGroupExpanded(expanded);
                if (expanded) {
                  setGroupExpandedRowKeys([record?.url]);
                } else {
                  setGroupExpandedRowKeys([]);
                }
              },
              expandedRowRender: () => (groupExpanded ? <PerformanceMarket /> : null),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicPerformance;
