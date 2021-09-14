import React, { useState, useEffect } from 'react';
import { Modal, Table, Select, Checkbox, DatePicker, Input, Button } from 'antd';
import { operateTask } from '../../service';
import { postRequest, getRequest } from '@/utils/request';

interface IResultModal {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  taskId: any;
}

const resultTableDescribe = [
  {
    title: '单测',
    name: '',
    children: [
      {
        title: '单测个数',
        name: '',
      },
      {
        title: '单测成功率',
        name: '',
        render: (val: string | number) => <span>{val}%</span>,
      },
      {
        title: '单测失败个数',
        name: '',
      },
      {
        title: '单测错误个数',
        name: '',
      },
      {
        title: '单测跳过个数',
        name: '',
      },
      {
        title: '行覆盖率',
        name: '',
        render: (val: string | number) => <span>{val}%</span>,
      },
      {
        title: '增量行覆盖率',
        name: '',
        render: (val: string | number) => <span>{val}%</span>,
      },
    ],
  },
  {
    title: '代码缺陷',
    name: 'unitTest',
    children: [
      {
        title: 'BUG',
        name: 'c',
      },
      {
        title: '新增BUG',
        name: '',
      },
      {
        title: '漏洞',
        name: 'e',
      },
      {
        title: '新增漏洞',
        name: 'e',
      },
      {
        title: '坏味道',
        name: 'e',
      },
      {
        title: '新增坏味道',
        name: 'e',
      },
    ],
  },
  {
    title: '其他',
    name: 'unitTest',
    children: [
      {
        title: '代码行',
        name: 'c',
      },
      {
        title: '新增代码行',
        name: '',
      },
      {
        title: '圈复杂度',
        name: 'e',
      },
    ],
  },
];

export default function ResultModal(props: IResultModal) {
  const { visible, setVisible, taskId } = props;

  useEffect(() => {
    console.log('taskId :>> ', taskId);
    if (visible && taskId) {
      getRequest(`${operateTask}/${taskId}/results`).then((res) => {
        console.log('res :>> ', res);
      });
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      maskClosable={false}
      onCancel={() => setVisible(false)}
      footer={<Button onClick={() => setVisible(false)}>关闭</Button>}
      title="任务结果"
    >
      <Table dataSource={resultTableDescribe} defaultExpandAllRows pagination={false}>
        <Table.Column dataIndex="title" title="指标" />
        <Table.Column dataIndex="name" title="当前值" />
        <Table.Column dataIndex="name" title="目标值" />
      </Table>
    </Modal>
  );
}
