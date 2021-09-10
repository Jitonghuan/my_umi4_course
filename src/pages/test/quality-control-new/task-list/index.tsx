import React, { useState, useEffect, useMemo } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';
import { Button, Form, Table, Input, Select, Radio, Space } from 'antd';
import { HeartOutlined, HeartFilled, EditOutlined, PlayCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { getRequest, postRequest } from '@/utils/request';
import { getTaskInfo, taskCare, taskCareCancel, taskExcute, getTaskList, operateTask } from '../service';
import CreateOrEditTaskModal from './create-or-edit-task-modal';
import './index.less';

export default function taskList(props: any) {
  const [setCreateOrEditTaskModalVisible, setSetCreateOrEditTaskModalVisible] = useState<boolean>(false);
  const [curTask, setCurTask] = useState<any>();
  // const [taskList, setTaskList] = useState<any[]>();

  // useEffect(() => {
  //   getRequest(getTaskList).then((res) => {
  //     console.log('res :>> ', res);
  //   });
  // }, []);

  return (
    <PageContainer className="quality-control-task-list">
      <HeaderTabs activeKey="task-list" history={props.history} />
      <ContentCard>
        <div className="search-header">
          <Form layout="inline">
            <Form.Item>
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
            <Form.Item label="任务名称">
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
          <Button type="primary" onClick={() => setSetCreateOrEditTaskModalVisible(true)}>
            新建任务
          </Button>
        </div>
        <div className="task-list">
          <Table dataSource={[1, 2]}>
            <Table.Column title="任务名称" dataIndex="" />
            <Table.Column title="应用分类" dataIndex="" />
            <Table.Column title="应用code" dataIndex="" />
            <Table.Column title="最近执行时间" dataIndex="" />
            <Table.Column title="执行状态" dataIndex="" />
            <Table.Column title="检测结果" dataIndex="" />
            <Table.Column
              title="操作"
              render={() => {
                return (
                  <Space>
                    <HeartOutlined className="can-operate-el" />
                    <HeartFilled style={{ color: '#CC4631' }} className="can-operate-el" />
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
          visible={setCreateOrEditTaskModalVisible}
          setVisible={setSetCreateOrEditTaskModalVisible}
          task={curTask}
        />
      </ContentCard>
    </PageContainer>
  );
}
