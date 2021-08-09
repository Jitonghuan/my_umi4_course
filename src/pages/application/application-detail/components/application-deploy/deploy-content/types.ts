export interface IProps extends Record<string, any> {
  /** 环境参数 */
  envTypeCode: string;
  /** 部署下个环境成功回调 */
  onDeployNextEnvSuccess: () => void;
}

export interface IStatusInfoProps extends Record<string, any> {
  AppState: number;
  AppStateName: string;
  Eccid: string;
  Ip: string;
  PackageMd5: string;
  TaskState: number;
  TaskStateName: string;
}
