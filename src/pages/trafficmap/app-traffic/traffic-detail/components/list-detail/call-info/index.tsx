
import React, { useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { Card, Table, Pagination, Tooltip } from 'antd';
import moment from 'moment'
import { columnSchema, mock } from './schema'
import { getCountDetail, getTrace } from './hook'
import DetailContext from '../../../context';
import { Line } from '@ant-design/charts';
import { history } from 'umi';
import ChartModal from './chart-modal';
import CardLayout from '@cffe/vc-b-card-layout';
import './index.less'
export default function InstanceMonitor() {
  const { appCode, envCode, startTime, appId, deployName, count, isClick, podIps, endTime, selectTimeType } = useContext(DetailContext);
  const [traceLoading, setTraceLoading] = useState<boolean>(false)
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [data, setData] = useState<any>(mock);//初始拿到的所有数据
  const [loading, setLoading] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any>({});
  const [rowCount, setRowCount] = useState(0);

  const pageData = useMemo(() => data.slice((pageIndex - 1) * pageSize, pageIndex * pageSize), [data, pageSize, pageIndex]);

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
  }, [envCode, startTime, deployName, appId, count, isClick, endTime, selectTimeType])

  const getCountDetailTable = (isTotal?: boolean) => {
    const now = new Date().getTime();
    let start = 0, end = 0;
    if (selectTimeType === 'lastTime') {
      //@ts-ignore
      start = Number((now - startTime) / 1000);
      end = Number(now / 1000);
    } else {
      //@ts-ignore
      start = startTime;
      end = Number(endTime);
    }
    console.log(new Date(Number(start) * 1000).toLocaleString(), '-', new Date(Number(end) * 1000).toLocaleString(), '应用调用')
    //@ts-ignore
    setLoading(true)
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
    }).then((res) => {
      let newArr = [];
      newArr = data.map((item: any) => {
        item.dataSource = [];

        item.endpointCPM.readMetricsValues.forEach((val: any) => {
          let curT = item.dataSource.find((i: any) => i.time === val.time);
          if (!curT) {
            curT = { cpm: val.value, time: val.time }
            item.dataSource.push(curT);
          } else {
            Object.assign(curT, { cpm: val.value })
          }
        });
        item.endpointAvg.readMetricsValues.forEach((val: any) => {
          let curT = item.dataSource.find((i: any) => i.time === val.time);
          if (!curT) {
            curT = { avg: val.value, time: val.time }
            item.dataSource.push(curT);
          } else {
            Object.assign(curT, { avg: val.value })
          }
        });
        item.endpointSR.readMetricsValues.forEach((val: any) => {
          let curT = item.dataSource.find((i: any) => i.time === val.time);
          if (!curT) {
            curT = { sr: val.value, time: val.time }
            item.dataSource.push(curT);
          } else {
            Object.assign(curT, { sr: val.value })
          }
        });
        item.endpointFailed.readMetricsValues.forEach((val: any) => {
          let curT = item.dataSource.find((i: any) => i.time === val.time);
          if (!curT) {
            curT = { fail: val.value, time: val.time }
            item.dataSource.push(curT);
          } else {
            Object.assign(curT, { fail: val.value })
          }
        });
        return item;
      })
      setData(newArr)
      setTotal(data.length)
      console.log(newArr);

      // setData(res?.data||[])
    }).finally(() => {
      // setLoading(false)
    })
  }

  const pageSizeClick = (pagination: any) => {
    setPageIndex(pagination.current);
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    // getTraceTable({ ...obj, endpoint: nowSearchEndpoint })
  };

  const nodeRef = useCallback((node: any) => {
    if (node) {
      const cardWidth = 310;
      setRowCount(Math.floor(node.clientWidth / cardWidth) || 1);
      const resizeObserver = new ResizeObserver((entries: any) => {
        setRowCount(Math.floor(node.clientWidth / cardWidth) || 1);
      }).observe(node);
    }
  }, []);

  return (
    <>
      <div className="call-info-body">
        {visible && <ChartModal visible={visible} onClose={() => { setVisible(false) }} data={chartData} />}
        <div className='item-wrapper' ref={nodeRef}>
          {/* <CardLayout > */}
          {pageData.map((item: any, index: number) => {
            return (
              <div className='call-item' style={{ width: `${rowCount === 1 ? 100 : 97 / rowCount}%`, marginLeft: `${(index % rowCount) === 0 ? '0' : `calc(${3 / (rowCount - 1)}%)`}` }}>
                <div className='title flex-space-between'>
                  <div className='table-title'>
                    <Tooltip title={item?.url || ''} placement="topLeft">
                      {item.url || ''}
                    </Tooltip>
                  </div>
                  <a onClick={() => { setChartData(item); setVisible(true) }}>图表详情</a>
                  <a>链路追踪</a>
                </div>
                <div className='main'>
                  {/* <div className='call-item-line' >
                    <div className="chart-header"></div>
                    <div className="chart-container-warpper" ref={chartRef}>
                      {chartHeight && <Line className="chart-container" {...config} height={chartHeight} />}
                    </div>

                  </div> */}
                  <Table
                    size="small"
                    bordered
                    loading={traceLoading}
                    dataSource={item?.dataSource || []}
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

          {/* </CardLayout> */}
        </div>
        {total > 10 && (
          <div className='flex-end'>
            <Pagination
              pageSize={pageSize}
              total={total}
              current={pageIndex}
              showSizeChanger
              showTotal={(total, range) => `总共 ${total} 条数据`}
              onShowSizeChange={(_, next) => {
                setPageIndex(1);
                setPageSize(next);
              }}
              onChange={(next) => setPageIndex(next)}
            />
          </div>
        )}
      </div>
    </>
  )
}