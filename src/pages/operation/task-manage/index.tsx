// 任务管理
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2022/04/1 14:15

import React, { useState, useEffect, useMemo } from 'react';
import { Input, Table, Form, Button, Space } from 'antd';
import { PlusOutlined, RedoOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import CreateTaskModal from './create-task';
import { taskTableSchema } from './schema';
import ExecutionDetailsModal from './execution-details-Modal';
import { useTaskList, useTaskImplementList, useDeleteTask, useUpdateTask } from './hooks';

export default function TaskManageList(props: any) {
  const [tableLoading, taskTablePageInfo, taskTableSource, getTaskList] = useTaskList();
  const [deleteTask] = useDeleteTask();
  const [executionDetailsMode, setExecutionDetailsMode] = useState<EditorMode>('HIDE');
  const [addTaskMode, setAddTaskMode] = useState<EditorMode>('HIDE');
  const [updateLoading, updateTaskManage] = useUpdateTask();
  const [taskForm] = Form.useForm();
  const [curRecord, setCurRecord] = useState<any>();

  useEffect(() => {
    getTaskList();
  }, []);

  const onFresh = () => {
    loadListData({ pageIndex: 1, pageSize: 20 });
  };

  //触发分页
  const pageSizeClick = (pagination: any) => {
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };

    loadListData(obj);
  };

  const loadListData = (params: any) => {
    let value = taskForm.getFieldsValue();
    getTaskList({ ...params, ...value });
  };

  // 表格列配置
  const tableColumns = useMemo(() => {
    return taskTableSchema({
      onEditClick: (record, index) => {
        setCurRecord(record);
        setAddTaskMode('EDIT');
      },
      onViewClick: (record, index) => {
        setCurRecord(record);
        setAddTaskMode('VIEW');
      },
      onDelClick: async (record, index) => {
        await deleteTask({ jobCode: record?.jobCode }).then(() => {
          getTaskList();
        });
      },
      onGetExecutionDetailClick: (record, index) => {
        setCurRecord(record);
        setExecutionDetailsMode('VIEW');
      },
      onSwitchEnableClick: (record, index) => {
        let enable = record?.enable === 1 ? 2 : 1;
        let paramsObj = {
          ...record,
          enable: enable,
        };

        updateTaskManage(paramsObj).then(() => {
          getTaskList();
        });
      },
    }) as any;
  }, []);

  return (
    <PageContainer>
      <ExecutionDetailsModal
        mode={executionDetailsMode}
        curRecord={curRecord}
        onClose={() => setExecutionDetailsMode('HIDE')}
      />
      <CreateTaskModal
        mode={addTaskMode}
        initData={curRecord}
        onSave={() => {
          setAddTaskMode('HIDE');
          setTimeout(() => {
            getTaskList();
          }, 200);
        }}
        onClose={() => setAddTaskMode('HIDE')}
      />

      <FilterCard>
        <div>
          <Form
            layout="inline"
            form={taskForm}
            onFinish={(values: any) => {
              getTaskList({
                ...values,
                pageIndex: 1,
                pageSize: 20,
              });
            }}
            onReset={() => {
              taskForm.resetFields();
              getTaskList({
                pageIndex: 1,
              });
            }}
          >
            <Form.Item label="任务Code：" name="jobCode">
              <Input placeholder="请输入任务Code" style={{ width: 300 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="ghost" htmlType="reset" danger>
                重置
              </Button>
            </Form.Item>
          </Form>
        </div>
      </FilterCard>
      <ContentCard>
        <div className="table-caption">
          <div className="caption-left">
            <h3>任务列表</h3>
          </div>
          <div className="caption-right">
            <Space>
              <Button icon={<RedoOutlined />} onClick={onFresh}>
                刷新
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setCurRecord(undefined);
                  setAddTaskMode('ADD');
                }}
              >
                <PlusOutlined />
                创建任务
              </Button>
            </Space>
          </div>
        </div>
        <div>
          <Table
            columns={tableColumns}
            dataSource={taskTableSource}
            loading={tableLoading}
            pagination={{
              current: taskTablePageInfo.pageIndex,
              total: taskTablePageInfo.total,
              pageSize: taskTablePageInfo.pageSize,
              showSizeChanger: true,
              showTotal: () => `总共 ${taskTablePageInfo.total} 条数据`,
            }}
            onChange={pageSizeClick}
          ></Table>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
