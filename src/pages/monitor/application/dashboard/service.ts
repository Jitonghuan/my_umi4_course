import appConfig from '@/app.config';

//GET 节点趋势图-CPU
export const queryPodCpu = `${appConfig.apiPrefix}/monitorManage/app/cpuUseInfo`;
//GET 节点趋势图-内存
export const queryPodMem = `${appConfig.apiPrefix}/monitorManage/app/memUseInfo`;
//GET 节点趋势图-磁盘
export const queryPodDisk = `${appConfig.apiPrefix}/monitorManage/app/diskUseInfo`;
//GET 节点趋势图-网络速率
export const querynetWorkBps = `${appConfig.apiPrefix}/monitorManage/app/netWorkBps`;
