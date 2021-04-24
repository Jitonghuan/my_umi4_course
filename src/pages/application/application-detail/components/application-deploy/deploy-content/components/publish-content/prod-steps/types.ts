import { ReactNode } from 'react';

export interface IProps {
  appCode: string;
  deployInfo: Record<string, any>;
  onOperate: (type: OperateType) => void;
}

export type OperateType =
  /** 重试合并 */
  | 'mergeReleaseRetryEnd'
  /** 重新部署 */
  | 'retryDeployStart'
  | 'retryDeployEnd'
  /** 重试生产环境合并master */
  | 'mergeMasterRetryEnd'
  /** 重试生产环境删除feature分支 */
  | 'deleteFeatureRetryEnd';

export type Status =
  /** 创建任务 */
  | 0
  /** 合并release进行中 */
  | 1.1
  /** 合并release失败 */
  | 1.2
  /** 部署中 */
  | 2.1
  /** 部署失败 */
  | 2.2
  /** 合并master进行中 */
  | 3.1
  /** 合并master失败 */
  | 3.2
  /** 删除feature进行中 */
  | 4.1
  /** 删除feature失败 */
  | 4.2
  /** 发布完成 */
  | 6;
