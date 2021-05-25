import { ReactNode } from 'react';
import { OperateType as StepOperateType } from './prod-steps/types';

export interface IProps {
  appCode: string;
  env: string;
  deployInfo: Record<string, any>;
  deployedList: any[];
  onOperate: (type: OperateType) => void;
}

export type OperateType =
  | StepOperateType
  /** 批量退出 */
  | 'batchExitStart'
  | 'batchExitEnd';
