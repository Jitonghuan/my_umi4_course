import { DeployInfoVO, IStatusInfoProps, DeployStatusType } from '@/pages/application/application-detail/types';

export interface IProps {
  appCode: string;
  envTypeCode: string;
  deployInfo: DeployInfoVO;
  deployedList: any[];
  appStatusInfo: IStatusInfoProps[];
  onOperate: (type: OperateType) => void;
}

// 执行步骤组合
export interface StepsProps {
  deployInfo: DeployInfoVO;
  onOperate: (type: OperateType) => void;
}

// 执行步骤组件
export interface StepItemProps {
  deployInfo: DeployInfoVO;
  onOperate: (type: OperateType) => void;
  deployStatus: DeployStatusType;
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
  | 'deleteFeatureRetryEnd'
  /** 批量退出 */
  | 'batchExitStart'
  | 'batchExitEnd';
