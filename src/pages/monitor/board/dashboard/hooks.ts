/**
 * @description: 监控看板弹窗图表接口
 * @name {muxi.jth}
 * @date {2021/12/13 10:30}
 */
import { useState, useEffect, useCallback } from 'react';
import * as APIS from './service';
import { getRequest } from '@/utils/request';
import moment from 'moment';

// 获取节点趋势图-CPU数据
export function useQueryNodeCpu() {
  const [queryNodeCpuData, setQueryNodeCpuData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const queryNodeCpu = async (clusterId: string, nodeIP: string, startTime: any, endTime: any) => {
    setLoading(true);
    await getRequest(APIS.queryNodeCpu, { data: { clusterId, nodeIP, startTime, endTime } })
      .then((res) => {
        if (res?.success) {
          let dataSource = res?.data;
          let nodeCpuDataArry: any = [];
          for (const key in dataSource) {
            if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
              const element = dataSource[key];
              if (key === 'nodeCpuSys') {
                dataSource['nodeCpuSys'].map((ele: any) => {
                  nodeCpuDataArry.push({
                    category: key,
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    precentage: Number(ele[1]).toFixed(1),
                  });
                });
              }
              if (key === 'nodeCpuTotal') {
                dataSource['nodeCpuTotal'].map((ele: any) => {
                  nodeCpuDataArry.push({
                    category: key,
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    precentage: Number(ele[1]).toFixed(1),
                  });
                });
              }
              if (key === 'nodeCpuUser') {
                dataSource['nodeCpuUser'].map((ele: any) => {
                  nodeCpuDataArry.push({
                    category: key,
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    precentage: Number(ele[1]).toFixed(1),
                  });
                });
              }
            }
          }

          setQueryNodeCpuData(nodeCpuDataArry);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [queryNodeCpuData, loading, queryNodeCpu];
}

// 获取节点趋势图-内存数据
export function usequeryNodeMem() {
  const [queryNodeMemData, setQueryNodeMemData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const queryNodeMem = (clusterId: string, nodeIP: string, startTime: any, endTime: any) => {
    setLoading(true);
    getRequest(APIS.queryNodeMem, { data: { clusterId, nodeIP, startTime, endTime } })
      .then((res) => {
        if (res?.success) {
          let nodeMemDataArry: any = [];
          let dataSource = res?.data.nodeMem;
          dataSource.map((item: any) => {
            nodeMemDataArry.push({
              time: moment(parseInt(item[0]) * 1000).format('HH:mm'),
              precentage: Number(item[1]).toFixed(1),
              category: '内存',
            });
          });

          setQueryNodeMemData(nodeMemDataArry);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [queryNodeMemData, loading, queryNodeMem];
}

// 获取节点趋势图-磁盘使用率数据
export function useQueryNodeDisk() {
  const [queryNodeDiskData, setQueryNodeDiskData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const queryNodeDisk = async (clusterId: string, nodeIP: string, startTime: any, endTime: any) => {
    setLoading(true);
    await getRequest(APIS.queryNodeDisk, { data: { clusterId, nodeIP, startTime, endTime } })
      .then((res) => {
        if (res?.success) {
          let nodeDiskDataArry: any = [];
          let dataSource = res?.data;
          for (const key in dataSource) {
            if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
              //   const element = object[key];
              if (key === 'nodeDiskInode') {
                dataSource['nodeDiskInode']?.map((ele: any) => {
                  nodeDiskDataArry.push({
                    value: Number(ele[1]).toFixed(1),
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    category: key,
                  });
                });
              }
              if (key === 'nodeDiskRoot') {
                dataSource['nodeDiskRoot']?.map((ele: any) => {
                  nodeDiskDataArry.push({
                    value: Number(ele[1]).toFixed(1),
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    category: key,
                  });
                });
              }
            }
          }

          setQueryNodeDiskData(nodeDiskDataArry);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [queryNodeDiskData, loading, queryNodeDisk];
}

// 获取节点趋势图-平均负载数据
export function useQueryNodeLoad() {
  const [queryNodeLoadData, setQueryNodeLoadData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const queryNodeLoad = (clusterId: string, nodeIP: string, startTime: any, endTime: any) => {
    setLoading(true);
    getRequest(APIS.queryNodeLoad, { data: { clusterId, nodeIP, startTime, endTime } })
      .then((res) => {
        if (res?.success) {
          let dataSource = res?.data;
          let nodeLoadDataArry: any = [];
          for (const key in dataSource) {
            if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
              const element = dataSource[key];
              if (key === 'nodeLoad1') {
                dataSource['nodeLoad1']?.map((ele: any) => {
                  nodeLoadDataArry.push({
                    category: key,
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    precentage: Number(ele[1]).toFixed(1),
                  });
                });
              }
              if (key === 'nodeLoad5') {
                dataSource['nodeLoad5']?.map((ele: any) => {
                  nodeLoadDataArry.push({
                    category: key,
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    precentage: Number(ele[1]).toFixed(1),
                  });
                });
              }
              if (key === 'nodeLoad15') {
                dataSource['nodeLoad15']?.map((ele: any) => {
                  nodeLoadDataArry.push({
                    category: key,
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    precentage: Number(ele[1]).toFixed(1),
                  });
                });
              }
            }
          }

          setQueryNodeLoadData(nodeLoadDataArry);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [queryNodeLoadData, loading, queryNodeLoad];
}

// 获取节点趋势图-磁盘IO读写数据
export function useQueryNodeIO() {
  const [queryNodeIOData, setQueryNodeIOData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const queryNodeIO = (clusterId: string, nodeIP: string, startTime: any, endTime: any) => {
    setLoading(true);
    getRequest(APIS.queryNodeIO, { data: { clusterId, nodeIP, startTime, endTime } })
      .then((res) => {
        if (res?.success) {
          let nodeIODataArry: any = [];
          let dataSource = res?.data;
          for (const key in dataSource) {
            if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
              //   const element = object[key];
              if (key === 'nodeIORead') {
                dataSource['nodeIORead']?.map((ele: any) => {
                  nodeIODataArry.push({
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    value: Number(ele[1]).toFixed(1),
                    category: '读次数（次/min)',
                  });
                });
              }
              if (key === 'nodeIOWrite') {
                dataSource['nodeIOWrite']?.map((ele: any) => {
                  nodeIODataArry.push({
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    value: Number(ele[1]).toFixed(1),
                    category: '写次数（次/min)',
                  });
                });
              }
            }
          }

          setQueryNodeIOData(nodeIODataArry);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [queryNodeIOData, loading, queryNodeIO];
}

// 获取节点趋势图-打开文件数数据
export function useQueryNodeFile() {
  const [queryNodeFileData, setQueryNodeFileData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  //上下文切换为散点图，使用文件为折线
  const queryNodeFile = (clusterId: string, nodeIP: string, startTime: any, endTime: any) => {
    setLoading(true);
    getRequest(APIS.queryNodeFile, { data: { clusterId, nodeIP, startTime, endTime } })
      .then((res) => {
        if (res?.success) {
          let nodeFileDataArry: any = [];
          let dataSource = res?.data;
          for (const key in dataSource) {
            if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
              //   const element = object[key];
              if (key === 'nodeContext') {
                dataSource['nodeContext']?.map((ele: any) => {
                  nodeFileDataArry.push({
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    value: Number(Number(ele[1]).toFixed(1)),
                    category: key,
                  });
                });
              }
              if (key === 'nodeFilefd') {
                dataSource['nodeFilefd']?.map((ele: any) => {
                  nodeFileDataArry.push({
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    value: Number(Number(ele[1]).toFixed(1)),
                    category: key,
                  });
                });
              }
            }
          }

          setQueryNodeFileData(nodeFileDataArry);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [queryNodeFileData, loading, queryNodeFile];
}

// 获取节点趋势图-网络socket数据
export function useQueryNodeSocket() {
  const [queryNodeSocketData, setQueryNodeSocketData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const queryNodeSocket = (clusterId: string, nodeIP: string, startTime: any, endTime: any) => {
    setLoading(true);
    getRequest(APIS.queryNodeSocket, { data: { clusterId, nodeIP, startTime, endTime } })
      .then((res) => {
        if (res?.success) {
          let nodeSocketDataArry: any = [];
          let dataSource = res?.data;
          for (const key in dataSource) {
            if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
              //   const element = object[key];
              if (key === 'nodeTCPES') {
                dataSource['nodeTCPES']?.map((ele: any) => {
                  nodeSocketDataArry.push({
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    value: Number(ele[1]).toFixed(1),
                    category: key,
                  });
                });
              }
              if (key === 'nodeTCPTW') {
                dataSource['nodeTCPTW']?.map((ele: any) => {
                  nodeSocketDataArry.push({
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    value: Number(ele[1]).toFixed(1),
                    category: key,
                  });
                });
              }
              if (key === 'nodeTCPTotal') {
                dataSource['nodeTCPTotal']?.map((ele: any) => {
                  nodeSocketDataArry.push({
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    value: Number(ele[1]).toFixed(1),
                    category: key,
                  });
                });
              }
            }
          }

          setQueryNodeSocketData(nodeSocketDataArry);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [queryNodeSocketData, loading, queryNodeSocket];
}

// 获取节点趋势图-网络流量数据
export function useQueryNodeNetWork() {
  const [queryNodeNetWorkData, setQueryNodeNetWorkData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const queryNodeNetWork = (clusterId: string, nodeIP: string, startTime: any, endTime: any) => {
    setLoading(true);
    getRequest(APIS.queryNodeNetWork, { data: { clusterId, nodeIP, startTime, endTime } })
      .then((res) => {
        if (res?.success) {
          let nodeNetWorkDataArry: any = [];
          let dataSource = res?.data;
          for (const key in dataSource) {
            if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
              //   const element = object[key];
              if (key === 'nodeNetReceive') {
                dataSource['nodeNetReceive']?.map((ele: any) => {
                  nodeNetWorkDataArry.push({
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    value: Number(ele[1]).toFixed(1),
                    category: '入流量',
                  });
                });
              }
              if (key === 'nodeNetTransmit') {
                dataSource['nodeNetTransmit']?.map((ele: any) => {
                  nodeNetWorkDataArry.push({
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    value: Number(ele[1]).toFixed(1),
                    category: '出流量',
                  });
                });
              }
            }
          }

          setQueryNodeNetWorkData(nodeNetWorkDataArry);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [queryNodeNetWorkData, loading, queryNodeNetWork];
}
