import { Moment } from 'moment';

/** 发布功能 */
export interface IFuncItem {
  key?: string;
  funcName?: string;
  envs?: string[] | string;
  coverageRange?: string;
  resolveNeeds?: string;
  preDeployTime?: Moment | string;
  demandId?: string;
  id?: string;
  deployStatus?: number;
  appCategoryCode?: string;
  appGroupCode?: string;
  deployTime?: string;
  createUser?: string;
  gmtCreate?: string;
  deployType?: string;
  funcId?: string;
}

/** 发布计划 */
export interface IPlanItem {
  id?: string;
  deployStatus?: number;
  appCategoryCode?: string;
  appGroupCode?: string;
  deployTime?: string;
  createUser?: string;
  gmtCreate?: string;
  deployType?: string;
  preDeployTime?: Moment | string;
  configs?: string;
  planId: string;
}

export interface InitValue {
  appCode?: string;
  version?: string;
  deployRelease?: string;
  dependcy?: string;
  developer?: string;
  tester?: string;
  deployer?: string;
  preDeployTime?: Moment;
}

export interface BaseFormProps {
  initValueObj?: InitValue;
  isCheck?: boolean;
}
