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

export const recordDisplayMap = {
  merging: '正在合并',
  mergeErr: '合并错误',
  conflict: '合并冲突',
  building: '正在构建',
  buildErr: '构建错误',
  buildAborted: '构建取消',
  deployWait: '等待部署',
  deploying: '正在部署',
  deployWaitBatch2: '等待第二批部署',
  deployErr: '部署错误',
  deployAborted: '部署取消',
  deployed: '部署完成',
  mergingMaster: '正在合并Master',
  mergeMasterErr: '合并Master错误',
  deletingFeature: '正在删除Feature',
  deleteFeatureErr: '删除Feature错误',
  deployFinish: '发布完成',
  qualityChecking: '质量检测中',
  qualityFailed: '质量检测失败',
  pushFeResource: '正在推送前端资源',
  pushFeResourceErr: '推送前端资源错误',
  pushVersion: '正在推送前端版本',
  pushVersionErr: '推送前端版本失败',
  verifyWait: '等待灰度验证',
  verifyFailed: '灰度验证失败',
};
