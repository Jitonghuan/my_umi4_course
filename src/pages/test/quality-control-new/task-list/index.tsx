import React, { useState, useEffect, useContext } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';
import FELayout from '@cffe/vc-layout';
import { Button, Form, Table, Input, Select, Radio, Space, Tag, Typography } from 'antd';
import { HeartOutlined, HeartFilled, EditOutlined, PlayCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { getRequest, postRequest } from '@/utils/request';
import { getTaskInfo, taskCare, taskCareCancel, taskExcute, getTaskList, operateTask } from '../service';
import { taskStatusEnum } from '../constant';
import CreateOrEditTaskModal from './create-or-edit-task-modal';
import ResultModal from './result-modal';
import moment from 'moment';
import './index.less';
import * as HOOKS from '../hooks';

export default function taskList(props: any) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [CreateOrEditTaskModalVisible, setCreateOrEditTaskModalVisible] = useState<boolean>(false);
  const [resultModalVisible, setResultModalVisible] = useState<boolean>(false);
  const [curTask, setCurTask] = useState<any>();
  const [taskList, [pageIndex, setPageIndex], [pageSize, setPageSize], total, form, loadTaskList] = HOOKS.useTaskList();

  useEffect(() => {
    loadTaskList();
  }, [pageIndex, pageSize]);

  const handleTaskCareOperate = (id: string | number, isCare: boolean) => {
    postRequest((isCare ? taskCare : taskCareCancel) + '/' + id, {
      data: {
        currentUser: userInfo.userName,
      },
    }).then((res) => {
      if (res.success) loadTaskList();
    });
  };

  const handleSeeResult = (task: any) => {
    console.log('task :>> ', task);
    setCurTask(task);
    setResultModalVisible(true);
  };

  const handleSearch = () => {
    loadTaskList();
  };

  return (
    <PageContainer className="quality-control-task-list">
      <HeaderTabs activeKey="task-list" history={props.history} />
      <ContentCard>
        <div className="search-header">
          <Form form={form} layout="inline" onFinish={handleSearch}>
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
              <Select placeholder="请选择" />
            </Form.Item>
            <Form.Item label="应用code">
              <Select placeholder="请选择" />
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
                        className="can-operate-el"
                        onClick={() => handleTaskCareOperate(record.id, true)}
                      />
                    )}
                    <EditOutlined className="can-operate-el" />
                    <PlayCircleOutlined className="can-operate-el" />
                    <DeleteOutlined className="can-operate-el" />
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
        />
        <ResultModal visible={resultModalVisible} setVisible={setResultModalVisible} taskId={curTask?.id} />
      </ContentCard>
    </PageContainer>
  );
}
