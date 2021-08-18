import React, { useState, useEffect, useMemo } from 'react';
import HeaderTabs from '../_components/header-tabs';
import MatrixPageContent from '@/components/matrix-page-content';
import UserCaseInfoExec from './use-case-info-exec';
import RichText from '@/components/rich-text';
import { createSona } from '@cffe/sona';
import { history } from 'umi';
import { Col, Row, Tabs, Progress, Table, Input, Select, Tree } from 'antd';
import { getTestPhaseDetail, getPhaseCaseTree, getPhaseCaseDetail } from '../service';
import { getRequest, postRequest } from '@/utils/request';
import { ContentCard, CardRowGroup, FilterCard } from '@/components/vc-page-content';
import './index.less';

const { DirectoryTree } = Tree;

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
      const curCaseTree = res.data;
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
  }, []);

  return (
    <MatrixPageContent className="test-workspace-plan-info">
      <FilterCard className="layout-compact">
        <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
          {plan?.phaseCollection?.map((item: any) => (
            <Tabs.TabPane tab={item.name} key={item.id}></Tabs.TabPane>
          ))}
        </Tabs>
      </FilterCard>
      <CardRowGroup>
        <CardRowGroup.SlideCard width={550} className="left-card">
          <Row>
            <Col className="mt-1x" push={1}>
              基本信息
            </Col>
          </Row>
          <Row>
            <Col className="mt-1x" span={3}></Col>
            <Col className="mt-1x" span={3}>
              负责人:
            </Col>
            <Col className="mt-1x">{testPhaseDetail.phaseInfo?.head}</Col>
          </Row>
          <Row>
            <Col className="mt-1x" span={3}></Col>
            <Col className="mt-1x" span={3}>
              开始时间:
            </Col>
            <Col className="mt-1x">{testPhaseDetail.phaseInfo?.startTime}</Col>
          </Row>
          <Row>
            <Col className="mt-1x" span={3}></Col>
            <Col className="mt-1x" span={3}>
              结束时间:
            </Col>
            <Col className="mt-1x">{testPhaseDetail.phaseInfo?.endTime}</Col>
          </Row>

          <Row className="mt-3x">
            <Col className="mt-1x" push={1} span={4}>
              执行情况
            </Col>
            <Col className="mt-1x">icon-执行中</Col>
          </Row>
          <Row>
            <Col className="mt-1x" span={3}></Col>
            <Col className="mt-1x" span={3}>
              用例总数:
            </Col>
            <Col className="mt-1x">{testPhaseDetail.executedInfo?.caseTotal}</Col>
          </Row>
          <Row>
            <Col className="mt-1x" span={3}></Col>
            <Col className="mt-1x" span={3}>
              已测用例:
            </Col>
            <Col className="mt-1x" span={18}>
              <Progress
                percent={
                  testPhaseDetail.executedInfo?.caseTotal
                    ? (testPhaseDetail.executedInfo?.executed / testPhaseDetail.executedInfo?.caseTotal) * 100
                    : 100
                }
              />
            </Col>
          </Row>
          <Row>
            <Col className="mt-1x" span={3}></Col>
            <Col className="mt-1x" span={3}>
              Bug情况:
            </Col>
            <Col className="mt-1x" span={18}>
              <Progress
                percent={
                  testPhaseDetail.bugInfo?.bugTotal
                    ? (testPhaseDetail.bugInfo?.closedNum / testPhaseDetail.bugInfo?.bugTotal) * 100
                    : 100
                }
              />
            </Col>
          </Row>
          <Row>
            <Col className="mt-1x" span={3}></Col>
            <Col className="mt-1x" span={3}>
              用例情况:
            </Col>
            <Col className="mt-1x">
              <UserCaseInfoExec data={testPhaseDetail.executedInfo || {}} />
            </Col>
          </Row>

          {/* <Row className="mt-3x">
            <Col className="mt-1x" push={1}>
              bug列表
            </Col>
          </Row>
          <Row>
            <Col className="mt-1x" span={3}></Col>
            <Col className="mt-1x" span={21}>
              <Table>
                <Table.Column title="ID" render={(_: any, idx: number) => idx + 1} />
                <Table.Column title="标题" />
                <Table.Column title="优先级" />
                <Table.Column title="创建人" />
              </Table>
            </Col>
          </Row> */}
        </CardRowGroup.SlideCard>
        <ContentCard>
          <div className="right-card">
            <div className="case-select-container">
              <div className="filter-bar">
                <Select>
                  <Select.Option value="1">全部状态</Select.Option>
                </Select>
                <Input.Search />
              </div>
              <DirectoryTree
                treeData={testCaseTree}
                onSelect={(keys) => setCurCaseId(keys[0])}
                selectedKeys={[curCaseId]}
                className="test-case-select-tree"
                onExpand={(expendedKeys) => setExpendedKeys(expendedKeys)}
                expandedKeys={expendedKeys}
                showIcon={false}
              />
            </div>

            <div className="case-info">
              <Row>
                <Col span={12}>优先级： {curCase?.caseInfo?.priority}</Col>
                <Col span={12}>所属模块： {curCase?.caseInfo?.categoryId}</Col>
              </Row>

              <div className="case-prop-title">前置条件</div>
              <Input.TextArea disabled value={curCase?.caseInfo?.precondition} />

              <div className="case-prop-title">步骤描述</div>
              <Table dataSource={curCase?.caseInfo?.stepContent} bordered pagination={false}>
                <Table.Column title="编号" render={(_: any, __: any, idx: number) => idx + 1} />
                <Table.Column title="步骤描述" dataIndex="input" />
                <Table.Column title="预期结果" dataIndex="output" />
              </Table>

              <div className="case-prop-title">用例备注</div>
              <Input.TextArea disabled value={curCase?.caseInfo?.comment} />

              <div className="case-prop-title">执行备注</div>
              <RichText sona={sona} />
            </div>
          </div>
        </ContentCard>
      </CardRowGroup>
    </MatrixPageContent>
  );
}
