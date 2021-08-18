import React, { useState, useEffect } from 'react';
import HeaderTabs from '../_components/header-tabs';
import MatrixPageContent from '@/components/matrix-page-content';
import UserCaseInfoExec from './use-case-info-exec';
import { history } from 'umi';
import { Col, Row, Tabs, Progress, Table } from 'antd';
import { getTestPhaseDetail } from '../service';
import { getRequest, postRequest } from '@/utils/request';
import { ContentCard, CardRowGroup, FilterCard } from '@/components/vc-page-content';
import './index.less';

export default function PlanInfo(props: any) {
  if (!history.location.state) {
    props.history.push('/matrix/test/workspace/test-plan');
    return null;
  }

  const { plan }: any = history.location.state;

  const [activeKey, setActiveKey] = useState<string>();
  const [testPhaseDetail, setTestPhaseDetail] = useState<any>({});

  useEffect(() => {
    if (!activeKey) return;
    getRequest(getTestPhaseDetail, { data: { phaseId: +activeKey } }).then((res) => {
      void setTestPhaseDetail(res.data);
    });
  }, [activeKey]);

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
        <ContentCard>测试用例树状选择？ 用例详情</ContentCard>
      </CardRowGroup>
    </MatrixPageContent>
  );
}
