import React from 'react';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  RightCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';

export const bugStatusEnum = [
  { label: '新建', value: 0, backgroundColor: '#F3F8FC', color: '#1973CC' },
  { label: '修复中', value: 1, backgroundColor: '#F4F9F7', color: '#439D75' },
  { label: '已拒绝', value: 2, backgroundColor: '#FDF8F7', color: '#CC4631' },
  { label: '待验证', value: 3, backgroundColor: '#FCF7F3', color: '#D16F0D' },
  { label: '重复打开', value: 4, backgroundColor: '#F3F8FC', color: '#1973CC' },
  { label: '已关闭', value: 5, backgroundColor: '#EFF1F5', color: '#5F677A' },
  { label: '延期解决', value: 6, backgroundColor: '#FCF7F3', color: '#D16F0D' },
];
export const bugTypeEnum = ['功能问题', '性能问题', '接口问题', 'UI界面问题', '易用性问题', '需求问题'];
export const bugPriorityEnum = ['高', '中', '低'];
export const priorityEnum = [
  { label: 'P0', value: 'P0', color: '#CC4631' },
  { label: 'P1', value: 'P1', color: '#D16F0D' },
  { label: 'P2', value: 'P2', color: '#1973CC' },
  { label: 'P3', value: 'P3', color: '#439D75' },
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
export const testPlanStatusEnum = [
  {
    value: 0,
    title: '待执行',
    label: '待执行',
    type: 'default',
  },
  {
    value: 1,
    title: '执行中',
    label: '执行中',
    type: 'processing',
  },
  {
    value: 2,
    title: '已完成',
    label: '已完成',
    type: 'success',
  },
];
export const caseStatusEnum = [
  { label: '待执行', color: '#5F677A', icon: <ClockCircleOutlined />, value: '0' },
  { label: '执行通过', color: '#439D75', icon: <CheckCircleOutlined />, value: '1' },
  { label: '执行失败', color: '#CC4631', icon: <CloseCircleOutlined />, value: '2' },
  { label: '阻塞', color: '#FECD3A', icon: <SyncOutlined />, value: '3' },
  { label: '跳过', color: '#6C82AA', icon: <RightCircleOutlined />, value: '4' },
];

export const preconditionOptions = [
  { label: '用例', value: '0' },
  { label: '数据', value: '1' },
  { label: '其他', value: '2' },
];
