import React, { useEffect, useState } from 'react';
import { Radio, Table, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Line } from '@cffe/hulk-wave-chart';
import Header from '../header';
import PerformanceMarket from '../performance-market';
import { now, groupItem, performanceItem } from '../../const';
import { getPerformanceChart, getPageList } from '../../server';
import moment from 'moment';
import './index.less';

interface IProps {
  timeList: any;
  appGroup: string;
  envCode: string;
  feEnv: string;
}

const pageItem = [
  {
    name: '高频页面',
    key: 'highFrequency',
  },
  {
    name: '访问速度',
    key: 'visitSpeed',
  },
];

const BasicPerformance = ({ appGroup, envCode, feEnv, timeList }: IProps) => {
  const [chart, setChart] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('tti'); // 趋势图tab
  const [pageGroupTab, setPageGroupTab] = useState<string>('highFrequency'); // 页面排行tab
  const [timeGroupTab, setTimeGroupTab] = useState<string>('20'); // 加载时间区间tab

  // 页面排行
  const [total, setTotal] = useState<number>(0);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>([]); // 展开行key
  const [expanded, setExpanded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // 加载区间
  const [groupTotal, setGroupTotal] = useState<number>(0);
  const [groupData, setGroupData] = useState<any[]>([]);
  const [groupRowKeys, setGroupRowKeys] = useState<any[]>([]); // 展开行key
  const [groupExpanded, setGroupExpanded] = useState<boolean>(false);
  const [groupLoading, setGroupLoading] = useState<boolean>(false);

  function getParam(extra = {}) {
    let param: any = {
      envCode,
      startTime: timeList[0] ? moment(timeList[0]).unix() : null,
      endTime: timeList[1] ? moment(timeList[1]).unix() : null,
      feEnv,
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

  // 汇总性能趋势图
  async function performanceChart(tab?: string) {
    if (!chart) {
      return;
    }
    const indicatorName = tab || activeTab;
    const res = await getPerformanceChart(
      getParam({
        indicatorName,
      }),
    );

    const data = res?.data || [];
    if (data.length) {
      for (const item of data) {
        item[0] = moment(item[0]).format('YYYY-MM-DD HH:mm');
        item[1] = item[1].toFixed(2);
      }
      data.unshift(['日期', '毫秒']);
    }
    chart.data(data);
    chart.draw();
  }

  // 页面排行榜
  async function pageList(tab?: string) {
    if (loading) {
      return;
    }
    setLoading(true);
    const res = await getPageList(
      getParam({
        filterType: tab || pageGroupTab,
      }),
    );
    setDataSource(res?.data || []);
    setTotal(res?.data?.length || 0);
    setLoading(false);
  }

  // 页面tti加载区间
  async function timeGroupList(tab?: string) {
    if (groupLoading) {
      return;
    }
    setGroupLoading(true);
    const res = await getPageList(
      getParam({
        loadTimeRange: tab || timeGroupTab,
        filterType: 'loadSpeed',
      }),
    );
    setGroupData(res?.data || []);
    setGroupTotal(res?.data?.length || 0);
    setGroupLoading(false);
  }

  useEffect(() => {
    setExpanded(false);
    setExpandedRowKeys([]);
    setGroupExpanded(false);
    setGroupRowKeys([]);
    void performanceChart();
    void pageList();
    void timeGroupList();
  }, [timeList, appGroup, feEnv]);

  useEffect(() => {
    setChart(
      new Line({
        dom: document.querySelector('.performance-chart'),
        fieldMap: { x: ['日期'], y: ['毫秒'] },
        layout: {
          padding: [40, 40, 40, 65],
        },
        title: {
          isShow: false,
        },
        secondTitle: {
          isShow: false,
        },
        yAxis: {
          name: ' ',
        },
        xAxis: {
          labelInterval: 2,
        },
        line: {
          isCustomColor: true,
          customColor: ['#4BA2FFFF', '#54DA81FF'],
        },
        tooltip: {
          isShow: true,
        },
      }),
    );
  }, []);

  useEffect(() => {
    void performanceChart();
  }, [chart]);

  return (
    <div className="basic-performance-wrapper">
      {/*页面汇总趋势图*/}
      <div className="performance-wrapper">
        <div className="group-performance">
          <Radio.Group
            value={activeTab}
            onChange={(e) => {
              setActiveTab(e.target.value);
              void performanceChart(e.target.value);
            }}
          >
            {performanceItem.map((item) => (
              <Radio.Button key={item.name} value={item.name}>
                <Tooltip placement="topLeft" title={item.desc}>
                  {item.name}
                  <QuestionCircleOutlined style={{ marginLeft: '4px', fontSize: '14px' }} />
                </Tooltip>
              </Radio.Button>
            ))}
          </Radio.Group>
          <div className="performance-chart"></div>
        </div>

        {/*页面性能列表*/}
        <div className="group-performance">
          <Radio.Group
            value={pageGroupTab}
            onChange={(e) => {
              setPageGroupTab(e.target.value);
              setExpanded(false);
              setExpandedRowKeys([]);
              void pageList(e.target.value);
            }}
          >
            {pageItem.map((item) => (
              <Radio.Button key={item.key} value={item.key}>
                {item.name}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
        <div className="page-performance">
          <Table
            rowKey="url"
            loading={loading}
            columns={[
              {
                title: '页面',
                dataIndex: 'url',
              },
              {
                title: pageGroupTab === 'highFrequency' ? 'PV' : '平均载入时长(秒)',
                render: (value, record) => (
                  <span>
                    {pageGroupTab === 'highFrequency' ? record.pv : (record.avgLoadTime / 1000).toFixed(2) || 0}
                  </span>
                ),
              },
              {
                title: pageGroupTab === 'highFrequency' ? 'UV' : '',
                dataIndex: 'uv',
              },
            ]}
            pagination={{
              total,
            }}
            dataSource={dataSource}
            expandable={{
              expandRowByClick: true,
              expandedRowKeys,
              onExpand: (expanded, record) => {
                setGroupExpanded(false);
                setGroupRowKeys([]);
                if (expanded) {
                  setExpandedRowKeys([record?.url]);
                } else {
                  setExpandedRowKeys([]);
                }
                setExpanded(expanded);
              },
              expandedRowRender: (record) =>
                expanded && record.url === expandedRowKeys[0] ? (
                  <PerformanceMarket url={expandedRowKeys[0]} param={getParam()} />
                ) : null,
            }}
          />
        </div>

        {/*页面加载区间分布*/}
        <div className="group-performance">
          <Radio.Group
            value={timeGroupTab}
            onChange={(e) => {
              setTimeGroupTab(e.target.value);
              setGroupExpanded(false);
              setGroupRowKeys([]);
              void timeGroupList(e.target.value);
            }}
          >
            {groupItem.map((item) => (
              <Radio.Button key={item.key} value={item.key}>
                {item.name}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
        <div className="page-performance">
          <Table
            rowKey="url"
            loading={groupLoading}
            columns={[
              {
                title: '页面名称',
                dataIndex: 'url',
              },
              {
                title: '平均载入时长(秒)',
                dataIndex: 'avgLoadTime',
                render: (value, record) => <span>{(value / 1000).toFixed(2) || 0}</span>,
              },
            ]}
            pagination={{
              total: groupTotal,
            }}
            dataSource={groupData}
            expandable={{
              expandRowByClick: true,
              expandedRowKeys: groupRowKeys,
              onExpand: (expanded, record) => {
                setGroupExpanded(expanded);
                setExpanded(false);
                setExpandedRowKeys([]);
                if (expanded) {
                  setGroupRowKeys([record?.url]);
                } else {
                  setGroupRowKeys([]);
                }
              },
              expandedRowRender: (record) =>
                groupExpanded && record.url === groupRowKeys[0] ? (
                  <PerformanceMarket url={groupRowKeys[0]} param={getParam()} />
                ) : null,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicPerformance;
