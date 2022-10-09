import React, { useState, useCallback, useEffect, useRef } from 'react';
import { findDOMNode } from 'react-dom';
import { Card, Select, Form, Tooltip, Tabs, Button, Row, Col } from 'antd';
import { RedoOutlined, SyncOutlined } from '@ant-design/icons';
import HulkTable, { usePaginated, ColumnProps } from '@cffe/vc-hulk-table';
import VCCardLayout from '@cffe/vc-b-card-layout';
import { getRequest } from '@/utils/request';
import AppCard from './app-card';
import { history,useLocation } from 'umi';
import { parse } from 'query-string';
import CpuUtilization from './dashboard/cpu-utilization-line';
import MemroyUtilization from './dashboard/memory-utilization-line';
import DiskIOChart from './dashboard/diskIO-line';
import NetWorkChart from './dashboard/network-line';
import { useQueryPodCpu, usequeryPodMem, useQueryPodDisk, useQueryPodNetwork } from './dashboard/hooks';
import {
  tableSchema,
  getGCTimeChartOption,
  getGCNumChartOption,
  getMemoryChartOption,
  getGCDataChartOption,
} from './schema';
import {
  queryAppList,
  queryPodInfoApi,
  queryGcCount,
  queryGcTime,
  queryJvmHeap,
  queryJvmMetaspace,
  queryEnvList,
} from './service';

import './index.less';

export interface IProps {
  /** 属性描述 */
  [key: string]: any;
}

type IFilter = {
  envCode?: string;
  appCode?: string;
};

const layoutGrid = {
  xs: 1,
  sm: 1,
  md: 1,
  lg: 2,
  xl: 2,
  xxl: 2,
  xxxl: 2,
};

// 开始时间枚举
export const START_TIME_ENUMS = [
  {
    label: 'Last 30 minutes',
    value: 30 * 60 * 1000,
  },
  {
    label: 'Last 1 hours',
    value: 60 * 60 * 1000,
  },
  {
    label: 'Last 6 hours',
    value: 6 * 60 * 60 * 1000,
  },
  {
    label: 'Last 12 hours',
    value: 12 * 60 * 60 * 1000,
  },
  {
    label: 'Last 24 hours',
    value: 24 * 60 * 60 * 1000,
  },
  {
    label: 'Last 3 days',
    value: 24 * 60 * 60 * 1000 * 3,
  },
  {
    label: 'Last 7 days',
    value: 24 * 60 * 60 * 1000 * 7,
  },
  {
    label: 'Last 30 days',
    value: 24 * 60 * 60 * 1000 * 30,
  },
];

// 请求频次枚举
export const RATE_ENUMS = [
  {
    label: 'Off',
    value: 0,
    showLabel: <SyncOutlined />,
  },
  {
    label: '10s',
    value: 10,
    showLabel: '10s',
  },
  {
    label: '20s',
    value: 20,
    showLabel: '20s',
  },
  {
    label: '30s',
    value: 30,
    showLabel: '30s',
  },
];

/**
 * Application
 * @description 应用监控页面
 * @create 2021-04-12 19:15:42
 */
