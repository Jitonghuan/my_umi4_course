import appConfig from '@/app.config';

// 1 GET  查看环境集群信息
export const listEnvCluster = `${appConfig.apiPrefix}/appManage/deployInfo/listEnvCluster`;

// 2 GET 查看应用实例信息
export const queryInstanceListApi = `${appConfig.apiPrefix}/appManage/deployInfo/instance/list`;

// 3 GET 查看应用实例容器信息
export const listContainer = `${appConfig.apiPrefix}/appManage/deployInfo/instance/listContainer`;

// 4 查看应用实例容器日志
export const watchContainerLog = `${appConfig.apiPrefix}/appManage/deployInfo/instance/watchContainerLog`;

// 5 应用实例容器shell登陆
export const loadShell = `${appConfig.apiPrefix}/appManage/deployInfo/instance/shell`;

// 6 GET 应用实例容器内文件下载
export const fileDownload = `${appConfig.apiPrefix}/appManage/deployInfo/instance/container/fileDownload`;

// 7，POST 删除应用实例
export const deleteInstance = `${appConfig.apiPrefix}/appManage/deployInfo/instance/delete`;

// GET 查看deployment的事件
export const getListDeploymentEvent = `${appConfig.apiPrefix}/appManage/deployInfo/instance/listDeploymentEvent`;

// 9，GET 查看pod的事件
export const getListPodEvent = `${appConfig.apiPrefix}/appManage/deployInfo/instance/listPodEvent`;
