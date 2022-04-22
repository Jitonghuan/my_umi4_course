import React, { useEffect, useState } from 'react';
import { Button, Table, Descriptions } from 'antd';
import Header from '../header';
import { now } from '../../const';
import { LineColumn } from '@cffe/hulk-wave-chart';
import { queryErrorList } from '../server';
import { CloseOutlined } from '@ant-design/icons';
import './index.less';

interface IProps {
  appGroup: string;
}

interface DataSourceItem {
  url: string;
  errRate?: string;
  uvRate?: string;
  ua?: string;
  t1?: string;
  t2?: string;
  t3?: string;
  d1?: string;
  d2?: string;
  d3?: string;
  d4?: string;
  d5?: string;
}

const defaultData = [
  {
    url: 'www.baiddu',
    errRate: '10%',
    uvRate: '10%',
  },
  {
    url: 'www.baiddu.com',
    errRate: '10%',
    uvRate: '10%',
  },
  {
    url: 'www',
    errRate: '10%',
    uvRate: '10%',
  },
  {
    url: 'baiddu.com',
    errRate: '10%',
    uvRate: '10%',
  },
  {
    url: 'baiddu',
    errRate: '10%',
    uvRate: '10%',
  },
  {
    url: 'www.com',
    errRate: '10%',
    uvRate: '10%',
  },
];

const BasicError = ({ appGroup }: IProps) => {
  const [timeList, setTimeList] = useState<any>(now);
  const [total, setTotal] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [dataSource, setDataSource] = useState<DataSourceItem[]>(defaultData);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [showDetail, setShowDetail] = useState<boolean>(true);
  const [activeRecord, setActiveRecord] = useState<DataSourceItem>({
    url: 'www.baiddu.com',
    errRate: '10%',
    uvRate: '10%',
  });

  async function onSearch(page?: number, size?: number) {
    const res = await queryErrorList({
      appGroup,
      pageSize: size || pageSize,
      pageNum: page || pageIndex,
    });
  }

  useEffect(() => {
    void onSearch();
  }, [timeList, appGroup]);

  useEffect(() => {
    const chart = new LineColumn({
      dom: document.querySelector('.error-chart'),
      fieldMap: { x: ['日期'], y: ['错误数', '影响用户数'], 'y-right': ['错误率', '影响用户率'] },
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
      yAxisRight: {
        name: '%',
      },
      line: {
        isCustomColor: true,
        isShowLable: false,
        customColor: ['#4BA2FF', '#FFCB30'],
      },
      bar: {
        isCustomColor: true,
        isShowLable: false,
        customColor: ['#54DA81', '#657CA6'],
      },
      tooltip: {
        isShow: true,
      },
    });
    chart.data([
      ['日期', '错误数', '影响用户数', '错误率', '影响用户率'],
      ['03/01', '100', '200', '10', '20'],
      ['03/02', '200', '300', '20', '30'],
      ['03/03', '800', '400', '30', '40'],
      ['03/04', '500', '500', '40', '50'],
      ['03/05', '700', '600', '50', '60'],
      ['03/06', '400', '800', '60', '70'],
      ['03/07', '300', '200', '70', '80'],
    ]);
    chart.draw();
  }, []);

  return (
    <div className="basic-error-wrapper">
      <Header defaultTime={timeList} onChange={setTimeList} />
      <div className="performance-wrapper">
        <div className="line-chart-wrapper">
          <div className="chart-title">错误情况</div>
          <div className="error-chart"></div>
        </div>
        <div className="error-list-wrapper">
          <div className="list-title">页面错误率排行</div>
          <div className="list-content">
            <div className="l">
              <Table
                dataSource={dataSource}
                bordered
                rowKey="url"
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
                onRow={(record) => {
                  return {
                    onClick: (event) => {
                      setSelectedRowKeys([record.url]);
                      setActiveRecord(record);
                      setShowDetail(true);
                    }, // 点击行
                  };
                }}
                rowSelection={{
                  columnTitle: '页面',
                  type: 'radio',
                  selectedRowKeys,
                  onChange: setSelectedRowKeys,
                  renderCell: (value, record) => <span>{record.url}</span>,
                }}
                columns={[
                  {
                    title: '错误率',
                    dataIndex: 'errRate',
                  },
                  {
                    title: '访问量',
                    dataIndex: 'uvRate',
                  },
                  {
                    title: '操作',
                    render: (value, record) => <Button type="link">详情</Button>,
                  },
                ]}
              />
            </div>
            {showDetail && (
              <div className="r">
                <div className="r-title">{activeRecord.url}</div>
                <div className="close-btn" onClick={() => setShowDetail(false)}>
                  <CloseOutlined />
                </div>
                <div className="sub-title">错误信息</div>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="名称">{activeRecord.t2}</Descriptions.Item>
                  <Descriptions.Item label="类型">{activeRecord.t3}</Descriptions.Item>
                  <Descriptions.Item label="错误信息">{activeRecord.d1}</Descriptions.Item>
                  <Descriptions.Item label="行列号">{activeRecord.d3}</Descriptions.Item>
                  <Descriptions.Item label="UA信息" span={2}>
                    {activeRecord.ua}
                  </Descriptions.Item>
                  <Descriptions.Item label="错误文件" span={2}>
                    {activeRecord.d2}
                  </Descriptions.Item>
                </Descriptions>
                <div className="sub-title">堆栈信息</div>
                <div>{activeRecord.d4}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicError;
