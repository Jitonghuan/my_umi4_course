import React, { useState, useEffect, useMemo } from 'react';
import MatrixPageContent from '@/components/matrix-page-content';
import UserCaseInfoExec from './use-case-info-exec';
import UseCaseTestInfoExec from './use-case-test-info-exec';
import BugInfoExec from './bug-info-exec';
import RichText from '@/components/rich-text';
import AddBugDrawer from '../bug-manage/add-bug-drawer';
import { createSona } from '@cffe/sona';
import { history } from 'umi';
import { Col, Row, Tabs, Progress, Table, Input, Select, Tag, Button, Space, Modal, Typography, Empty } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { getTestPhaseDetail, getPhaseCaseTree, getPhaseCaseDetail, getProjects } from '../service';
import { getRequest, postRequest } from '@/utils/request';
import { ContentCard, CardRowGroup, FilterCard } from '@/components/vc-page-content';
import CustomTree from '@/components/custom-tree';
import moment from 'moment';
import './index.less';

moment.locale('zh-cn');

const { Text } = Typography;

export default function PlanInfo(props: any) {
  if (!history.location.state) {
    props.history.push('/matrix/test/workspace/test-plan');
    return null;
  }

  const { plan }: any = history.location.state;

  const [activeKey, setActiveKey] = useState<string>();
  const [testPhaseDetail, setTestPhaseDetail] = useState<any>({});
  const [testCaseTree, setTestCaseTree] = useState<any[]>();
  const [curCaseId, setCurCaseId] = useState<any>();
  const [curCase, setCurCase] = useState<any>();
  const [expendedKeys, setExpendedKeys] = useState<React.Key[]>([]);
  const [associationBug, setAssociationBug] = useState<any[]>([]);
  const [associationBugModalVisible, setAssociationBugModalVisible] = useState<boolean>(false);
  const [addBugDrawerVisible, setAddBugDrawerVisible] = useState<boolean>(false);
  const [projectList, setProjectList] = useState<any[]>([]);
  const sona = useMemo(() => createSona(), []);

  useEffect(() => {
    if (!activeKey) return;
    void setCurCaseId(undefined);
    void setCurCase(undefined);
    void setExpendedKeys([]);
    getRequest(getTestPhaseDetail, { data: { phaseId: +activeKey } }).then((res) => {
      void setTestPhaseDetail(res.data);
    });

    void getRequest(getPhaseCaseTree, { data: { phaseId: +activeKey } }).then((res) => {
      const curCaseTree = Array.isArray(res.data) ? res.data : [];
      const Q = [...curCaseTree];
      while (Q.length) {
        const cur = Q.shift();
        cur.key = cur.id;
        cur.title = cur.name;
        cur.selectable = false;
        if (cur.subItems?.length) {
          cur.subItems = cur.subItems.filter((item: any) => item.subItems?.length || item.cases?.length);
          cur.children = cur.subItems;
          Q.push(...cur.subItems);
        } else if (cur.cases?.length) {
          cur.cases.forEach((item: any) => {
            item.key = item.id;
            item.isLeaf = true;
          });
          cur.children = cur.cases;
        }
      }
      void setTestCaseTree(curCaseTree || []);
    });
  }, [activeKey]);

  useEffect(() => {
    if (!curCaseId) return;
    getRequest(getPhaseCaseDetail, {
      data: {
        phaseId: activeKey,
        caseId: curCaseId,
      },
    }).then((res) => {
      void setCurCase(res.data);
    });
  }, [curCaseId]);

  useEffect(() => {
    void setActiveKey(plan?.phaseCollection?.[0].id.toString());
    getRequest(getProjects).then((res) => {
      void setProjectList(res.data.dataSource);
    });
  }, []);

  const updateBugList = () => {
    console.log('updateBugList');
  };

  return (
    <MatrixPageContent>
      <FilterCard className="layout-compact">
        <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
          {plan?.phaseCollection?.map((item: any) => (
            <Tabs.TabPane tab={item.name} key={item.id}></Tabs.TabPane>
          ))}
        </Tabs>
      </FilterCard>
      <CardRowGroup className="test-workspace-plan-info">
        <CardRowGroup.SlideCard width={312} className="left-card">
          <Row>
            <Col className="mt-1x left-cart-sub-title" push={1}>
              基本信息
            </Col>
          </Row>
          <Row>
            <Col className="mt-1x" span={1}></Col>
            <Col className="mt-1x left-cart-sub-sub-title" span={6}>
              负责人:
            </Col>
            <Col className="mt-1x">{testPhaseDetail.phaseInfo?.head}</Col>
          </Row>
          <Row>
            <Col className="mt-1x" span={1}></Col>
            <Col className="mt-1x left-cart-sub-sub-title" span={6}>
              开始时间:
            </Col>
            <Col className="mt-1x">
              {testPhaseDetail.phaseInfo?.startTime &&
                moment(testPhaseDetail.phaseInfo?.startTime).format('YYYY-MM-DD HH:mm:ss')}
            </Col>
          </Row>
          <Row>
            <Col className="mt-1x" span={1}></Col>
            <Col className="mt-1x left-cart-sub-sub-title" span={6}>
              结束时间:
            </Col>
            <Col className="mt-1x">
              {testPhaseDetail.phaseInfo?.endTime &&
                moment(testPhaseDetail.phaseInfo?.endTime).format('YYYY-MM-DD HH:mm:ss')}
            </Col>
          </Row>

          <Row className="mt-1x">
            <Col className="mt-1x left-cart-sub-title" span={8} push={1}>
              执行情况
            </Col>
            <Col className="mt-1x">
              <Tag color="processing">执行中</Tag>
            </Col>
          </Row>
          <Row className="ml-18">
            <Col className="mt-1x">
              <UseCaseTestInfoExec
                data={{
                  notTested: testPhaseDetail.executedInfo?.caseTotal - testPhaseDetail.executedInfo?.executed,
                  tested: testPhaseDetail.executedInfo?.executed,
                  total: testPhaseDetail.executedInfo?.caseTotal,
                }}
              />
            </Col>
          </Row>
          <Row className="ml-18">
            <Col className="mt-1x">
              <UserCaseInfoExec data={testPhaseDetail.executedInfo || {}} />
            </Col>
          </Row>
          <Row className="ml-18">
            <Col className="mt-1x">
              <BugInfoExec
                data={{
                  notFixed: testPhaseDetail.bugInfo?.bugTotal - testPhaseDetail.bugInfo?.closedNum,
                  fixed: testPhaseDetail.bugInfo?.closedNum,
                }}
              />
            </Col>
          </Row>
        </CardRowGroup.SlideCard>
        <ContentCard>
          {testCaseTree?.length ? (
            <div className="right-card">
              <div className="case-select-container">
                <CustomTree
                  treeData={testCaseTree || []}
                  onSelect={(keys) => setCurCaseId(keys[0])}
                  selectedKeys={[curCaseId]}
                  className="test-case-select-tree"
                  onExpand={(expendedKeys) => setExpendedKeys(expendedKeys)}
                  expandedKeys={expendedKeys}
                  showIcon={false}
                  showSearch
                  searchPlaceholder="搜索用例、用例库"
                />
              </div>

              <div className="case-info">
                <div className="case-header">
                  <div className="title-col">
                    <span className="case-title">#366319 用例名称</span>
                    <Select className="w-100 ml-auto"></Select>
                    <Button className="ml-20" icon={<UpOutlined />} />
                    <Button icon={<DownOutlined />} />
                  </div>

                  <div>
                    <span className="case-prop-title">优先级： </span>
                    {curCase?.caseInfo?.priority}
                    <span className="case-prop-title ml-18">所属模块：</span> {curCase?.caseInfo?.categoryId}
                  </div>
                </div>

                <div className="case-prop-title">前置条件:</div>
                <div>{curCase?.caseInfo?.precondition}</div>

                <div className="case-prop-title">步骤描述:</div>
                <Table dataSource={curCase?.caseInfo?.stepContent} bordered pagination={false}>
                  <Table.Column title="序号" render={(_: any, __: any, idx: number) => idx + 1} />
                  <Table.Column title="步骤描述" dataIndex="input" />
                  <Table.Column title="预期结果" dataIndex="output" />
                </Table>

                <div className="case-prop-title">用例备注:</div>
                <div>{curCase?.caseInfo?.comment}</div>

                <div className="case-prop-title">执行备注:</div>
                <RichText sona={sona} />

                <div className="bug-info">
                  <Tabs
                    defaultActiveKey="1"
                    tabBarExtraContent={
                      <Space>
                        <Button type="primary" ghost onClick={() => setAssociationBugModalVisible(true)}>
                          关联Bug
                        </Button>
                        <Button type="primary" ghost onClick={() => setAddBugDrawerVisible(true)}>
                          新增Bug
                        </Button>
                        <Button type="primary" ghost disabled>
                          一键提交
                        </Button>
                      </Space>
                    }
                  >
                    <Tabs.TabPane tab="关联Bug()" key="1">
                      <Table dataSource={associationBug}>
                        <Table.Column title="ID" dataIndex="" />
                        <Table.Column title="标题" dataIndex="" />
                        <Table.Column title="状态" dataIndex="" render={() => <Select></Select>} />
                        <Table.Column title="操作" render={() => <Button type="link">删除</Button>} />
                      </Table>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="活动日志" key="2">
                      {curCase?.records.map((item: any) => {
                        return (
                          <Row>
                            <Col span={17}>
                              <Text>{item.executeNote}</Text>
                            </Col>
                            <Col span={7} className="activity-log">
                              <Text type="secondary">{moment(item.gmtModify).fromNow()}</Text>
                            </Col>
                          </Row>
                        );
                      })}
                    </Tabs.TabPane>
                  </Tabs>
                </div>
              </div>
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="此测试阶段没有关联用例" />
          )}
        </ContentCard>
      </CardRowGroup>

      <Modal
        title="Bug列表"
        visible={associationBugModalVisible}
        onCancel={() => setAssociationBugModalVisible(false)}
        maskClosable={false}
        width={800}
      >
        <Input.Search className="test-workspace-plan-info-bug-list-search" />

        <Table>
          <Table.Column title="ID" width={72} />
          <Table.Column title="标题" width={442} />
          <Table.Column title="优先级" width={88} />
          <Table.Column title="创建人" width={96} />
        </Table>
      </Modal>

      <AddBugDrawer
        visible={addBugDrawerVisible}
        setVisible={setAddBugDrawerVisible}
        updateCaseTable={updateBugList}
        projectList={projectList}
      />
    </MatrixPageContent>
  );
}
