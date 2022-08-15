import appConfig from '@/app.config';

//GET 节点趋势图-CPU
export const queryNodeCpu = `${appConfig.apiPrefix}/monitorManage/resource/nodeCpu`;
//GET 节点趋势图-内存
export const queryNodeMem = `${appConfig.apiPrefix}/monitorManage/resource/nodeMem`;
//GET 节点趋势图-磁盘
export const queryNodeDisk = `${appConfig.apiPrefix}/monitorManage/resource/nodeDisk`;
//GET 节点趋势图-平均负载
export const queryNodeLoad = `${appConfig.apiPrefix}/monitorManage/resource/nodeLoad`;
//GET 节点趋势图-磁盘IO读写
export const queryNodeIO = `${appConfig.apiPrefix}/monitorManage/resource/nodeIO`;
//GET 节点趋势图-打开文件数
export const queryNodeFile = `${appConfig.apiPrefix}/monitorManage/resource/nodeFile`;
//GET 节点趋势图-网络socket
export const queryNodeSocket = `${appConfig.apiPrefix}/monitorManage/resource/nodeSocket`;
//GET 节点趋势图-网络流量
export const queryNodeNetWork = `${appConfig.apiPrefix}/monitorManage/resource/nodeNetWork`;