const Coms = (props: IProps) => {
  let location:any = useLocation();
  const query :any= parse(location.search);
  // 该组件会被作为路由组件使用，接收地址栏传参数
  const appCode =query?.appCode;
  const entry=query?.entry;
  const { TabPane } = Tabs;
  const [filter, setFilter] = useState<IFilter>({} as IFilter);
  const prevFilter = useRef<IFilter>({} as IFilter);
  const [appData, setAppData] = useState([]);
  const [envData, setEnvData] = useState([]);
  // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(30 * 60 * 1000);
  // pod ip
  const [curtIP, setCurtIp] = useState<string>('');
  const [hostName, setHostName] = useState<string>('');
  // 刷新频率
  const [timeRate, setTimeRate] = useState<number>(0);
  // 定时器累计数，初始为0，每次定时器执行时加1，触发图的数据刷新，清除定时器后不再增长
  const [rateNum, setRateNum] = useState<number>(0);
  const prevRateNum = useRef<number>(0);
  const [formInstance] = Form.useForm();
  const now = new Date().getTime();
  const selectRef = useRef(null);
  const timeRateInterval = useRef<NodeJS.Timeout>();
  const [queryPodCpuData, podCpuloading, queryPodCpu] = useQueryPodCpu();
  const [queryPodMemData, podMemloading, queryPodMem] = usequeryPodMem();
  const [queryPodDiskData, podDiskloading, queryPodDisk] = useQueryPodDisk();
  const [queryPodNetworkData, podNetworkloading, queryPodNetwork] = useQueryPodNetwork();
  const appConfig = [
    {
      title: 'GC瞬时次数/每分钟',
      getOption: getGCNumChartOption,
      hasRadio: true,
      queryFn: queryGcCount,
    },
    {
      title: 'GC瞬时耗时/每分钟',
      getOption: getGCTimeChartOption,
      hasRadio: true,
      queryFn: queryGcTime,
    },
    {
      title: '堆内存详情/每分钟',
      getOption: getMemoryChartOption,
      hasRadio: true,
      queryFn: queryJvmHeap,
    },
    {
      title: '元空间详情/每分钟',
      getOption: getGCDataChartOption,
      queryFn: queryJvmMetaspace,
    },
  ];

  // 查询应用列表
  const queryApps = () => {
    let filterValue;
    try {
      filterValue = JSON.parse(localStorage.getItem('monitor_application_filter') || '')
    } catch (e) { }

    // const { appCode, envCode } = filterValue||{};
    if (filterValue?.appCode&&!entry || filterValue?.envCode&&!entry) {
      prevFilter.current = filterValue;
      setFilter(prevFilter.current);
      formInstance.setFieldsValue(prevFilter.current);
      queryAppList().then((resp) => {
        setAppData(resp);
      })
    } 
    // else {
    //   queryAppList().then((resp) => {
    //     setAppData(resp);
    //     prevFilter.current = {
    //       appCode: appCode || (resp.length ? resp[0].value : undefined),
    //     };
    //     debugger
    //     setFilter(prevFilter.current);
    //     formInstance.setFieldsValue(prevFilter.current);
    //   });
    // }
  };

  // 查询环境列表
  const queryEnvs = (appCode?:any) => {
    queryEnvList({
      appCode: prevFilter.current?.appCode as string ||appCode as string,
    }).then((resp) => {
      let newResp: any = [...new Set(resp)];
      setEnvData(newResp);
      let reg = /prd$/gi;
      // let reg =/.*(?=prd)prd/
      resp.some((item: any) => {
        if (reg.test(item.envCode)) {
          prevFilter.current = {
            // ...prevFilter.current,
            envCode: item.value,
            appCode:entry?appCode:prevFilter.current?.appCode
          };
          return true;
        } else {
          prevFilter.current = {
            // ...prevFilter.current,
            envCode: resp.length ? resp[0].value : undefined,
            appCode:entry?appCode:prevFilter.current?.appCode
          };  
        }
      });
      // if(entry){
      //   queryNodeList({...prevFilter.current});
      // }
    
      setFilter(prevFilter.current);
      formInstance.setFieldsValue(prevFilter.current);
    });
  };

  // 查询节点使用率
  const [nodeDataSource, setNodeDataSource] = useState<any>([]);
  const queryNodeList = (params?:{appCode?:string,envCode?:string}) => {
    prevFilter.current = {
      // ...prevFilter.current,
      envCode:entry? params?.envCode:prevFilter.current?.envCode,
      appCode:entry? params?.appCode:prevFilter.current?.appCode,
    };  
    getRequest(queryPodInfoApi, {
      data: {
        start: Number((now - startTime) / 1000),
        end: Number(now / 1000),
        pageSize: 1000,
        envCode:entry? params?.envCode:prevFilter.current?.envCode,
        appCode:entry? params?.appCode:prevFilter.current?.appCode,
      },
    }).then((resp) => {
        if (resp.data && resp.data[0]) {
          debugger
          setCurtIp(resp.data[0].hostIP);
          setHostName(resp.data[0]?.hostName);
        }

        setNodeDataSource(resp.data);
        if (!resp.success) {
          setNodeDataSource([]);
          return;
        }
        return {
          dataSource: resp.data || [],
          pageInfo: {
            pageIndex: 1,
            pageSize: 1000,
          },
        };
      })
      .then((resp) => {
        if (!resp?.dataSource[0]?.hostName) {
          return;
        }
      

        queryPodCpu(
          resp?.dataSource[0]?.hostName,
          filter.envCode,
          Number((now - startTime) / 1000),
          Number(now / 1000),
          filter.appCode,
          resp?.dataSource[0].hostIP,
        );
        queryPodMem(
          resp?.dataSource[0]?.hostName,
          filter.envCode,
          Number((now - startTime) / 1000),
          Number(now / 1000),
          filter.appCode,
          resp?.dataSource[0].hostIP,
        );
        queryPodDisk(
          resp?.dataSource[0]?.hostName,
          filter.envCode,
          Number((now - startTime) / 1000),
          Number(now / 1000),
          filter.appCode,
          resp?.dataSource[0].hostIP,
        );
        queryPodNetwork(
          resp?.dataSource[0]?.hostName,
          filter.envCode,
          Number((now - startTime) / 1000),
          Number(now / 1000),
          filter.appCode,
          resp?.dataSource[0].hostIP,
        );
      });
  };

  useEffect(() => {
    queryApps();
  }, []);
  useEffect(()=>{
    if(appCode && entry){
      setEnvData([]);
      queryEnvs(appCode);
    }
  },[]);

  useEffect(() => {
    if (filter.appCode &&!entry) {
      setEnvData([]);
      queryEnvs();
    }
  }, [filter.appCode]);

  useEffect(() => {
    if (filter?.appCode  &&filter?.envCode &&!entry) {
      // reset();
     
      queryNodeList();
    }
    if(filter?.appCode  &&filter?.envCode &&entry){
     
      queryNodeList({appCode,envCode:filter?.envCode});
    }
  }, [filter]);

  // 修改提示框
  useEffect(() => {
    const select = findDOMNode(selectRef.current) as HTMLDivElement;
    if (select) {
      const selector = select?.querySelectorAll('.ant-select-selection-item');
      selector?.forEach((el) => {
        el.setAttribute('title', '');
      });
     
      // if (hostName && curtIP&&currentEnvCode) {
      //   queryPodCpu(
      //     hostName,
      //     filter.envCode,
      //     Number((now - startTime) / 1000),
      //     Number(now / 1000),
      //     filter.appCode,
      //     curtIP,
      //   );
      //   queryPodMem(
      //     hostName,
      //     filter.envCode,
      //     Number((now - startTime) / 1000),
      //     Number(now / 1000),
      //     filter.appCode,
      //     curtIP,
      //   );
      //   queryPodDisk(
      //     hostName,
      //     filter.envCode,
      //     Number((now - startTime) / 1000),
      //     Number(now / 1000),
      //     filter.appCode,
      //     curtIP,
      //   );
      //   queryPodNetwork(
      //     hostName,
      //     filter.envCode,
      //     Number((now - startTime) / 1000),
      //     Number(now / 1000),
      //     filter.appCode,
      //     curtIP,
      //   );
      // }
    
    }
  }, [startTime, timeRate,prevFilter.current]);

  // 过滤操作
  const handleFilter = useCallback(
    (vals:any) => {
      setCurtIp('');
      debugger
      setHostName('');
      if (vals.appCode) {
        prevFilter.current = {
          ...vals,
        };
      } else {
        prevFilter.current = {
          ...filter,
          ...vals,
        };
      }
      localStorage.setItem('monitor_application_filter', JSON.stringify(prevFilter.current || '{}'))
      setFilter(prevFilter.current);
    },
    [filter],
  );
  useEffect(() => {
    try {
      const filter = JSON.parse(localStorage.getItem('monitor_application_filter') || '');
      if (filter?.appCode && !entry) {
        prevFilter.current = {
          appCode: filter?.appCode,
          ...filter
        };
        setFilter(prevFilter.current)
      }
    } catch (e) { }
  }, [])

  // 刷新频率改变事件
  const handleTimeRateChange = (value: number) => {
    setTimeRate(value);
    if (timeRateInterval.current) {
      clearInterval(timeRateInterval.current);
    }
    if (value) {
      timeRateInterval.current = setInterval(() => {
        // reset();
        queryNodeList({appCode,envCode:prevFilter.current?.envCode});
        prevRateNum.current += 1;
        setRateNum(prevRateNum.current);
      }, value * 1000);
    }
  };
  const refreash = () => {
    // reset();
    queryNodeList({appCode,envCode:prevFilter.current?.envCode});
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div className="monitor-app-table">
        <Card className="monitor-app-filter" style={{ marginBottom: 12, backgroundColor: '#fff' }}>
          <Form form={formInstance} layout="inline" className="monitor-filter-form" onValuesChange={handleFilter}>
            <Form.Item label="应用Code" name="appCode">
              <Select showSearch options={appData} disabled={!!appCode} />
            </Form.Item>
            <Form.Item label="环境Code" name="envCode">
              <Select options={envData} />
            </Form.Item>
          </Form>
          <div className="monitor-time-select" ref={selectRef}>
            <Tooltip title="Relative time ranges" placement="top">
              <Select
                value={startTime}
                onChange={(value) => {         
                  setStartTime(value);
                  let currentEnvCode= filter.envCode||prevFilter.current?.envCode
                   if (hostName && curtIP&&currentEnvCode) {
                     queryPodCpu(
                       hostName,
                       currentEnvCode,
                       Number((now - startTime) / 1000),
                       Number(now / 1000),
                       filter.appCode,
                       curtIP,
                     );
                     queryPodMem(
                       hostName,
                       currentEnvCode,
                       Number((now - startTime) / 1000),
                       Number(now / 1000),
                       filter.appCode,
                       curtIP,
                     );
                     queryPodDisk(
                       hostName,
                       currentEnvCode,
                       Number((now - startTime) / 1000),
                       Number(now / 1000),
                       filter.appCode,
                       curtIP,
                     );
                     queryPodNetwork(
                       hostName,
                       currentEnvCode,
                       Number((now - startTime) / 1000),
                       Number(now / 1000),
                       filter.appCode,
                       curtIP,
                     );
                   }

                 
                }}
                style={{ width: 150 }}
              >
                <Select.OptGroup label="Relative time ranges"></Select.OptGroup>
                {START_TIME_ENUMS.map((time) => (
                  <Select.Option key={time.value} value={time.value}>
                    {time.label}
                  </Select.Option>
                ))}
              </Select>
            </Tooltip>
            <Tooltip title="Refresh dashboard" placement="top">
              <Select value={timeRate} onChange={handleTimeRateChange} optionLabelProp="label" style={{ width: 54 }}>
                {RATE_ENUMS.map((time) => (
                  <Select.Option key={time.value} value={time.value} label={time.showLabel}>
                    {time.label}
                  </Select.Option>
                ))}
              </Select>
            </Tooltip>
            <span style={{ marginLeft: 4 }}>
              <Button type="primary" onClick={refreash}>
                刷新
              </Button>
            </span>
          </div>
        </Card>

        <Card className="monitor-app-body">
          <h3 className="monitor-tabs-content-title">
            资源使用情况
            <RedoOutlined
              style={{ float: 'right' }}
              onClick={() => {
                // reset();
                console.log("prevFilter.current?.envCode",prevFilter.current)
                queryNodeList({appCode,envCode:prevFilter.current?.envCode});
              }}
            />
          </h3>

          <HulkTable
            rowKey="ip"
            size="small"
            dataSource={nodeDataSource}
            columns={tableSchema as ColumnProps[]}
            pagination={false}
            onRow={(record) => {
              return {
                onClick: () => {
                  setCurtIp(record.hostIP);
                  setHostName(record?.hostName);
                  queryPodCpu(
                    record.hostName,
                    filter.envCode,
                    Number((now - startTime) / 1000),
                    Number(now / 1000),
                    filter.appCode,
                    record.hostIP,
                  );
                  queryPodMem(
                    record.hostName,
                    filter.envCode,
                    Number((now - startTime) / 1000),
                    Number(now / 1000),
                    filter.appCode,
                    record.hostIP,
                  );
                  queryPodDisk(
                    record.hostName,
                    filter.envCode,
                    Number((now - startTime) / 1000),
                    Number(now / 1000),
                    filter.appCode,
                    record.hostIP,
                  );
                  queryPodNetwork(
                    record.hostName,
                    filter.envCode,
                    Number((now - startTime) / 1000),
                    Number(now / 1000),
                    filter.appCode,
                    record.hostIP,
                  );
                },
              };
            }}
            // scroll={{ y: 300 }}
            // {...tableProps}
            customColumnMap={{
              cpu: (value) => {
                return value ? `${value}%` : '';
              },
              memory: (value) => {
                return value ? `${value}%` : '';
              },
              RSS: (value) => {
                return value ? `${value}%` : '';
              },
              WSS: (value) => {
                return value ? `${value}%` : '';
              },
            }}
          />
          <h3 className="monitor-tabs-content-title">
            监控图表
          </h3>
          <div >
            <Tabs defaultActiveKey="1" >
              <TabPane tab={<span>进程监控</span>} key="1">
                <VCCardLayout grid={layoutGrid} className="monitor-app-content">
                  {appConfig.map((el, index) => (
                    <AppCard
                      key={index}
                      {...el}
                      requestParams={{ ...filter, ip: curtIP, startTime, rateNum, hostName: hostName }}
                    />
                  ))}
                </VCCardLayout>
              </TabPane>
              <TabPane tab={<span>基础监控</span>} key="2">
                <Row gutter={[16, 24]}>
                  <Col span={12}>
                    <div className="base-monitor-charts">
                      <MemroyUtilization data={queryPodMemData} loading={podMemloading} />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="base-monitor-charts">
                      <CpuUtilization data={queryPodCpuData} loading={podCpuloading} />
                    </div>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div className="base-monitor-charts">
                      <NetWorkChart data={queryPodNetworkData} loading={podNetworkloading} />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="base-monitor-charts">
                      <DiskIOChart data={queryPodDiskData} loading={podDiskloading} />
                    </div>
                  </Col>
                </Row>

                {/* <div style={{ width: '100%', height: '100%' }}>
                  <div className="base-monitor-charts">
                    <MemroyUtilization data={queryPodMemData} loading={podMemloading} />
                  </div>
                  <div className="base-monitor-charts">
                    <CpuUtilization data={queryPodCpuData} loading={podCpuloading} />
                  </div>
                  <div className="base-monitor-charts">
                    <NetWorkChart data={queryPodNetworkData} loading={podNetworkloading} />
                  </div>
                  <div className="base-monitor-charts">
                    <DiskIOChart data={queryPodDiskData} loading={podDiskloading} />
                  </div>
                </div> */}
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </div>
    </div >
  );
};

export default Coms;
