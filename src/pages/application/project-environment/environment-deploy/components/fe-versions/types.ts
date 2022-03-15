// fe versions types
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/04 22:59

export interface FeVersionItemVO {
  id: number;
  appCode: string;
  envCode: string;
  version: string;
  /** 是否活跃，1 不活跃，0 活跃 */
  isActive: 0 | 1;
  createUser: string;
  modifyUser: string;
  gmtCreate: string;
  gmtModify: string;
}