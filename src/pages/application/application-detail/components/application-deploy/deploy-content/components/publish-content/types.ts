import { OperateType as StepOperateType } from './prod-steps/types';
import { DeployInfoVO, IStatusInfoProps } from '@/pages/application/application-detail/types';

export interface IProps {
  appCode: string;
  envTypeCode: string;
  deployInfo: DeployInfoVO;
  deployedList: any[];
  appStatusInfo: IStatusInfoProps[];
  onOperate: (type: OperateType) => void;
}

export type OperateType =
  | StepOperateType
  /** 批量退出 */
  | 'batchExitStart'
  | 'batchExitEnd';

export type DeployStatusEnum =
  // 合并 release
  | 'merging'
  | 'mergeErr'
  | 'conflict'
  // 单测卡点
  | 'qualityChecking'
  | 'qualityFailed'
  // 构建
  | 'building'
  | 'buildErr'
  | 'buildAborted'
  // 部署
  | 'deployWait'
  | 'deploying'
  | 'deployWaitBatch2'
  | 'deployErr'
  | 'deployAborted'
  // 推送前端资源
  | 'pushFeResource'
  | 'pushFeResourceErr'
  // 推送前端版本
  | 'pushVersion'
  | 'pushVersionErr'
  // 线上验证
  | 'verifyWait'
  | 'verifyFailed'
  // 合并主干
  | 'mergingMaster'
  | 'mergeMasterErr'
  // 删除分支
  | 'deletingFeature'
  | 'deleteFeatureErr'
  // 部署完成
  | 'deployFinish'
  | 'deployed';
