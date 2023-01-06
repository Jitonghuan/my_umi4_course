import { ReactNode } from 'react';

export interface IProps {
  deployInfo: any;
  env: string;
  pipelineCode: string;
  newPublish:any;
  onOperate: (
    type: 'deployNextEnvStart' | 'deployNextEnvEnd' | 'deployNextEnvSuccess' | 'cancelDeployStart' | 'cancelDeployEnd',
  ) => void;
}
