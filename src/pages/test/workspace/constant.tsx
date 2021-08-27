import React from 'react';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  RightCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';

export const bugStatusEnum = ['新建', '修复中', '已拒绝', '待验证', '重复打开', '已关闭', '延期解决'].map(
  (item, index) => ({
    value: index.toString(),
    label: item,
  }),
);
export const bugTypeEnum = ['功能问题', '性能问题', '接口问题', 'UI界面问题', '易用性问题', '需求问题'];
export const bugPriorityEnum = ['高', '中', '低'];
export const priorityEnum = [
  { label: 'P0', value: 'P0' },
  { label: 'P1', value: 'P1' },
  { label: 'P2', value: 'P2' },
  { label: 'P3', value: 'P3' },
];
export const testPhaseEnum = [
  {
    title: '待执行',
    type: 'default',
  },
  {
    title: '执行中',
    type: 'processing',
  },
  {
    title: '已完成',
    type: 'success',
  },
];
export const caseStatusEnum = ['待执行', '执行通过', '执行失败', '阻塞', '跳过'].map((item, index) => ({
  value: index.toString(),
  label: item,
}));
export const caseStatusTagEnum = [
  { label: '待执行', color: '#5F677A', icon: <ClockCircleOutlined /> },
  { label: '执行通过', color: '#439D75', icon: <CheckCircleOutlined /> },
  { label: '执行失败', color: '#CC4631', icon: <CloseCircleOutlined /> },
  { label: '阻塞', color: '#FECD3A', icon: <SyncOutlined /> },
  { label: '跳过', color: '#6C82AA', icon: <RightCircleOutlined /> },
];
