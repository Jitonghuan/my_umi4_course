export interface IProps {
  // 环境
  env: any;
  // appcode
  appCode?: string;
}

// 数据结构
export interface IRecord {
  id?: string;
  createUser?: string;
  gmtPublish?: string;

  [key: string]: any;
}
