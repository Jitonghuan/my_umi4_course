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
