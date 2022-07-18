export interface IProps {
  // 环境
  env: string;
  // npmName
  npmName?: string;
}

// 数据结构
export interface IRecord {
  id?: string;
  createUser?: string;
  gmtPublish?: string;

  [key: string]: any;
}
