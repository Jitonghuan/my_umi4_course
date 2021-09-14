import React, { useState, useEffect } from 'react';
import { Modal, Table, Menu, Button } from 'antd';
import { operateTask } from '../../service';
import { postRequest, getRequest } from '@/utils/request';
import moment from 'moment';
import './index.less';

interface IResultModal {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  taskId: any;
}

const resultTableDescribe = [
  {
    title: '单测',
    name: '',
    key: 1,
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
    key: 2,
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
    key: 3,
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
    // if (visible && taskId) {
    //   getRequest(`${operateTask}/${taskId}/results`).then((res) => {
    //     console.log('res :>> ', res);
    //   });
    // }
  }, [visible]);

  return (
    <Modal
      width={740}
      visible={visible}
      maskClosable={false}
      onCancel={() => setVisible(false)}
      footer={<Button onClick={() => setVisible(false)}>关闭</Button>}
      title="任务结果"
    >
      <div className="result-modal-container">
        <Menu
          className="resultList"
          onSelect={({ key }) => {
            console.log('key :>> ', key);
          }}
        >
          <Menu.Item key="123123123123">
            <div>{moment().format('YYYY-MM-DD HH:mm:ss')}</div>
            <div>质量分: 64.00</div>
          </Menu.Item>
          <Menu.Item>
            <div>{moment().format('YYYY-MM-DD HH:mm:ss')}</div>
            <div>质量分: 64.00</div>
          </Menu.Item>
          <Menu.Item>
            <div>{moment().format('YYYY-MM-DD HH:mm:ss')}</div>
            <div>质量分: 64.00</div>
          </Menu.Item>
        </Menu>
        <div className="resultInfo">
          <div className="result-summarize">
            质量分: 64.00 {'>='} 60.00 <Button type="link">执行日志</Button>
          </div>
          <Table dataSource={resultTableDescribe} defaultExpandAllRows pagination={false}>
            <Table.Column dataIndex="title" title="指标" />
            <Table.Column dataIndex="name" title="当前值" />
            <Table.Column dataIndex="name" title="目标值" />
          </Table>
        </div>
      </div>
    </Modal>
  );
}
