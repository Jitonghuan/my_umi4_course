// 任务管理
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React, { useState, useCallback, useContext } from 'react';
import { Input, Button, Table, Tag, message, Popconfirm } from 'antd';
import { ThunderboltOutlined, ClockCircleOutlined } from '@ant-design/icons';
import FELayout from '@cffe/vc-layout';
import { ContentCard } from '@/components/vc-page-content';
import TaskEditor from '../_components/task-editor';
import * as APIS from '../service';
import { postRequest } from '@/utils/request';
import { EditorMode, TaskItemVO } from '../interfaces';
import { useTaskList } from './hooks';
import ReportList from './report-list';
import './index.less';

export default function TaskManager() {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [searchValue, setSearchValue] = useState('');
  const [keyword, setKeyword] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableSource, total, loading, reloadData] = useTaskList(keyword, pageIndex, pageSize);
  const [pendingIds, setPendingIds] = useState<number[]>([]);

  const [taskEditMode, setTaskEditMode] = useState<EditorMode>('HIDE');
  const [taskEditItem, setTaskEditData] = useState<TaskItemVO>();

  const [showReportItem, setShowReportItem] = useState<TaskItemVO>();

  const handleSearch = () => {
    setKeyword(searchValue);
    // 如果什么参数都没变且是第 1 页，则手动刷新，否则将页数置为 1 触发刷新
    searchValue === keyword && pageIndex === 1 ? reloadData() : setPageIndex(1);
  };

  const handleExecTask = useCallback(
    async (record: TaskItemVO, index: number) => {
      setPendingIds([...pendingIds, record.id]);

      try {
        await postRequest(APIS.executeTask, {
          data: {
            id: record.id,
            executeType: 0,
            suiteType: record.suiteType,
            executeUser: userInfo.userName,
          },
        });

        message.success('任务已开始执行');
        reloadData();
      } finally {
        const next = pendingIds.reduce((prev, curr) => {
          if (curr !== record.id) prev.push(curr);
          return prev;
        }, [] as number[]);

        setPendingIds(next);
      }
    },
    [tableSource, pendingIds],
  );

  const handleEditTask = useCallback(
    (record: TaskItemVO, index: number) => {
      setTaskEditData(record);
      setTaskEditMode('EDIT');
    },
    [tableSource],
  );

  // 删除任务
  const handleDelTask = useCallback(
    async (record: TaskItemVO, index: number) => {
      await postRequest(APIS.deleteTask, {
        data: { id: record.id },
      });

      message.success('任务已删除！');
      reloadData();
    },
    [tableSource],
  );

  const handleTaskEditorSave = () => {
    if (taskEditMode === 'ADD') {
      handleSearch();
    } else {
      reloadData();
    }
    setTaskEditMode('HIDE');
  };

  return (
    <ContentCard className="page-task-manager">
      <div className="header-caption">
        <Input.Search
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          enterButton
          style={{ width: 320 }}
          placeholder="输入关键词搜索"
        />
        <s className="flex-air"></s>
        <Button type="primary" onClick={() => setTaskEditMode('ADD')}>
          + 新增任务
        </Button>
      </div>
      <Table
        dataSource={tableSource}
        loading={loading}
        pagination={{
          pageSize,
          total,
          current: pageIndex,
          onChange: (next) => setPageIndex(next),
          showSizeChanger: true,
          onShowSizeChange: (_, size) => {
            setPageSize(size);
            setPageIndex(1);
          },
        }}
      >
        <Table.Column title="任务编号" dataIndex="id" width={80} />
        <Table.Column title="任务名称" dataIndex="name" />
        <Table.Column
          title="用例数"
          dataIndex="testSuite"
          width={90}
          render={(value: number[]) => value?.length || 0}
        />
        <Table.Column
          title="集合类型"
          dataIndex="suiteType"
          width={90}
          render={(value: number) => (value === 1 ? '场景' : value === 0 ? '用例' : '')}
        />
        <Table.Column
          title="执行机制"
          dataIndex="cron"
          width={100}
          render={(value: string) =>
            value ? (
              <>
                <ClockCircleOutlined /> 定时触发
              </>
            ) : (
              <>
                <ThunderboltOutlined /> 手动执行
              </>
            )
          }
        />
        <Table.Column
          title="状态"
          dataIndex="status"
          render={(value: number, record: TaskItemVO) =>
            value === 1 ? <Tag color="processing">执行中</Tag> : value === 0 ? <Tag color="default">待执行</Tag> : ''
          }
          width={90}
        />
        <Table.Column title="更新人" dataIndex="modifyUser" />
        <Table.Column title="更新时间" dataIndex="gmtCreate" width={180} />
        <Table.Column
          title="操作"
          render={(_, record: TaskItemVO, index) => {
            const reportCount = record.reportCount > 99 ? '99+' : record.reportCount ?? null;
            const showRecordTitle = reportCount !== null ? `查看报告(${reportCount})` : '查看报告';

            return (
              <div className="action-cell">
                {/* 状态为执行中时无法执行 */}
                {record.status === 1 || pendingIds.includes(record.id) ? (
                  <a data-disabled onClick={() => message.warning('当前任务已经在执行中')}>
                    执行
                  </a>
                ) : (
                  <Popconfirm title="确定要执行此任务？" onConfirm={() => handleExecTask(record, index)}>
                    <a>执行</a>
                  </Popconfirm>
                )}
                <a onClick={() => handleEditTask(record, index)}>编辑</a>
                <Popconfirm title="确定要删除此任务吗？" onConfirm={() => handleDelTask(record, index)}>
                  <a style={{ color: 'red' }}>删除</a>
                </Popconfirm>
                <a onClick={() => setShowReportItem(record)}>{showRecordTitle}</a>
              </div>
            );
          }}
          width={230}
        />
      </Table>
      <TaskEditor
        mode={taskEditMode}
        initData={taskEditItem}
        onClose={() => setTaskEditMode('HIDE')}
        onSave={handleTaskEditorSave}
      />

      <ReportList task={showReportItem} onClose={() => setShowReportItem(undefined)} />
    </ContentCard>
  );
}
