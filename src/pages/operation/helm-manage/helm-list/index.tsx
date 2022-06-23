// 任务管理
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2022/04/1 14:15

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { history } from 'umi';
import { Input, Table, Form, Button, Space, Select } from 'antd';
import { PlusOutlined, RedoOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
// import CreateTaskModal from './create-task';
import { taskTableSchema } from '../schema';
// import ExecutionDetailsModal from './execution-details-Modal';
// import { useTaskList, useTaskImplementList, useDeleteTask, useUpdateTask } from './hooks';
// import { recordEditData } from './type';

// import './index.less';

type StatusTypeItem = {
  color: string;
  tagText: string;
};

const STATUS_TYPE: Record<string, StatusTypeItem> = {
  '0': { tagText: '正常', color: 'green' },
  '1': { tagText: '暂停', color: 'default' },
};

export default function DNSManageList(props: any) {
  //   const [tableLoading, taskTablePageInfo, taskTableSource, setTaskTableSource, setTaskTablePageInfo, getTaskList] =
  //     useTaskList();
  //   const [loading, pageInfo, source, setSource, setPageInfo, getTaskImplementList] = useTaskImplementList();
  //   const [delLoading, deleteTask] = useDeleteTask();
  const [executionDetailsMode, setExecutionDetailsMode] = useState<EditorMode>('HIDE');
  const [addTaskMode, setAddTaskMode] = useState<EditorMode>('HIDE');
  //   const [updateLoading, updateTaskManage] = useUpdateTask();
  const [taskForm] = Form.useForm();
  const [curRecord, setCurRecord] = useState<any>();
  const [createAppVisible, setCreateAppVisible] = useState(false);

  useEffect(() => {
    // getTaskList();
  }, []);

  const onFresh = () => {
    loadListData({ pageIndex: 1, pageSize: 20 });
  };

  //触发分页
  const pageSizeClick = (pagination: any) => {
    // setPageInfo({
    //   pageIndex: pagination.current,
    //   pageSize: pagination.pageSize,
    //   total: pagination.total,
    // });
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };

    loadListData(obj);
  };

  const loadListData = (params: any) => {
    let value = taskForm.getFieldsValue();
    // getTaskList({...params,...value});
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
        // await deleteTask({ jobCode: record?.jobCode }).then(() => {
        //   getTaskList();
        // });
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

        // updateTaskManage(paramsObj).then(() => {
        //     getTaskList();
        //   });
      },
    }) as any;
  }, []);

  return (
    <PageContainer>
      {/* <ExecutionDetailsModal
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
      /> */}

      <FilterCard>
        <div>
          <Form
            layout="inline"
            form={taskForm}
            onFinish={(values: any) => {
              //   getTaskList({
              //     ...values,
              //     pageIndex: 1,
              //     pageSize: 20,
              //   });
            }}
            onReset={() => {
              taskForm.resetFields();
              //   getTaskList({
              //     pageIndex: 1,
              //     // pageSize: pageSize,
              //   });
            }}
          >
            <Form.Item label="选择集群" name="clusterName">
              <Select placeholder="请输入任务Code" style={{ width: 290 }} />
            </Form.Item>
            <Form.Item label="命名空间" name="namespace">
              <Select placeholder="请输入任务Code" style={{ width: 290 }} />
            </Form.Item>
            <Form.Item label="名称：" name="releaseName">
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
            <h3>release列表</h3>
          </div>
          <div className="caption-right">
            <Space>
              {/* <RedoOutlined   onClick={onFresh} /> */}

              <Button
                type="primary"
                onClick={() => {
                  setCurRecord(undefined);
                  setAddTaskMode('ADD');
                }}
              >
                <PlusOutlined />
                创建
              </Button>
            </Space>
          </div>
        </div>
        <div>
          <Table
            columns={tableColumns}
            dataSource={[]}
            loading={false}
            pagination={
              {
                //   current: taskTablePageInfo.pageIndex,
                //   total: taskTablePageInfo.total,
                //   pageSize: taskTablePageInfo.pageSize,
                //   showSizeChanger: true,
                //   showTotal: () => `总共 ${taskTablePageInfo.total} 条数据`,
              }
            }
            onChange={pageSizeClick}
          ></Table>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
