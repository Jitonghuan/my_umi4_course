import React, { useState, useEffect, useContext } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';
import FELayout from '@cffe/vc-layout';
import { Button, Form, Table, Input, Select, Radio, Space, Tag, Typography, Popconfirm } from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  EditOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
  EditFilled,
} from '@ant-design/icons';
import { delRequest, getRequest, postRequest } from '@/utils/request';
import { getTaskInfo, taskCare, taskCareCancel, taskExcute, getTaskList, operateTask } from '../service';
import { taskStatusEnum } from '../constant';
import CreateOrEditTaskModal from './create-or-edit-task-modal';
import ResultModal from './result-modal';
import moment from 'moment';
import './index.less';
import * as HOOKS from '../hooks';
import * as APIS from '../service';

export default function taskList(props: any) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [CreateOrEditTaskModalVisible, setCreateOrEditTaskModalVisible] = useState<boolean>(false);
  const [resultModalVisible, setResultModalVisible] = useState<boolean>(false);
  const [curTask, setCurTask] = useState<any>();
  const [taskList, [pageIndex, setPageIndex], [pageSize, setPageSize], total, form, loadTaskList] = HOOKS.useTaskList();
  const [appCateOptions] = HOOKS.useAppCategoryOptions();
  const [appCodeOptions, setAppCodeOptions] = useState<IOption[]>();

  useEffect(() => {
    loadTaskList();
  }, [pageIndex, pageSize]);

  const handleTaskCareOperate = (id: number, isCare: boolean) => {
    postRequest((isCare ? taskCare : taskCareCancel) + '/' + id, {
      data: {
        currentUser: userInfo.userName,
      },
    }).then((res) => {
      if (res.success) loadTaskList();
    });
  };

  const handleSeeResult = (task: any) => {
    setCurTask(task);
    setResultModalVisible(true);
  };

  const handleSearch = () => {
    loadTaskList();
  };

  const deleteTask = (id: Number) => {
    delRequest(`${operateTask}/${id}`).then((res) => {
      loadTaskList();
    });
  };

  const carryTask = (id: Number) => {
    postRequest(taskExcute(id)).then((res) => {});
  };

  const openEditTask = (id: Number) => {
    setCreateOrEditTaskModalVisible(true);
    getRequest(`${operateTask}/${id}`).then((res) => {
      setCurTask(res.data);
    });
  };

  const getAppCodeByCategory = (value: any) => {
    getRequest(APIS.getAppInfoList, { data: { appCategoryCode: value } }).then((res) => {
      const source = res.data.dataSource.map((item: any) => ({
        label: item.appCode,
        value: item.appCode,
        data: item,
      }));
      setAppCodeOptions(source);
    });
  };

  return (
    <PageContainer className="quality-control-task-list">
      <HeaderTabs activeKey="task-list" history={props.history} />
      <ContentCard>
        <div className="search-header">
          <Form form={form} layout="inline" onFinish={handleSearch} initialValues={{ justCare: 0 }}>
            <Form.Item name="justCare">
              <Radio.Group
                options={[
                  { label: '所有', value: 0 },
                  { label: '收藏', value: 1 },
                ]}
                value={0}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>
            <Form.Item label="任务名称" name="keyword">
              <Input placeholder="任务名称关键字" />
            </Form.Item>
            <Form.Item label="应用分类">
              <Select
                placeholder="请选择"
                options={appCateOptions}
                onChange={(value) => {
                  getAppCodeByCategory(value);
                }}
              />
            </Form.Item>
            <Form.Item label="应用code">
              <Select placeholder="请选择" options={appCodeOptions} />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary">
                搜索
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="add-btn-container">
          <Button type="primary" onClick={() => setCreateOrEditTaskModalVisible(true)}>
            新建任务
          </Button>
        </div>
        <div className="task-list">
          <Table
            dataSource={taskList}
            pagination={{
              pageSize,
              current: pageIndex,
              total: total,
              onChange: (page, pageSz) => {
                setPageIndex(page);
                if (pageSize !== pageSz && pageSz !== undefined) {
                  setPageSize(pageSz);
                  setPageIndex(1);
                }
              },
              showTotal: (total) => `共 ${total} 条`,
            }}
          >
            <Table.Column
              title="任务名称"
              dataIndex="name"
              width="220"
              render={(name: string) => (
                <Typography.Text style={{ maxWidth: '220px' }} ellipsis={{ suffix: '' }}>
                  {name}
                </Typography.Text>
              )}
            />
            <Table.Column title="应用分类" dataIndex="categoryCode" />
            <Table.Column title="应用code" dataIndex="appCode" />
            <Table.Column
              title="最近执行时间"
              dataIndex="lastedExcuteTime"
              render={(time: string) => time?.length > 0 && moment(time).format('YYYY-MM-DD HH:mm:ss')}
            />
            <Table.Column
              title="执行状态"
              dataIndex="status"
              render={(status) =>
                taskStatusEnum[status] && <Tag color={taskStatusEnum[status].type}>{taskStatusEnum[status].label}</Tag>
              }
            />
            <Table.Column
              title="检测结果"
              render={(record: any) => (
                <Button type="link" onClick={() => handleSeeResult(record)}>
                  查看结果
                </Button>
              )}
            />
            <Table.Column
              title="操作"
              width={100}
              render={(record) => {
                return (
                  <Space>
                    {record.isCare ? (
                      <HeartFilled
                        style={{ color: '#CC4631' }}
                        className="can-operate-el"
                        onClick={() => handleTaskCareOperate(record.id, false)}
                      />
                    ) : (
                      <HeartOutlined
                        style={{ color: '#CC4631' }}
                        className="can-operate-el"
                        onClick={() => handleTaskCareOperate(record.id, true)}
                      />
                    )}
                    <EditFilled
                      style={{ color: '#236ADD' }}
                      className="can-operate-el"
                      onClick={() => {
                        openEditTask(record.id);
                      }}
                    />
                    <PlayCircleOutlined
                      style={{ color: '#3CC86A' }}
                      className="can-operate-el"
                      onClick={() => {
                        carryTask(record.id);
                      }}
                    />
                    <Popconfirm
                      title="确定删除这个任务吗?"
                      onConfirm={() => {
                        deleteTask(record.id);
                      }}
                      // onCancel={cancel}
                      okText="是"
                      cancelText="否"
                    >
                      <DeleteOutlined className="can-operate-el" />
                    </Popconfirm>
                  </Space>
                );
              }}
            />
          </Table>
        </div>
        <CreateOrEditTaskModal
          visible={CreateOrEditTaskModalVisible}
          setVisible={setCreateOrEditTaskModalVisible}
          task={curTask}
          setTask={setCurTask}
          handleSearch={handleSearch}
        />
        <ResultModal
          visible={resultModalVisible}
          setVisible={setResultModalVisible}
          taskId={curTask?.id}
          setTask={setCurTask}
        />
      </ContentCard>
    </PageContainer>
  );
}
