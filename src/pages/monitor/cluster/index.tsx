import React, { useCallback, useState, useEffect } from 'react';
import { Tabs, Card, Form, Input, Spin, Select, Divider, Button,Tooltip } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import DashboardsModal from './dashboard';
import PageContainer from '@/components/page-container';
import VCCardLayout from '@cffe/vc-b-card-layout';
import { getRequest } from '@/utils/request';
import HulkTable from '@cffe/vc-hulk-table';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
import {
  useQueryNodeCpu,
  usequeryNodeMem,
  useQueryNodeDisk,
  useQueryNodeLoad,
  useQueryNodeIO,
  useQueryNodeFile,
  useQueryNodeSocket,
  useQueryNodeNetWork,
} from './dashboard/hooks';
import {
  queryEnvLists,
  queryResUseData,
  queryNodeUseDataApi,
  queryUseMarketData,
  queryPodNamespaceData,
  queryClustersData,
  queryPodUseData,
  queryPodUrl,
} from './service';
import { resUseTableSchema, podUseTableSchema } from './schema';
import { ITab, ICard, gridData, IMarket, tabList } from './type';
import { AlarmModal } from './components/alarm-modal';
import './index.less';
import { getColorByValue } from './../util';

const { ColorContainer } = colorUtil.context;

/**
 * Board
 * @description 监控面板
 * @create 2021-04-12 19:13:58
 */
