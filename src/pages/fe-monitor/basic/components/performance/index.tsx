import React, { useEffect, useState } from 'react';
import { Radio, Table } from 'antd';
import Header from '../header';
import PerformanceMarket from '../performance-market';
import { Line } from '@cffe/hulk-wave-chart';
import moment from 'moment';
import './index.less';
import { queryOverview } from '../server';

const now = [moment(moment().format('YYYY-MM-DD 00:00:00')), moment()];
const performanceItem = ['tti', 'ttfb', 'lcp', 'fcp', 'fid', 'root-paint']; // 性能项

const BasicPerformance = () => {
  const [timeList, setTimeList] = useState<any>(now);
  const [activeTab, setActiveTab] = useState<string>('tti');
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>([]); // 展开行key
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
      fieldMap: { x: ['日期'], y: ['PV', 'UV'] },
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
      ['日期', 'PV', 'UV'],
      ['北京', '100', '200'],
      ['北京1', '200', '300'],
      ['北京2', '800', '400'],
      ['北京3', '500', '500'],
      ['北京4', '700', '600'],
      ['北京5', '400', '800'],
      ['北京6', '300', '200'],
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
      </div>
    </div>
  );
};

export default BasicPerformance;
