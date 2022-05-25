export interface KVProps {
  key: string;
  value?: string;
}

export interface jobContentProps {
  method?: string;
  params?: any;
  url?: string;
}

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
}
