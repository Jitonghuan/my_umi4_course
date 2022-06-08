import React from 'react';
import { history } from 'umi';

// 表格 schema
export const createTableSchema = () => [
  {
    title: '发布Id',
    dataIndex: 'id',
  },
  {
    title: '发布人',
    dataIndex: 'modifyUser',
  },
  {
    title: '发布时间',
    dataIndex: 'deployedTime',
  },
  {
    title: '操作',
    dataIndex: 'operate',
    render: () => <a>详情</a>,
  },
];

// 发布记录字段 map
export const recordFieldMap: { [key: string]: string } = {
  id: '发布Id',
  modifyUser: '发布人',
  deployedTime: '发布时间',
  envs: '发布环境',
  deployStatus: '发布状态',
  jenkinsUrl: 'jenkins',
  features: '功能分支',
  releaseBranch: '发布分支',
  merge: 'git merge', // TODO
};
// 发布记录字段 map
export const recordFieldMapOut: { [key: string]: any } = {
  // id: '发布Id',
  modifyUser: '发布人',
  deployedTime: '发布时间',
  deployStatus: '发布状态',
  envs: '发布环境',

  // conflictFeature: '冲突分支',
  jenkinsUrl: 'jenkins',
  branchInfo: '功能分支',
  // releaseBranch: '发布分支',
  // version: '版本号',
  tagName: 'tag',
};
// export const recordDisplayMap: any = {
//   merging: { text: '正在合并', color: 'blue' },
//   mergeErr: { text: '合并错误', color: 'red' },
//   conflict: { text: '合并冲突', color: 'red' },
//   building: { text: '正在构建', color: 'blue' },
//   buildErr: { text: '构建错误', color: 'red' },
//   buildAborted: { text: '构建取消', color: 'orange' },
//   multiEnvDeploying: { text: '正在部署', color: 'geekblue' },
//   deployWait: { text: '等待部署', color: 'blue' },
//   deploying: { text: '正在部署', color: 'geekblue' },
//   deployWaitBatch2: { text: '等待第二批部署', color: 'green' },
//   deployErr: { text: '部署错误', color: 'red' },
//   deployAborted: { text: '部署取消', color: 'orange' },
//   deployed: { text: '部署完成', color: 'green' },
//   mergingMaster: { text: '正在合并Master', color: 'geekblue' },
//   mergeMasterErr: { text: '合并Master错误', color: 'red' },
//   deletingFeature: { text: '正在删除Feature', color: 'purple' },
//   deleteFeatureErr: { text: '删除Feature错误', color: 'red' },
//   deployFinish: { text: '发布完成', color: 'green' },
//   qualityChecking: { text: '质量检测中', color: 'geekblue' },
//   qualityFailed: { text: '质量检测失败', color: 'red' },
//   pushFeResource: { text: '正在推送前端资源', color: 'geekblue' },
//   pushFeResourceErr: { text: '推送前端资源错误', color: 'red' },
//   pushVersion: { text: '正在推送前端版本', color: 'geekblue' },
//   pushVersionErr: { text: '推送前端版本失败', color: 'red' },
//   verifyWait: { text: '等待灰度验证', color: 'geekblue' },
//   verifyFailed: { text: '灰度验证失败', color: 'red' },
// };

export const recordDisplayMap: any = {
  wait: { text: '发布开始', color: 'blue' },
  process: { text: '正在发布', color: 'geekblue' },
  error: { text: '发布失败', color: 'red' },
  finish: { text: '发布完成', color: 'green' },
};
