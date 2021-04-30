import { ReactNode } from 'react';

export interface IProps {
  /** 环境参数 */
  env: string;
  /** 部署下个环境成功回调 */
  onDeployNextEnvSuccess: () => void;
}
