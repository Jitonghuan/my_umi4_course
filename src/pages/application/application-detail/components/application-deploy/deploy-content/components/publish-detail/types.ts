import { ReactNode } from 'react';

export interface IProps {
  deployInfo: any;
  env: string;
  onOperate: (
    type:
      | 'deployNextEnvStart'
      | 'deployNextEnvEnd'
      | 'cancelDeployStart'
      | 'cancelDeployEnd',
  ) => void;
}
