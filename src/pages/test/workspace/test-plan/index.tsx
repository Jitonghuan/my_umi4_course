import React, { useState, useEffect } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';
import AddTestPlanDrawer from './add-test-plan-drawer';
import AssociatingCaseDrawer from './associating-case-drawer';
import { getRequest, postRequest } from '@/utils/request';
import { getTestPlanList, deleteTestPlan, getProjects } from '../service';
import { Form, Button, Table, Input, Select, Space, message, Popconfirm, Cascader, Tag } from 'antd';
import { testPlanStatusEnum } from '../constant';
import * as HOOKS from '../hooks';
import './index.less';
import _ from 'lodash';

export default function TestPlan(props: any) {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [planOpVisible, setPlanOpVisible] = useState(false);
  const [associatingVisible, setAssociatingVisible] = useState(false);
  const [curSelectPlan, setCurSelectPlan] = useState<null | string>(null);
  const [projectList, setProjectList] = useState<any[]>([]);
  const [projectTreeData] = HOOKS.useProjectTreeData();
  const [formData, setFormData] = useState<any>({});
  const [form] = Form.useForm();

  useEffect(() => {
    getRequest(getProjects).then((res) => {
      void setProjectList(res.data.dataSource);
    });
  }, []);

  useEffect(() => {
    void updateTable(pageIndex, pageSize);
  }, [pageIndex, pageSize]);

  const updateTable = async (_pageIndex: number = pageIndex, _pageSize: number = pageSize, _formData = formData) => {
    void setLoading(true);
    const formData = _formData;
    const res = await getRequest(getTestPlanList, {
      data: {
        ...formData,
        pageIndex: _pageIndex,
        pageSize: _pageSize,
        projectId: formData.demandId?.[0] && +formData.demandId[0],
        demandId: formData.demandId?.[1] && +formData.demandId[1],
        subDemandId: formData.demandId?.[2] && +formData.demandId[2],
      },
    });
    void setLoading(false);
    const { dataSource, pageInfo } = res.data;
    void setDataSource(dataSource);
    void setPageIndex(pageInfo.pageIndex);
    void setPageSize(pageInfo.pageSize);
    void setTotal(pageInfo.total);
  };

  const handleAddTestPlanBtnClick = () => {
    void setCurSelectPlan(null);
    void setPlanOpVisible(true);
  };

  const handleEditTestPlanBtnClick = (plan: any) => {
    void setCurSelectPlan(plan);
    void setPlanOpVisible(true);
  };

  const handleDeleteTestPlanBtnClick = async (planId: string) => {
    void (await postRequest(deleteTestPlan, { data: { id: planId } }));
    void message.success('删除成功');
    void updateTable();
  };

  const handleAssociatingCaseBtnClick = (plan: any) => {
    void setCurSelectPlan(plan);
    void setAssociatingVisible(true);
  };

  // const handleResetFilterFormData = () => {
  //   void form.resetFields();
  //   void updateTable();
  // };

  const handleFilterDataList = (data: any) => {
    void setFormData(data);
    void updateTable(1, pageSize, data);
  };

  return (
    <PageContainer className="test-workspace-test-plan">
      <HeaderTabs activeKey="test-plan" history={props.history} />
      <ContentCard>
        <div className="search-header">
          <Form form={form} layout="inline" onFinish={handleFilterDataList} onReset={() => handleFilterDataList({})}>
            <Form.Item label="项目/需求" name="demandId">
              <Cascader expandTrigger="hover" changeOnSelect placeholder="请选择" options={projectTreeData} />
            </Form.Item>

            <Form.Item label="任务名称" name="taskName">
              <Input placeholder="请输入任务名称" />
            </Form.Item>

            <Form.Item label="计划名称" name="planName">
              <Input placeholder="请输入计划名称" />
            </Form.Item>

            <Form.Item label="状态" name="status">
              <Select className="w-80" placeholder="请选择" allowClear options={testPlanStatusEnum} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="reset">
                重置
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div className="add-test-paln-btn-container">
          <Button type="primary" onClick={handleAddTestPlanBtnClick}>
            新增测试计划
          </Button>
        </div>

        <div className="test-plan-table">
          <Table
            rowKey="id"
            dataSource={dataSource}
            loading={loading}
            pagination={{
              current: pageIndex,
              total,
              pageSize,
              showSizeChanger: true,
              onChange: (next) => setPageIndex(next),
              onShowSizeChange: (_, next) => setPageSize(next),
            }}
          >
            <Table.Column title="ID" width={80} dataIndex="id" />
            <Table.Column title="所属" dataIndex="projectName" />
            <Table.Column title="任务名称" dataIndex="jiraTask" />
            <Table.Column
              title="计划名称"
              dataIndex="name"
              render={(planName, record: any) => (
                <Button
                  type="link"
                  onClick={() =>
                    props.history.push({
                      pathname: '/matrix/test/workspace/plan-info',
                      state: {
                        plan: record,
                      },
                    })
                  }
                  disabled={!record.phaseCollection?.length}
                >
                  {planName}
                </Button>
              )}
            />
            <Table.Column
              title="状态"
              dataIndex="status"
              render={(status) => <Tag color={testPlanStatusEnum[status].type}>{testPlanStatusEnum[status].title}</Tag>}
            />
            {/* <Table.Column title="当前责任人" dataIndex="?" /> */}
            <Table.Column
              width={240}
              title="操作"
              render={(record: any) => (
                <div>
                  <Space>
                    <Button type="link" onClick={() => handleEditTestPlanBtnClick(record)}>
                      编辑
                    </Button>
                    <Popconfirm
                      placement="topRight"
                      title={'确定删除此计划吗？'}
                      onConfirm={() => handleDeleteTestPlanBtnClick(record.id)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button type="link">删除</Button>
                    </Popconfirm>

                    <Button
                      type="link"
                      disabled={!record.phaseCollection?.length}
                      onClick={() => handleAssociatingCaseBtnClick(record)}
                    >
                      关联用例
                    </Button>
                  </Space>
                </div>
              )}
            />
          </Table>
          <AddTestPlanDrawer
            visible={planOpVisible}
            setVisible={setPlanOpVisible}
            plan={curSelectPlan}
            updateTable={updateTable}
            projectList={projectList}
          />
          <AssociatingCaseDrawer visible={associatingVisible} setVisible={setAssociatingVisible} plan={curSelectPlan} />
        </div>
      </ContentCard>
    </PageContainer>
  );
}
