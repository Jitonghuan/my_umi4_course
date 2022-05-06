import React, { useEffect, useState } from 'react';
import { Button, Table, Descriptions, Tooltip } from 'antd';
import Header from '../header';
import { now } from '../../const';
import { Line } from '@cffe/hulk-wave-chart';
import moment from 'moment';
import { getErrorChart, getErrorList, getPageErrorInfo } from '../server';
import { CloseOutlined } from '@ant-design/icons';
import './index.less';

interface IProps {
  appGroup: string;
}

interface DataSourceItem {
  id: number;
  url?: string;
  colSpan?: number;
  rowSpan?: number;
  d1?: string;
  count?: number;
}

const BasicError = ({ appGroup }: IProps) => {
  const [timeList, setTimeList] = useState<any>(now);
  const [chart, setChart] = useState<any>(null);
  const [total, setTotal] = useState<number>(0);
  const [dataSource, setDataSource] = useState<DataSourceItem[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>({});

  // 错误趋势图
  async function onErrorChart() {
    if (!chart) {
      return;
    }
    const res = await getErrorChart({
      appGroup,
      envCode: 'g3a-test',
      startTime: timeList[0] ? moment(timeList[0]).unix() : null,
      endTime: timeList[1] ? moment(timeList[1]).unix() : null,
    });
    const data = res?.data || [];

    let newData = [];
    if (data.jsErrorCount && data.userErrorCount) {
      newData.push(['日期', '错误数', '影响用户数']);
      let len = Math.max(data.jsErrorCount.length, data.userErrorCount.length) || 0;
      for (let i = 0; i < len; i++) {
        newData.push([
          data.jsErrorCount[i][0] || data.userErrorCount[i][0],
          data.jsErrorCount[i][1] || 0,
          data.userErrorCount[i][1] || 0,
        ]);
      }
    }
    chart.data(newData);
    chart.draw();
  }

  // 错误列表
  async function onErrorList() {
    const res = await getErrorList({
      appGroup,
      envCode: 'g3a-test',
      startTime: timeList[0] ? moment(timeList[0]).unix() : null,
      endTime: timeList[1] ? moment(timeList[1]).unix() : null,
    });
    const data = res?.data || [];
    const list: any = [];
    for (const item of data) {
      for (let i = 0; i < item[1].length; i++) {
        const suItem = item[1][i];
        list.push({
          id: (Math.random() * 1000000).toFixed(0),
          url: item[0],
          colSpan: i === 0 ? 1 : 0,
          rowSpan: i === 0 ? item[1].length : 1,
          d1: suItem[0],
          count: suItem[1],
        });
      }
    }
    setDataSource(list);
    setTotal(data.length);
    if (list.length && showDetail) {
      setSelectedRowKeys([list[0].id]);
      void getDetail(list[0]);
    } else {
      setSelectedRowKeys([]);
      setDetail({});
    }
  }

  async function getDetail(record: any) {
    const res = await getPageErrorInfo({
      appGroup,
      envCode: 'g3a-test',
      startTime: timeList[0] ? moment(timeList[0]).unix() : null,
      endTime: timeList[1] ? moment(timeList[1]).unix() : null,
      d1: record.d1,
      d2: record.url,
    });
    const data = res?.data || [];
    setDetail(data[0]?._source || {});
  }

  useEffect(() => {
    void onErrorList();
    void onErrorChart();
  }, [timeList, appGroup]);

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
        <div className="error-list-wrapper">
          <div className="list-title">错误列表</div>
          <div className="list-content">
            <div className="l">
              <Table
                dataSource={dataSource}
                bordered
                rowKey="id"
                pagination={{
                  total,
                }}
                onRow={(record) => {
                  return {
                    onClick: (event) => {
                      setSelectedRowKeys([record.id]);
                      setShowDetail(true);
                      void getDetail(record);
                    }, // 点击行
                  };
                }}
                rowClassName={(record) => (record.id === selectedRowKeys[0] ? 'row-active' : '')}
                columns={[
                  {
                    title: '错误文件',
                    dataIndex: 'url',
                    onCell: (record, index) => {
                      return { rowSpan: record.rowSpan, colSpan: record.colSpan };
                    },
                    ellipsis: {
                      showTitle: true,
                    },
                  },
                  {
                    title: '错误信息',
                    dataIndex: 'd1',
                    ellipsis: {
                      showTitle: true,
                    },
                  },
                  {
                    title: '次数',
                    dataIndex: 'count',
                    width: '80px',
                    align: 'right',
                  },
                  {
                    title: '操作',
                    width: '90px',
                    align: 'center',
                    render: (value, record) => <Button type="link">详情</Button>,
                  },
                ]}
              />
            </div>
            {showDetail && (
              <div className="r">
                <div className="close-btn" onClick={() => setShowDetail(false)}>
                  <CloseOutlined />
                </div>
                <div className="sub-title">错误信息</div>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="URL" span={2}>
                    {detail.url}
                  </Descriptions.Item>
                  <Descriptions.Item label="错误信息" span={2}>
                    {detail.d1}
                  </Descriptions.Item>
                  <Descriptions.Item label="错误文件" span={2}>
                    {detail.d2}
                  </Descriptions.Item>
                  <Descriptions.Item label="UA信息" span={2}>
                    {detail.ua}
                  </Descriptions.Item>
                  <Descriptions.Item label="dom路径" span={2}>
                    {detail.d5}
                  </Descriptions.Item>
                </Descriptions>
                <div className="sub-title">堆栈信息</div>
                <div style={{ wordBreak: 'break-all' }}>{detail.d4}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicError;
