import { ReactNode } from 'react';

export interface IProps {
  children: ReactNode;
  location: {
    pathname: string;
    query: {
      id: string;
      isClient: string;
      isContainClient: string;
      appType: string;
    };
  };
  route: {
    name: string;
  };
}

/** 部署信息 */
export interface DeployInfoVO extends Record<string, any> {
  id: number;
  appCode: string;
  envTypeCode: string;
  releaseBranch: string;
  features: string;
  unMergedFeatures: string;
  conflictFeature: string;
  mergeWebUrl: string;
  deployStatus: string;
  envs: string;
  deployedEnvs: string;
  deployingEnv: string;
  deployingEnvBatch: number;
  tagName: string;
  jenkinsUrl: string;
  image: string;
  jarPath: string;
  deployedTime: string;
  groupId: string;
  artifactId: string;
  version: string;
  deployType: number;
  isActive: number;
  deployErrInfo: string;
  createUser: string;
  modifyUser: string;
  gmtCreate: string;
  gmtModify: string;
}

/** 应用部署信息 */
export interface IStatusInfoProps {
  envCode?: string;
  envName?: string;
  appState: number;
  appStateName: string;
  eccid: string;
  ip: string;
  packageMd5: string;
  taskState: number;
  taskStateName: string;
}

/** 环境信息 */
export interface EnvDataVO extends Record<string, any> {
  id: number;
  envCode: string;
  envName: string;
  envTypeCode: string;
  categoryCode: string;
}
