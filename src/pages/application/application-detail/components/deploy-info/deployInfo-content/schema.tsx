type statusTypeItem = {
  color: string;
  text: string;
};

export const LIST_STATUS_TYPE: Record<string, statusTypeItem> = {
  Running: { text: 'Running', color: 'green' },
  Succeeded: { text: 'Succeeded', color: 'cyan' },
  Pending: { text: 'Pending', color: 'gold' },
  Failed: { text: 'Failed', color: 'red' },
  Initializing: { text: 'Initializing', color: 'default' },
  NotReady: { text: 'NotReady', color: 'lime' },
  Unavailable: { text: 'Unavailable', color: 'red' },
  Scheduling: { text: 'Scheduling', color: 'geekblue' },
  Removing: { text: 'Removing', color: 'purple' },
  运行正常: { text: '运行正常', color: 'green' },
  已运行但健康检查异常: { text: '已运行但健康检查异常', color: 'yellow' },
  Terminated: { text: 'Terminated', color: 'default' },
  Waiting: { text: 'Waiting', color: 'yellow' },
  Unknown: { text: 'Unknown', color: 'red' },
};

type OperateStatusTypeItem = {
  color: string;
  tagText: string;
};

export const OPERATE_TYPE: Record<string, OperateStatusTypeItem> = {
  "podfiledownload": { tagText: '文件下载',color: 'geekblue'},
  "restartapp": { tagText: '重启应用',  color: "cyan"},
  "rollback": { tagText: '回滚应用',  color: 'purple'},
  "deletepod": { tagText: '删除Pod',  color: 'red'},
};
