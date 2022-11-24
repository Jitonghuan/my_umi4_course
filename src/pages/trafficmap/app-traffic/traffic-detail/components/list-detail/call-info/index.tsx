
import React, { useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { Card, Table, Pagination, Tooltip, Empty, Spin } from 'antd';
import moment from 'moment'
import { columnSchema, mock } from './schema'
import { getCountDetail, useCountDetailTable } from './hook'
import DetailContext from '../../../context';
import debounce from 'lodash/debounce';
import { history } from 'umi';
import ChartModal from './chart-modal';
import CardLayout from '@cffe/vc-b-card-layout';
import {
  LineChartOutlined,
  BranchesOutlined
} from '@ant-design/icons';
import './index.less'

export default function CallInfo(props: any) {
  const { searchValue, setCallInfoData } = props;
  const { appCode, envCode, startTime, appId, deployName, count, isClick, podIps, endTime, selectTimeType } = useContext(DetailContext);
  const [traceLoading, setTraceLoading] = useState<boolean>(false)
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  // const [total, setTotal] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  // const [data, setData] = useState<any>([]);//初始拿到的所有数据
  // const [loading, setLoading] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any>({});
  const [rowCount, setRowCount] = useState(0);
  // const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [showPage, setShowPage] = useState<boolean>(true);
  const [pageData, setPageData] = useState<any>([]);
  const filter = debounce((value) => filterData(value), 500);
  const [originData, setOriginData] = useState<any>([]);
  const [data, total, loading, loadData, isEmpty] = useCountDetailTable({});

  useEffect(() => {
    const res = data.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    setPageData(res)
    setOriginData(res);
  }, [data, pageSize, pageIndex])

  useEffect(() => {
    setCallInfoData(data);
  }, [data])

  useEffect(() => {
    filter(searchValue)
  }, [searchValue])

  const filterData = (value: string) => {
    if (!value) {
      if (originData.length) {
        setShowPage(true);
        setPageData(originData)
      }
      return;
    }
    setShowPage(false)
    const afterFilter: any = [];
    data.forEach((item: any) => {
      if (item.url?.indexOf(value) !== -1) {
        afterFilter.push(item);
      }
    });
    setPageData(afterFilter)
  }

  const tableColumns = useMemo(() => {
    return columnSchema()
  }, [appId, envCode])

  useEffect(() => {
    //if (!envCode || !startTime || !appId || !deployName) return
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
    const params = {
      envCode: envCode || "",
      deployName,
      appId,
      podIps,
      //@ts-ignore
      start: moment(new Date(Number(start) * 1000)).format('YYYY-MM-DD HH:mm:ss'),
      //@ts-ignore
      end: moment(new Date(Number(end) * 1000)).format('YYYY-MM-DD HH:mm:ss'),
    }
    if (isClick && isClick === appCode) {
      loadData({ ...params, isTotal: true })
    } else {
      loadData({ ...params, isTotal: false })
    }
  }, [envCode, startTime, deployName, appId, count, isClick, endTime, selectTimeType])

  const pageSizeClick = (pagination: any) => {
    setPageIndex(pagination.current);
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
  };

  const nodeRef = useCallback((node: any) => {
    if (node) {
      const cardWidth = 600;
      setRowCount(Math.floor(node.clientWidth / cardWidth) || 1);
      const resizeObserver = new ResizeObserver((entries: any) => {
        setRowCount(Math.floor(node.clientWidth / cardWidth) || 1);
      }).observe(node);
    }
  }, []);

  const toTrafficMap = useCallback((url: string) => {
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
    history.push({
      pathname: "/matrix/trafficmap/tracking"
    }, {
      entry: "logSearch",
      envCode: envCode,
      appId: appId,
      startTime: start,
      endTime: end,
      endpoint: url
    })
    // const url = `/matrix/trafficmap/tracking?envCode=${envCode}&startTime=${start}&endTime=${end}&appId=${appId}&entry=logSearch`
    // window.open(url, '_blank')
  }, [appId, envCode, selectTimeType, startTime, endTime])

  return (
    <>
      <div className="call-info-body">
        {visible && <ChartModal visible={visible} onClose={() => { setVisible(false) }} data={chartData} />}
        {isEmpty ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无数据' /> :
          <>
            <Spin spinning={loading}>
              <div className='item-wrapper' ref={nodeRef}>
                {/* <CardLayout > */}
                {(pageData || []).map((item: any, index: number) => {
                  return (
                    <div className='call-item' style={{ width: `${rowCount === 1 ? 100 : 99 / rowCount}%`, marginLeft: `${(index % rowCount) === 0 ? '0' : `calc(${1 / (rowCount - 1)}%)`}` }}>
                      <div className='title flex-space-between'>
                        <div className='table-title'>
                          <Tooltip title={item?.url || ''} placement="topLeft">
                            {item.url || ''}
                          </Tooltip>
                        </div>
                        <div>
                          <a onClick={() => { setChartData(item); setVisible(true) }}><LineChartOutlined style={{ fontSize: 16 }} /></a>
                          <a onClick={() => { toTrafficMap(item?.url || '') }}><BranchesOutlined style={{ fontSize: 16, marginLeft: 10 }} /></a>
                        </div>
                      </div>
                      <div className='main'>
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
              {total > 0 && showPage && (
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
            </Spin>
          </>
        }
      </div>
    </>
  )
}