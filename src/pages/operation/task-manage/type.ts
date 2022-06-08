export interface KVProps {
  key: string;
  value?: string;
}

export interface jobContentProps {
  method?: string;
  params?: any;
  url?: string;
  password?:string;
}

export interface jobStatus {
  text?: string;
  color?: string;
}
////1正在执行，2执行成功，3执行失败 0没执行过

export const JOB_STATUS: Record<number, jobStatus> = {
  0: { text: '未曾执行', color: 'gray' },
  1: { text: '正在执行', color: 'yellow' },
  2: { text: '执行成功', color: 'green' },
  3: { text: '执行失败', color: 'red' },
};

export interface recordEditData extends Record<string, any> {
  jobCode: string;
  jobName: string;
  enable: number;
  noticeType: number;
  timeExpression: string;
  jobType: number;
  jobContent: any;
  Desc?: string;
  appCode: string;
  envCode: string;
  containers: string;
  command: string;
  nodeIp: string;
  account: string;
  password: string;
  url: string;
  method: string;
  body: string;
  params: any;
  host: string;
  port: string;
  databaseName: string;
  sql: string;
  gmtCreate: string
  gmtModify: string
  id: number
  lastExecStatus: number
  modifyUser: string
}
