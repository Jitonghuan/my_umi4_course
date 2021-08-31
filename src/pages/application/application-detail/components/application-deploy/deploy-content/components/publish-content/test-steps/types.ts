import { DeployInfoVO } from '@/pages/application/application-detail/types';

export interface IProps {
  envTypeCode?: string;
  deployInfo: DeployInfoVO;
  onOperate: (type: OperateType) => void;
}

export type OperateType =
  /** 重试合并 */
  | 'mergeReleaseRetryEnd'
  /** 部署 */
  | 'deployEnd'
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
  /** 单测执行中 */
  | 2.1
  /** 单测执行失败 */
  | 2.2
  /** 构建中 */
  | 3.1
  /** 构建失败 */
  | 3.2
  /** 部署中 */
  | 4.1
  /** 部署失败 */
  | 4.2
  /** 发布完成 */
  | 5;