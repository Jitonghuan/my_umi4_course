import React, { useState, useEffect, useMemo } from 'react';
import HeaderTabs from '../_components/header-tabs';
import MatrixPageContent from '@/components/matrix-page-content';
import UserCaseInfoExec from './use-case-info-exec';
import UseCaseTestInfoExec from './use-case-test-info-exec';
import BugInfoExec from './bug-info-exec';
import RichText from '@/components/rich-text';
import { createSona } from '@cffe/sona';
import { history } from 'umi';
import { Col, Row, Tabs, Progress, Table, Input, Select, Tree, Tag } from 'antd';
import { getTestPhaseDetail, getPhaseCaseTree, getPhaseCaseDetail } from '../service';
import { getRequest, postRequest } from '@/utils/request';
import { ContentCard, CardRowGroup, FilterCard } from '@/components/vc-page-content';
import { useCaseTestInfoChartOptions } from './formatter';
import moment from 'moment';
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
            </div>
          </div>
        </ContentCard>
      </CardRowGroup>
    </MatrixPageContent>
  );
}
