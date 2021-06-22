import { ReactNode } from 'react';

export interface IProps {
  deployInfo: any;
  envTypeCode: string;
  nextEnvTypeCode?: string;
  onOperate: (
    type:
      | 'deployNextEnvStart'
      | 'deployNextEnvEnd'
      | 'deployNextEnvSuccess'
      | 'cancelDeployStart'
      | 'cancelDeployEnd',
  ) => void;
}
