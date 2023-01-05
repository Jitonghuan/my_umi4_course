/** 数据库管理-新建数据库 */
export interface CreateDataBaseItem {
  clusterId: number;
  name: string;
  characterset: string;
  owner: string;
  accountId: number;
  description: string;
}
/** 账号管理-新建账号 */
export interface CreateAccountItem {
  clusterId: number;
  user: string;
  host: string;
  password: string;
  description: string;
}
/** 实例管理-新建实例 */
export interface CreateInstanceItem {
  name: string;
  instanceType: number;
  instanceId?:string;
  instanceVersion: string;
  clusterId: number;
  clusterRole: number;
  instanceHost: string;
  instancePort: string;
  manageUser: string;
  managePassword: string;
  description: string;
}

/** 实例管理-编辑实例 */
export interface UpdateInstanceItem {
  id: number;
  name: string;
  instanceType: number;
  instanceId?:string;
  instanceVersion: string;
  clusterId: number;
  clusterRole: number;
  instanceHost: string;
  instancePort: string;
  manageUser: string;
  managePassword: string;
  description: string;
}

/** 集群管理-创建集群 */
export interface CreateClusterItem {
  name: string;
  envCode: string;
  clusterType: number;
  slaveVipHost: string;
  slaveVipPort: string;
  masterVipHost: string;
  masterVipPort: string;
  description: string;
}
/** 集群管理-编辑集群 */
export interface UpdateClusterItem {
  id: number;
  name: string;
  envCode: string;
  clusterType: number;
  slaveVipHost: string;
  slaveVipPort: string;
  masterVipHost: string;
  masterVipPort: string;
  description: string;
}
