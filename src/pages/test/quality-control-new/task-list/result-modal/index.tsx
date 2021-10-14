import React, { useState, useEffect } from 'react';
import { Modal, Table, Menu, Button } from 'antd';
import { operateTask } from '../../service';
import { getRequest } from '@/utils/request';
import moment from 'moment';
import './index.less';

interface IResultModal {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  taskId: any;
  setTask: React.Dispatch<React.SetStateAction<any>>;
}

const resultTableDescribe = [
  {
    title: '单测',
    curVal: '',
    key: 1,
    children: [
      {
        title: '单测个数',
        curVal: '',
      },
      {
        title: '单测成功率',
        curVal: '',
        render: (val: string | number) => <span>{val}%</span>,
      },
      {
        title: '单测失败个数',
        curVal: '',
      },
      {
        title: '单测错误个数',
        curVal: '',
      },
      {
        title: '单测跳过个数',
        curVal: '',
      },
      {
        title: '行覆盖率',
        curVal: '',
        render: (val: string | number) => <span>{val}%</span>,
      },
      {
        title: '增量行覆盖率',
        curVal: '',
        render: (val: string | number) => <span>{val}%</span>,
      },
    ],
  },
  {
    title: '代码缺陷',
    curVal: 'unitTest',
    key: 2,
    children: [
      {
        title: 'BUG',
        curVal: 'c',
      },
      {
        title: '新增BUG',
        curVal: '',
      },
      {
        title: '漏洞',
        curVal: 'e',
      },
      {
        title: '新增漏洞',
        curVal: 'e',
      },
      {
        title: '坏味道',
        curVal: 'e',
      },
      {
        title: '新增坏味道',
        curVal: 'e',
      },
    ],
  },
  {
    title: '其他',
    curVal: 'unitTest',
    key: 3,
    children: [
      {
        title: '代码行',
        curVal: 'c',
      },
      {
        title: '新增代码行',
        curVal: '',
      },
      {
        title: '圈复杂度',
        curVal: 'e',
      },
    ],
  },
];

export default function ResultModal(props: IResultModal) {
  const { visible, setVisible, taskId, setTask } = props;

  const [taskResults, setTaskResults] = useState<any[]>([]);

  const [curMenuKey, setCurMenuKey] = useState<any>('1');

  const [dataSource, setDataSource] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      getResultDataSource();
    }
  }, [visible, curMenuKey]);

  const getResultDataSource = () => {
    console.log(taskResults[0]);
    let tr = taskResults.length > 0 ? taskResults[Number(curMenuKey) - 1] : ({} as any);
    setDataSource([
      {
        title: '单测',
        curVal: '',
        key: 1,
        children: [
          {
            title: '单测个数',
            curVal: tr.utTotal,
          },
          {
            title: '单测成功率',
            curVal: tr.utPassRate,
            render: (val: string | number) => <span>{val}%</span>,
          },
          {
            title: '单测失败个数',
            curVal: tr.utFailed,
          },
          {
            title: '单测错误个数',
            curVal: tr.utError,
          },
          {
            title: '单测跳过个数',
            curVal: tr.utSkip,
          },
          {
            title: '行覆盖率',
            curVal: tr.coverage,
            render: (val: string | number) => <span>{val}%</span>,
          },
          {
            title: '增量行覆盖率',
            curVal: tr.newCoverage,
            render: (val: string | number) => <span>{val}%</span>,
          },
        ],
      },
      {
        title: '代码缺陷',
        curVal: 'unitTest',
        key: 2,
        children: [
          {
            title: 'BUG',
            curVal: tr.bugsTotal,
          },
          {
            title: '新增BUG',
            curVal: tr.newBugsTotal,
          },
          {
            title: '漏洞',
            curVal: tr.vulnerabilityTotal,
          },
          {
            title: '新增漏洞',
            curVal: tr.newVulnerability_total,
          },
          {
            title: '坏味道',
            curVal: tr.codeSmellsTotal,
          },
          {
            title: '新增坏味道',
            curVal: tr.newCodeSmellsTotal,
          },
        ],
      },
      {
        title: '其他',
        curVal: 'unitTest',
        key: 3,
        children: [
          {
            title: '代码行',
            curVal: tr.codeLines,
          },
          {
            title: '新增代码行',
            curVal: tr.newCodeLines,
          },
          {
            title: '圈复杂度',
            curVal: tr.complexity,
          },
        ],
      },
    ]);
  };

  useEffect(() => {
    if (visible && taskId) {
      getRequest(`${operateTask}/${taskId}/results`).then((res) => {
        console.log('res :>> ', res);
        if (res.success) setTaskResults(res.data);
      });
    }
  }, [visible]);

  return (
    <Modal
      width={740}
      visible={visible}
      maskClosable={false}
      onCancel={() => {
        setVisible(false);
        setTask(undefined);
      }}
      footer={
        <Button
          onClick={() => {
            setVisible(false);
            setTask(undefined);
          }}
        >
          关闭
        </Button>
      }
      title="任务结果"
    >
      <div className="result-modal-container">
        <Menu
          className="resultList"
          defaultSelectedKeys={[curMenuKey]}
          onSelect={({ key }) => {
            setCurMenuKey(key);
          }}
        >
          {taskResults.map((r: any, index: number) => {
            return (
              <Menu.Item key={`${index + 1}`}>
                <div>{r.gmtModify ? moment(r.gmtModify).format('YYYY-MM-DD HH:mm:ss') : '暂无时间'}</div>
                <div>{r.points || '暂无分数'}</div>
              </Menu.Item>
            );
          })}
        </Menu>
        <div className="resultInfo">
          <div className="result-summarize">
            质量分: 64.00 {'>='} 60.00 <Button type="link">执行日志</Button>
          </div>
          <Table
            dataSource={dataSource.length > 0 ? dataSource : resultTableDescribe}
            defaultExpandAllRows
            pagination={false}
          >
            <Table.Column dataIndex="title" title="指标" />
            <Table.Column dataIndex="curVal" title="当前值" />
            <Table.Column dataIndex="aimVal" title="目标值" />
          </Table>
        </div>
      </div>
    </Modal>
  );
}
