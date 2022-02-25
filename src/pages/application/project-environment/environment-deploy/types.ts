import { ReactNode } from 'react';

export interface IProps {
  children: ReactNode;
  location: {
    pathname: string;
    query: {
      id: string;
      appCode: string;
    };
  };
  route: {
    name: string;
  };
}

export type EnvTypeCode = 'dev' | 'test' | 'pre' | 'prod';

/** 部署信息 */
export interface DeployInfoVO extends Record<string, any> {
  id: number;
  appCode: string;
  envTypeCode: EnvTypeCode;
  releaseBranch: string;
  features: string;
  unMergedFeatures: string;
  conflictFeature: string;
  mergeWebUrl: string;
  deployStatus: DeployStatusType;
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

/** 应用部署状态 */
export type DeployStatusType =
  // 合并 release
  | 'merging'
  | 'mergeErr'
  | 'conflict'
  // 单测卡点
  | 'qualityChecking'
  | 'qualityFailed'
  // 构建
  | 'building'
  | 'buildErr'
  | 'buildAborted'
  // 部署
  | 'deployWait'
  | 'deploying'
  | 'deployWaitBatch2'
  | 'deployErr'
  | 'deployAborted'
  // 推送前端资源
  | 'pushFeResource'
  | 'pushFeResourceErr'
  // 推送前端版本
  | 'pushVersion'
  | 'pushVersionErr'
  // 前端线上验证
  | 'verifyWait'
  | 'verifyFailed'
  | 'verifySuccess'
  // 合并主干
  | 'mergingMaster'
  | 'mergeMasterErr'
  // 删除分支
  | 'deletingFeature'
  | 'deleteFeatureErr'
  // 部署完成
  | 'deployFinish'
  | 'deployed'
  // 多环境发布状态
  | 'multiEnvDeploying'
  // 其他
  | 'other';
