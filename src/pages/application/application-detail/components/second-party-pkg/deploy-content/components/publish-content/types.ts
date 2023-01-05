import { ReactNode } from 'react';
import { OperateType as StepOperateType } from './prod-steps/types';

export interface IProps {
  appCode: string;
  envTypeCode: string;
  deployInfo: Record<string, any>;
  deployedList: any[];
  pipelineCode: string;
  onSpin: any;
  stopSpin: any;
  newPublish:any ;
  onOperate: (type: OperateType) => void;
}

export type OperateType =
  | StepOperateType
  /** 批量退出 */
  | 'batchExitStart'
  | 'batchExitEnd';
