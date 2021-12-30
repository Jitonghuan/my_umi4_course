import React from 'react';

// 表格 schema
export const createTableSchema = () => [
  // {
  //   title: '发布Id',
  //   dataIndex: 'id',
  // },
  {
    title: '发布人',
    dataIndex: 'modifyUser',
  },
  {
    title: '发布时间',
    dataIndex: 'deployedTime',
  },
  {
    title: '发布状态',
    dataIndex: 'deployStatus',
  },
  {
    title: '操作',
    dataIndex: 'operate',
    render: () => <a>详情</a>,
  },
];

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

// 发布记录字段 map
export const recordFieldMap: { [key: string]: any } = {
  deployId: '发布Id',
  modifyUser: '发布人',
  deployedTime: '发布时间',
  envs: '发布环境',
  deployStatus: '发布状态',
  // conflictFeature: '冲突分支',
  jenkinsUrl: 'jenkins',
  tagName: 'tag',
  branchInfo: '功能分支',
  // releaseBranch: '发布分支',
  // version: '版本号',
};
// export const recordDisplayMap = [

//  { merging: '正在合并'},
//  {mergeErr: '合并错误'},
//  { conflict: '合并冲突'},
//   {building: '正在构建'},
//   {buildErr: '构建错误'},
//   {buildAborted: '构建取消'},
//   {deployWait: '等待部署'},
//   {deploying: '正在部署'},
//   {deployWaitBatch2: '等待第二批部署'},
//   {deployErr: '部署错误'},
//   {deployAborted: '部署取消'},
//   {deployed: '部署完成'},
//   {mergingMaster: '正在合并Master'},
//   {mergeMasterErr: '合并Master错误'},
//   {deletingFeature: '正在删除Feature'},
//   {deleteFeatureErr: '删除Feature错误'},
//   {deployFinish: '发布完成'},
//   {qualityChecking: '质量检测中'},
//   {qualityFailed: '质量检测失败'},
//   {pushFeResource: '正在推送前端资源'},
//   {pushFeResourceErr: '推送前端资源错误'},
//   {pushVersion: '正在推送前端版本'},
//   {pushVersionErr: '推送前端版本失败'},
//   {verifyWait: '等待灰度验证'},
//   {verifyFailed: '灰度验证失败'},

// ];
export const recordDisplayMap: any = {
  merging: { text: '正在合并', color: 'blue' },
  mergeErr: { text: '合并错误', color: 'red' },
  conflict: { text: '合并冲突', color: 'red' },
  building: { text: '正在构建', color: 'green' },
  buildErr: { text: '构建错误', color: 'red' },
  buildAborted: { text: '构建取消', color: 'cyan' },
  deployWait: { text: '等待部署', color: 'blue' },
  deploying: { text: '正在部署', color: 'green' },
  deployWaitBatch2: { text: '等待第二批部署', color: 'green' },
  deployErr: { text: '部署错误', color: 'red' },
  deployAborted: { text: '部署取消', color: 'lime' },
  deployed: { text: '部署完成', color: 'green' },
  mergingMaster: { text: '正在合并Master', color: 'geekblue' },
  mergeMasterErr: { text: '合并Master错误', color: 'red' },
  deletingFeature: { text: '正在删除Feature', color: 'purple' },
  deleteFeatureErr: { text: '删除Feature错误', color: 'red' },
  deployFinish: { text: '发布完成', color: 'green' },
  qualityChecking: { text: '质量检测中', color: 'geekblue' },
  qualityFailed: { text: '质量检测失败', color: 'red' },
  pushFeResource: { text: '正在推送前端资源', color: 'geekblue' },
  pushFeResourceErr: { text: '推送前端资源错误', color: 'red' },
  pushVersion: { text: '正在推送前端版本', color: 'geekblue' },
  pushVersionErr: { text: '推送前端版本失败', color: 'red' },
  verifyWait: { text: '等待灰度验证', color: 'geekblue' },
  verifyFailed: { text: '灰度验证失败', color: 'red' },
};
