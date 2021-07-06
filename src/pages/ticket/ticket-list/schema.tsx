import React from 'react';
import { doUploadUrl } from '../service';
import type { ISchemaItem } from '@/components/schema-form/type';

// 默认选中类型
export const defaultChooseType = '运维权限申请';

// 过滤表单 schema
export const getFilterFormSchema = (typeEuumData: any[]) => ({
  theme: 'inline',
  isShowReset: false,
  labelColSpan: 3,
  schema: [
    {
      type: 'Select',
      props: {
        label: '分类',
        name: 'ticketType',
        required: false,
        options: typeEuumData,
      },
    },
    {
      type: 'Select',
      props: {
        label: '状态',
        name: 'status',
        required: false,
        options: [
          {
            label: '审批中',
            value: '1',
          },
          {
            label: '工单撤回',
            value: '2',
          },
          {
            label: '审批拒绝',
            value: '3',
          },
          {
            label: '审批通过执行成功',
            value: '4',
          },
          {
            label: '审批通过执行失败',
            value: '5',
          },
        ],
      },
    },
    {
      type: 'Input',
      props: {
        label: '单号查询',
        placeholder: '请输入工单号',
        name: 'ticketCode',
        required: false,
      },
    },
  ],
});

// 表格 schema
export const tableSchema = [
  {
    title: '工单号',
    dataIndex: 'ticketCode',
    width: 100,
  },
  {
    title: '标题',
    dataIndex: 'title',
    width: 200,
  },
  {
    title: '分类',
    dataIndex: 'ticketType',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'status',
    statusEnum: {
      '1': {
        text: '审批中',
        color: '#D16F0D',
      },
      '2': {
        text: '工单撤回',
        color: '#CC4631',
      },
      '3': {
        text: '审批拒绝',
        color: '#CC4631',
      },
      '4': {
        text: '审批通过执行成功',
        color: '#439D75',
      },
      '5': {
        text: '审批通过执行失败',
        color: '#CC4631',
      },
    },
    width: 100,
  },
  // {
  //   title: '审批人',
  //   dataIndex: 'modifyUser',
  //   width: 100,
  // },
];

// 新增工单
export const getTicketCreateSchema = ({
  typeEuumData = [],
  belongEnumData = [],
  businessEnumData = [],
  applyEnumData = [],
  isShowUpload = false,
}: any) => {
  const baseSchema: (ISchemaItem | any)[] = [
    {
      type: 'Radio',
      props: {
        label: '类型',
        name: 'ticketType',
        required: true,
        initialValue: defaultChooseType,
        options: typeEuumData,
      },
    },
    {
      type: 'Select',
      props: {
        mode: 'multiple',
        label: '申请项',
        name: 'ticketSubTypes',
        required: true,
        options: applyEnumData,
        showArrow: true,
      },
    },
    {
      type: 'Select',
      props: {
        label: '业务线',
        name: 'line',
        required: true,
        options: businessEnumData,
      },
    },
    {
      type: 'Custom',
      props: {
        label: '备注',
        name: 'remark',
        custom: 'remark',
        required: false,
        placeholder: '请输入备注',
      },
    },
  ];

  if (isShowUpload) {
    baseSchema.splice(1, 0, {
      type: 'Select',
      props: {
        label: '归属',
        name: 'belongs',
        mode: 'multiple',
        required: true,
        options: belongEnumData,
        showArrow: true,
      },
    });

    baseSchema.push({
      type: 'Custom',
      props: {
        label: '申请表',
        name: 'filename',
        required: false,
        custom: 'applyTable',
        url: doUploadUrl,
      },
    });
  }

  const baseColumns = {
    isShowReset: false,
    labelColSpan: 3,
    theme: 'basic',
    schema: baseSchema,
  };

  return baseColumns;
};

export const notifyData: (string | React.ReactNode)[] = [
  'DMS账号 申请来未来阿里云账号',
  '天台生产相关（RDS/EDAS/MQ）申请天台阿里云账号',
  '巍山生产相关（RDS/EDAS/MQ）申请巍山阿里云账号',
  <b style={{ color: '#666' }}>Jumpserver、Rancher 请先用ldap账号登录一次平台再申请权限</b>,
  // 'Rancher、VPN、JumpServer 的申请归属选来未来即可，并选择相应业务线',
  '钉钉审批结束后的申请结果会以邮件的形式发送至你的企业邮箱',
];
