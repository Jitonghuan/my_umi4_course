
import React, { useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { Card, Table, Input } from 'antd';
import moment from 'moment'
import { columnSchema } from './schema'
import { getCountDetail, getTrace } from './hook'
import DetailContext from '../../../context';
import { Line } from '@ant-design/charts';
import { history } from 'umi'


import './index.less'
export default function InstanceMonitor() {
  const { appCode, envCode, startTime, appId, deployName, count, isClick, podIps } = useContext(DetailContext);
  const [statisticsData, setStatisticsData] = useState<any>([])
  const [statisticsLoading, setStatisticsLoading] = useState<boolean>(false)
  const [traceLoading, setTraceLoading] = useState<boolean>(false)
  const [traceData, setTraceData] = useState<any>([])
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [nowSearchEndpoint, setNowSearchEndpoint] = useState<string>("")
  const config = {
    data: [
      {
        "Date": "2010-01",
        "scales": 1998
      },
      {
        "Date": "2010-02",
        "scales": 1850
      },
      {
        "Date": "2010-03",
        "scales": 1720
      },
      {
        "Date": "2010-04",
        "scales": 1818
      },
      {
        "Date": "2010-05",
        "scales": 1920
      },
      {
        "Date": "2010-06",
        "scales": 1802
      },
      {
        "Date": "2010-07",
        "scales": 1945
      },
      {
        "Date": "2010-08",
        "scales": 1856
      },
      {
        "Date": "2010-09",
        "scales": 2107
      },
      {
        "Date": "2010-10",
        "scales": 2140
      },
      {
        "Date": "2010-11",
        "scales": 2311
      },
    ],
    padding: 'auto',
    xField: 'Date',
    yField: 'scales',
    xAxis: {
      tickCount: 0
    },
    yAxis: false,
  };

  const tableColumns = useMemo(() => {
    return columnSchema()
  }, [appId, envCode])
  useEffect(() => {
    //if (!envCode || !startTime || !appId || !deployName) return
    if (isClick && isClick === appCode) {
      getCountDetailTable(true)
    } else {
      getCountDetailTable(false)
    }
  }, [envCode, startTime, deployName, appId, count, isClick])
  useEffect(() => {
    getTraceTable()
  }, [startTime, appId, count])
  const getCountDetailTable = (isTotal?: boolean) => {
    setStatisticsLoading(true)
    const now = new Date().getTime();
    //@ts-ignore
    getCountDetail({
      envCode: envCode || "",
      deployName,
      appId,
      isTotal,
      podIps,
      //@ts-ignore
      start: moment(new Date(Number(now - startTime))).format('YYYY-MM-DD HH:mm:ss'),
      //@ts-ignore
      end: moment(new Date(Number(now))).format('YYYY-MM-DD HH:mm:ss'),
    }).then((resp) => {
      setStatisticsData(resp || [])
    }).finally(() => {
      setStatisticsLoading(false)
    })
  }

  const getTraceTable = (info?: { endpoint?: string, pageIndex?: number, pageSize?: number }) => {
    setTraceLoading(true)
    const now = new Date().getTime();
    //@ts-ignore
    getTrace({
      envCode,
      endpoint: info?.endpoint,
      pageIndex: info?.pageIndex,
      pageSize: info?.pageSize,
      appId,
      //@ts-ignore
      start: moment(new Date(Number(now - startTime))).format('YYYY-MM-DD HH:mm:ss'),
      //@ts-ignore
      end: moment(new Date(Number(now))).format('YYYY-MM-DD HH:mm:ss'),
    }).then((resp) => {
      setTraceData(resp?.dataSource)
      setTotal(resp?.pageInfo?.total);
      setPageIndex(resp?.pageInfo?.pageIndex);
      setPageSize(resp?.pageInfo?.pageSize)
    }).finally(() => {
      setTraceLoading(false)
    })
  }


  const pageSizeClick = (pagination: any) => {
    setPageIndex(pagination.current);
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    getTraceTable({ ...obj, endpoint: nowSearchEndpoint })
  };

  const mockData = [{}, {}, {}, {}, {}]
  const [chartHeight, setChartHeight] = useState();
  const chartRef = useCallback((node: any) => {
    if (node) {
      setChartHeight(node.clientHeight)
      new ResizeObserver(() => {
        setChartHeight(node.clientHeight)
      }).observe(node)
    }
  },
    [],
  )
  return (
    <>
      <div className="call-info-body">
        <div className='item-wrapper'>
          {mockData.map((item, index) => {
            return (
              <div className='call-item'>
                <div className='title flex-space-between'>
                  <div>{index + 1}.我是一张表</div>
                  <a>查看链路追踪</a>
                </div>
                <div className='main'>
                  <div className='call-item-line' >
                    <div className="chart-header"></div>
                    <div className="chart-container-warpper" ref={chartRef}>
                      {chartHeight && <Line className="chart-container" {...config} height={chartHeight} />}
                    </div>

                  </div>
                  <Table
                    size="small"
                    bordered
                    loading={traceLoading}
                    dataSource={[{ id: 0.3 }, { id: 0.3 }, { id: 0.3 }, { id: 0.3 }, { id: 0.3 }]}
                    columns={tableColumns}
                    scroll={{ x: '100%' }}
                    pagination={
                      false
                    }
                    onChange={pageSizeClick}

                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}