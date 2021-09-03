import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
import UseCaseTestInfoExec from './use-case-test-info-exec';
import UserCaseInfoExec from './use-case-info-exec';
import CustomTree from '@/components/custom-tree';
import BugInfoExec from './bug-info-exec';
import CaseInfo from './case-info';
import moment from 'moment';
import { history } from 'umi';
import { testPhaseEnum, caseStatusEnum } from '../constant';
import { getTestPhaseDetail, getPhaseCaseTree, getPhaseCaseDetail, getProjects } from '../service';
import { ContentCard, CardRowGroup, FilterCard } from '@/components/vc-page-content';
import { Col, Row, Tabs, Tag, Empty, Tooltip, Typography } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import { LeftOutlined } from '@ant-design/icons';
import './index.less';

export default function PlanInfo(props: any) {
  if (!history.location.state) {
    props.history.push('/matrix/test/workspace/test-plan');
    return null;
  }

  const { plan }: any = history.location.state;

  const [activeKey, setActiveKey] = useState<string>();
  const [testPhaseDetail, setTestPhaseDetail] = useState<any>({});
  const [testCaseTree, setTestCaseTree] = useState<any[]>();
  const [testCaseTreeLeafs, setTestCaseTreeLeafs] = useState<any[]>([]);
  const [curCaseId, setCurCaseId] = useState<any>();
  const [curCase, setCurCase] = useState<any>();
  const [expendedKeys, setExpendedKeys] = useState<React.Key[]>([]);
  const [projectList, setProjectList] = useState<any[]>([]);

  const updateCurCase = () => {
    getRequest(getPhaseCaseDetail, {
      data: {
        phaseId: activeKey,
        caseId: curCaseId,
      },
    }).then((res) => {
      void setCurCase(res.data);
    });
  };

  const updateTestCaseTree = () => {
    if (!activeKey) return;
    void getRequest(getPhaseCaseTree, { data: { phaseId: +activeKey } }).then((res) => {
      const phaseCaseTree = res.data || [];
      const allLeafs = [];
      const Q = [...phaseCaseTree];
      while (Q.length) {
        const cur = Q.shift();
        if (cur.children?.length) Q.push(...cur.children);
        else allLeafs.push(cur.key);
      }
      void setTestCaseTree(phaseCaseTree);
      void setTestCaseTreeLeafs(allLeafs);
    });
  };

  useEffect(() => {
    if (!activeKey) return;
    void setCurCaseId(undefined);
    void setCurCase(undefined);
    void setExpendedKeys([]);
    getRequest(getTestPhaseDetail, { data: { phaseId: +activeKey } }).then((res) => {
      void setTestPhaseDetail(res.data);
    });
    void updateTestCaseTree();
  }, [activeKey]);

  useEffect(() => {
    if (!curCaseId) return;
    void updateCurCase();
  }, [curCaseId]);

  useEffect(() => {
    void setActiveKey(plan?.phaseCollection?.[0]?.id.toString());
    getRequest(getProjects).then((res) => {
      void setProjectList(res.data.dataSource);
    });
  }, []);

  const updateBugList = () => {};

  const goBack = () => {
    history.push('/matrix/test/workspace/test-plan');
  };

  return (
    <PageContainer>
      <div className="back-btn-container">
        <div onClick={goBack} className="back-btn">
          <LeftOutlined /> <span className="back-btn-title">{plan.name}</span>
        </div>
      </div>
      <FilterCard className="layout-compact">
        <div className="tabs-container">
          <Tabs className="tabs" activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
            {plan?.phaseCollection?.map((item: any) => (
              <Tabs.TabPane tab={item.name} key={item.id}></Tabs.TabPane>
            ))}
          </Tabs>
        </div>
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
              {testPhaseDetail.phaseInfo?.status.toString() && (
                <Tag color={testPhaseEnum[testPhaseDetail.phaseInfo.status].type}>
                  {testPhaseEnum[testPhaseDetail.phaseInfo.status].title}
                </Tag>
              )}
            </Col>
          </Row>
          <Row className="ml-8">
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
          <Row className="ml-8">
            <Col className="mt-1x">
              <UserCaseInfoExec data={testPhaseDetail.executedInfo || {}} />
            </Col>
          </Row>
          <Row className="ml-8">
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
                  onSelect={(keys) => testCaseTreeLeafs.includes(keys[0]) && setCurCaseId(keys[0])}
                  selectedKeys={[curCaseId]}
                  onExpand={(expendedKeys) => setExpendedKeys(expendedKeys)}
                  expandedKeys={expendedKeys}
                  showIcon={false}
                  showSearch
                  showSideSelect
                  sideSelectPlaceholder="请选择"
                  sideSelectOptions={caseStatusEnum}
                  searchPlaceholder="搜索用例、用例库"
                  onSideSelectChange={(val) => {
                    console.log('val :>> ', val);
                  }}
                  titleRender={(node: any) => {
                    let renderTitle;

                    if (!node.isLeaf) renderTitle = node.title;
                    else
                      renderTitle = (
                        <div>
                          <span style={{ color: caseStatusEnum[node.status].color }}>
                            {caseStatusEnum[node.status].icon}
                          </span>{' '}
                          {node.title}
                        </div>
                      );

                    return (
                      <Tooltip placement="right" title={renderTitle}>
                        <Typography.Text style={{ maxWidth: '100%' }} ellipsis={{ suffix: '' }}>
                          {renderTitle}
                        </Typography.Text>
                      </Tooltip>
                    );
                  }}
                />
              </div>

              <div className="case-info-container">
                {curCase ? (
                  <CaseInfo
                    className="case-info"
                    testCaseTreeLeafs={testCaseTreeLeafs}
                    setCurCaseId={setCurCaseId}
                    phaseId={activeKey}
                    curCase={curCase}
                    updateCurCase={updateCurCase}
                    updateTestCaseTree={updateTestCaseTree}
                    plan={plan}
                    projectList={projectList}
                    updateBugList={updateBugList}
                  />
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="没有选择测试用例" />
                )}
              </div>
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="此测试阶段没有关联用例" />
          )}
        </ContentCard>
      </CardRowGroup>
    </PageContainer>
  );
}
