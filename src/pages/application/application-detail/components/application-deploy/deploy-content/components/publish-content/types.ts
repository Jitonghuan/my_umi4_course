import { DeployInfoVO, IStatusInfoProps, DeployStatusType } from '@/pages/application/application-detail/types';
import { AppItemVO } from '@/pages/application/interfaces';

export interface IProps {
  appCode: string;
  envTypeCode: string;
  deployInfo: DeployInfoVO;
  deployedList: any[];
  appStatusInfo: IStatusInfoProps[];
  onOperate: (type: OperateType) => void;
  onSpin: any;
  stopSpin: any;
  pipelineCode: string;
  envList: any;
  loading: boolean;
  newPublish: boolean;
  // loadData: any;
  // refreshList: any;
}

// 执行步骤组合
export interface StepsProps {
  deployInfo: DeployInfoVO;
  appData?: AppItemVO;
  onOperate: (type: OperateType) => void;
  isFrontend?: boolean;
  onSpin: any;
  stopSpin: any;
  deployedList: any;
  onCancelDeploy?: (envCode: string) => void;
  getItemByKey: (listStr: string, envCode: string) => any;
}

// 执行步骤组件
export interface StepItemProps extends Record<string, any> {
  deployInfo: DeployInfoVO;
  onOperate: (type: OperateType) => void;
  deployStatus: DeployStatusType;
  envTypeCode: string;
  isFrontend?: boolean;
  pipelineCode: string;
  isEnvProject: boolean; //是否是项目环境中的步骤条
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
  | 'batchExitEnd'
  // 前端发布相关
  | 'restartAppStart'
  | 'restartAppEnd'
  | 'rePushFeResourceStart'
  | 'rePushFeResourceEnd'
  | 'rePushFeVersionStart'
  | 'rePushFeVersionEnd'
  | 'fePublishVerifyStart'
  | 'fePublishVerifyEnd'
  | 'rollbackFeAppStart'
  | 'rollbackFeAppEnd'
  // 解决冲突相关
  | 'mergeStart'
  | 'mergeEnd'
  // 流水线弹窗
  | 'pipelineEnd'
  | 'pipelineStart';
