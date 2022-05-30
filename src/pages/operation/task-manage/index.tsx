// 任务管理
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2022/04/1 14:15

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { history } from 'umi';
import { Input, Table, Form, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import CreateTaskModal from './create-task';
import { taskTableSchema } from './schema';
import ExecutionDetailsModal from './execution-details-Modal';
import { useTaskList, useTaskImplementList, useDeleteTask, useUpdateTask } from './hooks';
import { recordEditData } from './type';

import './index.less';

type StatusTypeItem = {
  color: string;
  tagText: string;
};

const STATUS_TYPE: Record<string, StatusTypeItem> = {
  '0': { tagText: '正常', color: 'green' },
  '1': { tagText: '暂停', color: 'default' },
};

export default function DNSManageList(props: any) {
  const [tableLoading, taskTablePageInfo, taskTableSource, setTaskTableSource, setTaskTablePageInfo, getTaskList] =
    useTaskList();
  const [loading, pageInfo, source, setSource, setPageInfo, getTaskImplementList] = useTaskImplementList();
  const [delLoading, deleteTask] = useDeleteTask();
  const [executionDetailsMode, setExecutionDetailsMode] = useState<EditorMode>('HIDE');
  const [addTaskMode, setAddTaskMode] = useState<EditorMode>('HIDE');
  const [updateLoading, updateTaskManage] = useUpdateTask();
  const [taskForm] = Form.useForm();
  const [curRecord, setCurRecord] = useState<any>();
  const [createAppVisible, setCreateAppVisible] = useState(false);

  useEffect(() => {
    getTaskList();
  }, []);

  const handleEditEnv = useCallback(
    (record: recordEditData, index: number, type: any) => {
      setCurRecord(record);
      setTaskTableSource(taskTableSource);
    },
    [taskTableSource],
  );
  // const handleUpdateStatus = useCallback(
  //   (record: any) => {
  //     let newStatus: string = record.status === '0' ? '1' : '0';
  //     let paramObj = {
  //       envCode: currentEnvCode.envCode,
  //       id: record.id,
  //       status: newStatus,
  //     };
  //     updateDnsManage(paramObj).then(() => {
  //       loadListData({ pageIndex: pageInfo.pageIndex, pageSize: pageInfo.pageSize });
  //     });
  //     setRecordDataSource(dataSource);
  //   },
  //   [dataSource],
  // );

  //触发分页
  const pageSizeClick = (pagination: any) => {
    setPageInfo({
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };

    getTaskList(obj);
  };

  const loadListData = (params: any) => {
    let value = taskForm.getFieldsValue();
    // let paramObj = {
    //   [selectCascaderValue]: value.keyword,
    // };
    // getDnsManageList({ currentEnvCode, ...params,...value });
    // if (value) {
    //   getDnsManageList({ currentEnvCode, ...value, ...params });
    // } else {
    //   getDnsManageList({ currentEnvCode, ...params });
    // }
  };

  //删除数据
  const handleDelRecord = (record: any) => {
    let id = record.id;
    // deleteDnsManage({ envCode: currentEnvCode.envCode, id }).then(() => {
    //   loadListData({ pageIndex: pageInfo.pageIndex, pageSize: pageInfo.pageSize });
    //   // getDnsManageList({ currentEnvCode });
    // });
  };

  const handleSearch = () => {
    let value = taskForm.getFieldsValue();

    // getDnsManageList({ currentEnvCode, ...value });
  };

  // 表格列配置
  const tableColumns = useMemo(() => {
    return taskTableSchema({
      onEditClick: (record, index) => {
        setCurRecord(record);
        setAddTaskMode('EDIT');
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
        if (record?.enable === 1) {
          let paramsObj = {
            enable: record?.enable === 1 ? 0 : 1,
            jobName: record?.jobName,
            jobCode: record?.jobCode,
            noticeType: record?.noticeType,
            timeExpression: record?.timeExpression,
            jobType: record?.jobType,
            Desc: record?.Desc,
            jobContent: record?.jobContent,
          };
          updateTaskManage(paramsObj).then(() => {
            getTaskList();
          });
        }
      },
      // curRecord,
    }) as any;
  }, []);

  return (
    <PageContainer>
      <ExecutionDetailsModal
        mode={executionDetailsMode}
        curRecord={curRecord}
        // onSave={() => {
        //     setExecutionDetailsMode('HIDE');
        //   }}
        onClose={() => setExecutionDetailsMode('HIDE')}
      />
      <CreateTaskModal
        mode={addTaskMode}
        initData={curRecord}
        envCode={''}
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
                // pageSize: pageSize,
              });
            }}
          >
            <Form.Item label="任务Code：" name="taskCode">
              <Input placeholder="请输入任务Code" style={{ width: 290 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="ghost" htmlType="reset">
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
          </div>
        </div>
        <div>
          <Table columns={tableColumns} dataSource={taskTableSource} loading={tableLoading}></Table>
          {/* taskTableSchema  */}
        </div>
      </ContentCard>
    </PageContainer>
  );
}
