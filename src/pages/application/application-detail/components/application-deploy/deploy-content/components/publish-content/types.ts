import { OperateType as StepOperateType } from './prod-steps/types';
import { IStatusInfoProps } from '../../types';

export interface IProps {
  appCode: string;
  envTypeCode: string;
  deployInfo: Record<string, any>;
  deployedList: any[];
  appStatusInfo: IStatusInfoProps[];
  onOperate: (type: OperateType) => void;
}

export type OperateType =
  | StepOperateType
  /** 批量退出 */
  | 'batchExitStart'
  | 'batchExitEnd';
