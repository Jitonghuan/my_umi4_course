export interface DeployContentProps {
  /** 当前页面是否激活 */
  isActive?: boolean;
  /** 环境参数 */
  envTypeCode: string;
  // deployData:any
  /** 部署下个环境成功回调 */
  onDeployNextEnvSuccess: () => void;
  intervalStop: () => void;
  intervalStart: () => void;
  viewLogEnv: string;
  type: string;
  viewLogEnvType: string;
  // viewLogEnvType:string
}