const Coms = (props: any) => {
  const [tabData, setTabData] = useState<ITab[]>();
  let href = window.location.href.includes('matrix-fygs') || window.location.href.includes('matrix-zslnyy');
  const [currentTab, setCurrentTab] = useState<string>(href ? 'prod' : 'dev');
  const tabListFygs = [{ label: 'PROD', value: 'prod' }];
  const [cardDataLists, setCardDataLists] = useState<ICard[]>([]);
  const [useMarket, setUseMarket] = useState<IMarket[]>([]);
  const [ipDetailShow, setIpDetailShow] = useState<boolean>(false);
  const [resLoading, setResLoading] = useState<boolean>(false);
  const [podLoading, setPodLoading] = useState<boolean>(false);
  const [nodeLoading, setNodeLoading] = useState<boolean>(false);
  const [nameSpaceOption, setNameSpaceOption] = useState<any>([]);
  const [podDataSource, setPodDataSource] = useState<any>([]);
  const [nodeDataSource, setNodeDataSource] = useState<any>([]);
  const [searchField] = Form.useForm();
  const [searchPodField] = Form.useForm();
  const [clusterList, setClusterList] = useState<any>([]);
  const [currentCluster, setCurrentCluster] = useState<any>(props.clusterCode);
  const [queryNodeCpuData, nodeCpuloading, queryNodeCpu] = useQueryNodeCpu();
  const [queryNodeMemData, nodeMemloading, queryNodeMem] = usequeryNodeMem();
  const [queryNodeDiskData, nodeDiskloading, queryNodeDisk] = useQueryNodeDisk();
  const [queryNodeLoadData, nodeLoadloading, queryNodeLoad] = useQueryNodeLoad();
  const [queryNodeIOData, nodeIoloading, queryNodeIO] = useQueryNodeIO();
  const [queryNodeFileData, nodeFileloading, queryNodeFile] = useQueryNodeFile();
  const [queryNodeSocketData, nodeSocketloading, queryNodeSocket] = useQueryNodeSocket();
  const [queryNodeNetWorkData, nodeNetWorkloading, queryNodeNetWork] = useQueryNodeNetWork();
  const [alarmInfoMode, setAlarmInfoMode] = useState<EditorMode>('HIDE');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState(0);
  const [nodePageIndex, setNodePageIndex] = useState(1);
  const [nodePageSize, setNodePageSize] = useState<number>(20);
  const [nodeTotal, setNodeTotal] = useState(0);

  // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(30 * 60 * 1000);
  const now = new Date().getTime();
  //默认传最近30分钟，处理为秒级的时间戳
  let start = Number((now - startTime) / 1000).toString();
  let end = Number(now / 1000).toString();
  const [startTimestamp, setStartTimestamp] = useState<any>(start); //开始时间
  const [endTimestamp, setEndTimestamp] = useState<any>(end); //结束时间
  // // 查询机构列表
  const selectCluster = (param: any) => {
    if (!param) {
      return;
    }
    setCurrentCluster(param);
    queryResData(param);
    queryPodData(param);
    // reset();
    queryNodeList({ clusterId: param });
    queryUseMarket(param);
    queryNameSpace(param)
  };

  useEffect(() => {
    selectCluster(props.clusterCode)
  }, [props.clusterCode])

  // 查询资源使用情况
  const queryResData = (value: any) => {
    setResLoading(true);
    queryResUseData({ clusterId: value })
      .then((res) => {
        setCardDataLists(res as ICard[]);
      })
      .finally(() => {
        setResLoading(false);
      });
  };
  //查询pod列表数据
  const queryPodData = (
    value: any,
    pageIndexParam?: number,
    pageSizeParam?: number,
    keyWordParams?: any,
    namespace?: string,
  ) => {
    setPodLoading(true);
    queryPodUseData(value, pageIndexParam || 1, pageSizeParam || 20, keyWordParams, namespace)
      .then((result) => {
        const resultDataSouce = result?.dataSource?.map((item: Record<string, object>) => {
          const key = Object.keys(item)[0];
          return {
            ...item[key],
          };
        });
        setPodDataSource(resultDataSouce);
        let pageInfo = result?.pageInfo;
        setPageIndex(pageInfo?.pageIndex);
        setPageSize(pageInfo?.pageSize);
        setTotal(pageInfo?.total);
      })
      .finally(() => {
        setPodLoading(false);
      });
  };
  // 查询节点使用率
  const queryNodeList = (params: { clusterId: any; pageIndex?: number; pageSize?: number; keyword?: any }) => {
    setNodeLoading(true);
    getRequest(queryNodeUseDataApi, { data: params })
      .then((result: any) => {
        let data: any = [];
        if (!result.success) {
          data = [];
        }
        if (result.data === null) {
          data = [];
        } else {
          const { dataSource = [] } = result.data;
          data = (dataSource || [])?.map((item: Record<string, object>) => {
            const key = Object.keys(item)[0];
            return {
              ip: key,
              ...item[key],
            };
          });
        }
        setNodeDataSource(data);
        let pageInfo = result.data?.pageInfo;
        setNodePageIndex(pageInfo?.pageIndex || 1);
        setNodePageSize(pageInfo?.pageSize || 20);
        setNodeTotal(pageInfo?.total || 0);
      })
      .finally(() => {
        setNodeLoading(false);
      });
  };

  // 查询已安装大盘
  const queryUseMarket = (value: any) => {
    // queryUseMarketData({ clusterId: value }).then((res) => {
    //   setUseMarket(res);
    // });
  };
  //查询nameSpace
  const queryNameSpace = (value: any) => {
    queryPodNamespaceData({ clusterId: value }).then((res) => {
      setNameSpaceOption(res);
    });
  };

  const [currentIp, setCurrentIp] = useState<string>('');

  const handleIpClick = (ip: string) => {
    setCurrentIp(ip);
    querChartData(currentCluster, startTimestamp, endTimestamp, ip, true);
  };

  const [queryCount, setQueryCount] = useState<number>(0);
  const querChartData = (getCluster: any, startTime: any, endTime: any, ip: any, isOpen: boolean) => {
    setQueryCount(queryCount + 1);
    queryNodeCpu(getCluster, ip, startTime, endTime);
    queryNodeMem(getCluster, ip, startTime, endTime);
    queryNodeDisk(getCluster, ip, startTime, endTime);
    queryNodeLoad(getCluster, ip, startTime, endTime);
    queryNodeIO(getCluster, ip, startTime, endTime);
    queryNodeFile(getCluster, ip, startTime, endTime);
    queryNodeSocket(getCluster, ip, startTime, endTime);
    queryNodeNetWork(getCluster, ip, startTime, endTime);

    if (isOpen) {
      setTimeout(() => {
        setIpDetailShow(true);
      }, 200);
    }
  };

  const handlePodClick = () => {};
  // 页面刷新
  const handleRefresh = () => {
    queryResData(currentCluster);
    queryPodData(currentCluster);
    queryNodeList({ clusterId: currentCluster });
    queryUseMarket(currentCluster);
  };

  // 获取资源使用率图
  const getChartOptions: any = useCallback((title: string, percent: number | string, color?: string) => {
    const percentNum = Number(percent);
    const options = {
      grid: {
        left: '0',
        right: '0',
        top: '0',
        bottom: '0',
      },
      tooltip: {
        trigger: 'item',
        formatter(param: any) {
          return `${param.name}<br/>${param.marker}${param.value}%`;
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['55%', '90%'],
          label: {
            show: false,
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2,
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: percentNum,
              name: title,
              itemStyle: { color: color || '#439D75' },
            },
            {
              value: (100 - percentNum).toFixed(2),
              name: '空闲',
              itemStyle: { color: '#ddd' },
            },
          ],
        },
      ],
    };

    return options;
  }, []);
  const [searchKeyWords, setSearchKeyWords] = useState<any>('');
  const [nodeKeyWords, setNodeKeyWords] = useState<any>('');
  const handleSearchRes = () => {
    let param = searchField.getFieldsValue();
    setNodeKeyWords(param);
    queryNodeList({ clusterId: currentCluster, keyword: param.keyword, pageIndex: pageIndex, pageSize: pageSize });
  };
  const handleSearchPod = () => {
    let param = searchPodField.getFieldsValue();
    setSearchKeyWords(param);
    queryPodData(currentCluster, pageIndex, pageSize, param.keyword, param.namespace);
  };

  const handleOk = () => {
    setIpDetailShow(false);
  };

  const handleCancel = () => {
    setIpDetailShow(false);
  };

  // 顶部的 card
  const renderCard = (record: ICard) => {
    const { mode = '1', title, value = '-', unit = '', dataSource = [] } = record;

    return mode === '1' ? (
      <Card className="monitor-card-item">
        <h4 className="monitor-card-item-title">{title}</h4>
        <div className="monitor-card-item-content">
          <span className="monitor-card-item-val">
            {value || '-'}
            {unit || ''}
          </span>
          <div className="monitor-card-item-chart">
            <ColorContainer roleKeys={['color']}>
              <EchartsReact option={getChartOptions(title, value)} />
            </ColorContainer>
          </div>
        </div>
      </Card>
    ) : (
      <Card className="mode-table" id="mode-table-card" bodyStyle={{ padding: '16px' }}>
        {dataSource.map((el) => (
          <div className="mode-table-item">
            <h4 className="title">{el.title}</h4>
            <div className="value" style={{ color: el.color }}>
              {el.title === '节点数' || el.title === 'POD数' ? (
                <a
                  href={
                    el.title === '节点数'
                      ? '#monitor-tabs-content-sec-node'
                      : el.title === 'POD数'
                        ? '#monitor-tabs-content-sec-pod'
                        : '#mode-table-card'
                  }
                >
                  {el.value || '-'}
                </a>
              ) : el.title === '告警数' && el.value ? (
                <a
                  onClick={() => {
                    setAlarmInfoMode('VIEW');
                  }}
                >
                  {el.value || '-'}
                </a>
              ) : (
                <span>{el.value || '-'}</span>
              )}

              {el.unit || ''}
            </div>
          </div>
        ))}
      </Card>
    );
  };

  return (
    <PageContainer className="monitor-board">
      <AlarmModal
        mode={alarmInfoMode}
        curClusterId={currentCluster}
        onClose={() => {
          setAlarmInfoMode('HIDE');
        }}
      />
      <Card className="monitor-board-content">
        {/* {
          ipDetailShow && ( */}
        <DashboardsModal
          ipDetailVisiable={ipDetailShow}
          onOk={handleOk}
          onCancel={handleCancel}
          initData={{
            nodeCpu: queryNodeCpuData,
            nodeMem: queryNodeMemData,
            nodeDisk: queryNodeDiskData,
            nodeLoad: queryNodeLoadData,
            nodeIO: queryNodeIOData,
            nodeFile: queryNodeFileData,
            nodeSocket: queryNodeSocketData,
            nodeNetWork: queryNodeNetWorkData,
          }}
          loadings={{
            nodeCpu: nodeCpuloading,
            nodeMem: nodeMemloading,
            nodeDisk: nodeDiskloading,
            nodeLoad: nodeLoadloading,
            nodeIO: nodeIoloading,
            nodeFile: nodeFileloading,
            nodeSocket: nodeSocketloading,
            nodeNetWork: nodeNetWorkloading,
          }}
          currentIpData={currentIp}
          currentClusterData={currentCluster}
          querChartData={(getCluster: any, startTime: any, endTime: any, ip: any, isOpen: boolean) =>
            querChartData(getCluster, startTime, endTime, ip, isOpen)
          }
          queryCount={queryCount}
        />
        <div className="monitor-tabs-content">
          <Spin spinning={resLoading}>
            <h3 className="monitor-tabs-content-title">
              集群资源概览
              <RedoOutlined className="monitor-tabs-content-title-btns" onClick={handleRefresh} />
            </h3>
            <div className="monitor-tabs-content-sec">
              <VCCardLayout grid={gridData}>{cardDataLists.map((el) => renderCard(el))}</VCCardLayout>
            </div>
          </Spin>

          <div className="table-caption" style={{ marginTop: 28 }}>
            <h3 className="monitor-tabs-content-title" style={{ margin: 0 }}>
              节点资源明细
            </h3>
            <Form form={searchField} layout="inline">
              <Form.Item name="keyword">
                <Input.Search placeholder="搜索主机名、IP" style={{ width: 320 }} onSearch={handleSearchRes} />
              </Form.Item>
            </Form>
          </div>
          {/* 节点表格 */}
          <div className="monitor-tabs-content-sec" id="monitor-tabs-content-sec-node">
            <HulkTable
              rowKey="id"
              size="small"
              dataSource={nodeDataSource}
              loading={nodeLoading}
              columns={resUseTableSchema as any}
              scroll={{ y: 313 }}
              pagination={{
                pageSize: nodePageSize,
                total: nodeTotal,
                current: nodePageIndex,
                showSizeChanger: true,
                onShowSizeChange: (_, next) => {
                  setNodePageIndex(1);
                  setNodePageSize(next);
                  // queryPodData(currentCluster, 1, next, searchKeyWords?.keyword);
                },
                showTotal: () => `总共 ${nodeTotal} 条数据`,

                // showTotal: () => `总共 ${total} 条数据`,
                onChange: (next, size: any) => {
                  setNodePageSize(size);
                  setNodePageIndex(next),
                    queryNodeList({
                      clusterId: currentCluster,
                      pageIndex: next,
                      pageSize: size,
                      keyword: nodeKeyWords?.keyword,
                    });
                },
              }}
              // {...tableProps}
              customColumnMap={{
                ip: (value, record) => {
                  return (
                    <a className="monitor-tabs-content-ip" onClick={() => handleIpClick(value)}>
                      {record.ip}
                    </a>
                  );
                },
                cpuUsageRate: (value, record) => {
                  return (
                    <span className="monitor-tabs-content-tag" style={{ backgroundColor: getColorByValue(value) }}>
                      {value}%
                    </span>
                  );
                },
                memoryUsageRate: (value, record) => {
                  return (
                    <span className="monitor-tabs-content-tag" style={{ backgroundColor: getColorByValue(value) }}>
                      {value}%
                    </span>
                  );
                },
                diskUsageRate: (value, record) => {
                  return (
                    <span className="monitor-tabs-content-tag" style={{ backgroundColor: getColorByValue(value) }}>
                      {value}%
                    </span>
                  );
                },
              }}
            />
          </div>
          <div className="table-caption" style={{ marginTop: 28 }}>
            <h3 className="monitor-tabs-content-title" style={{ margin: 0 }}>
              Pod资源明细
            </h3>
            <Form form={searchPodField} layout="inline" onFinish={handleSearchPod}>
              <Form.Item name="namespace">
                <Select
                  placeholder="选择nameSpace进行搜索"
                  style={{ width: 260 }}
                  options={nameSpaceOption}
                  showSearch
                  allowClear
                  onChange={handleSearchPod}
                />
              </Form.Item>
              <Form.Item name="keyword">
                <Input.Search placeholder="搜索主机名、IP" style={{ width: 320 }} onSearch={handleSearchPod} />
              </Form.Item>
            </Form>
          </div>
          {/* pod表格 */}
          <div className="monitor-tabs-content-sec" id="monitor-tabs-content-sec-pod">
            <HulkTable
              rowKey="id"
              size="small"
              columns={podUseTableSchema as any}
              scroll={{ y: 313 }}
              dataSource={podDataSource}
              loading={podLoading}
              pagination={{
                pageSize,
                total,
                current: pageIndex,
                showSizeChanger: true,
                onShowSizeChange: (_, next) => {

                  setPageIndex(1);
                  setPageSize(next);
                  // queryPodData(currentCluster, 1, next, searchKeyWords?.keyword);
                },
                showTotal: () => `总共 ${total} 条数据`,

                // showTotal: () => `总共 ${total} 条数据`,
                onChange: (next, size: any) => {
                  setPageSize(size);
                  setPageIndex(next),
                    queryPodData(currentCluster, next, size, searchKeyWords?.keyword, searchKeyWords?.namespace);
                },
              }}
              customColumnMap={{
                HostIP: (value, record) => {
                  return (
                    <span className="monitor-tabs-content-ip" onClick={() => handlePodClick()}>
                      {record.HostIP}
                    </span>
                  );
                },
                Cpu: (value, record) => {
                  return (
                    <Tooltip title={`${value}%`}>
                      <span className="monitor-tabs-content-tag" style={{ backgroundColor: getColorByValue(value),whiteSpace:"nowrap", }}>
                        {value}%
                      </span>
                    </Tooltip>
                  );
                },
                Wss: (value, record) => {
                  return (
                    <Tooltip title={`${value}%`}>
                      <span className="monitor-tabs-content-tag" style={{ backgroundColor: getColorByValue(value),whiteSpace:"nowrap" }}>
                        {value}%
                      </span>
                    </Tooltip>
                  );
                },
                Rss: (value, record) => {
                  return (
                    <Tooltip title={`${value}%`}>
                      <span className="monitor-tabs-content-tag" style={{ backgroundColor: getColorByValue(value),whiteSpace:"nowrap" }}>
                        {value}%
                      </span>
                    </Tooltip>
                  );
                },
                Disk: (value, record) => {
                  return <span className="monitor-tabs-content-tag">{value}</span>;
                },
              }}
            />
          </div>

          {/* <h3 className="monitor-tabs-content-title">已安装大盘</h3>
          <div className="monitor-tabs-content-sec">
            {useMarket.map((el) => (
              <span
                className="monitor-market-item"
                onClick={() => {
                  window.open(el.href, '_blank');
                }}
              >
                {el.name}
              </span>
            ))}
          </div> */}
        </div>
      </Card>
      {/* <Drawer
        title="节点明细"
        visible={nodeDetailShow}
        onClose={() => setNodeDetailShow(false)}
        width={'98%'}
      >
        {nodeDetailShow && <iframe style={{ width: '100%', height: '99%', border: 'none' }} src={prevNode.current?.href}></iframe>}
      </Drawer> */}
    </PageContainer>
  );
};

export default Coms;
