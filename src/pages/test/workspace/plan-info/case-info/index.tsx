import React, { useState, useMemo, useContext, useEffect } from 'react';
import { Col, Row, Tabs, Table, Input, Select, Tag, Button, Space, Modal, Typography, Empty, message } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import FELayout from '@cffe/vc-layout';
import { createSona } from '@cffe/sona';
import RichText from '@/components/rich-text';
import AssociationBugModal from '../association-bug-modal';
import AddBugDrawer from '../../bug-manage/add-bug-drawer';
import { caseStatusEnum, bugStatusEnum } from '../../constant';
import { executePhaseCase, relatedBug, modifyBug, addBug, getProjects } from '../../service';
import { getRequest, postRequest } from '@/utils/request';
import moment from 'moment';

moment.locale('zh-cn');

const { Text } = Typography;

export default function UserCaseInfoExec(props: any) {
  const {
    curCase,
    phaseId,
    testCaseTreeLeafs,
    setCurCaseId,
    className,
    updateCurCase,
    updateTestCaseTree,
    plan,
    projectList,
    updateBugList,
  } = props;
  const userInfo = useContext(FELayout.SSOUserInfoContext);

  const [addBugDrawerVisible, setAddBugDrawerVisible] = useState<boolean>(false);
  const [associationBug, setAssociationBug] = useState<any[]>([]);
  const [caseStatus, setCaseStatus] = useState<string>();
  const [execNoteReadOnly, setExecNoteReadOnly] = useState<boolean>(true);
  const [schema, setSchema] = useState();
  const sona = useMemo(() => createSona(), []);
  const [associationBugModalVisible, setAssociationBugModalVisible] = useState<boolean>(false);
  const [checkedBugs, setCheckedBugs] = useState<any[]>([]);
  const [caseNote, setCaseNote] = useState<any>();

  useEffect(() => {
    if (curCase) {
      curCase.status !== undefined && void setCaseStatus(curCase.status.toString());

      void setAssociationBug(curCase.bugs);

      const emptySchema = [
        {
          type: 'paragraph',
          children: [
            {
              text: '',
            },
          ],
        },
      ];
      // @ts-ignore
      void setSchema(emptySchema);
      // @ts-ignore
      void setCaseNote(emptySchema);
      try {
        curCase.executeNote?.length > 0 && void setSchema(JSON.parse(curCase.executeNote));
      } catch (e) {}
      try {
        curCase.caseInfo?.comment > 0 && void setCaseNote(JSON.parse(curCase.caseInfo.comment));
      } catch (e) {}
    }
  }, [curCase]);

  const changeCaseStatus = async (phaseId: number, caseId: number, status: string, executeNote?: string) => {
    const loadEnd = message.loading('正在修改用例状态');
    void (await postRequest(executePhaseCase, {
      data: {
        phaseId,
        caseId,
        status,
        executeNote,
        modifyUser: userInfo.userName,
      },
    }));
    void loadEnd();
  };

  const handleCaseStatusSubmit = async (caseStatus: string, executeNote?: string) => {
    if (!caseStatus) return;
    // const loadEnd = message.loading('状态切换中');
    void (await changeCaseStatus(phaseId, curCase.caseInfo.id, caseStatus, executeNote));
    void updateCurCase();
    void updateTestCaseTree();
    // void loadEnd();
  };

  const handleCaseStatusChange = async (caseStatus: string) => {
    void (await handleCaseStatusSubmit(caseStatus, JSON.stringify(sona.schema)));
    void setCaseStatus(caseStatus);
    void message.success('用例状态修改成功');
  };

  const handleSaveExecNote = async () => {
    void (await handleCaseStatusSubmit(caseStatus as string, JSON.stringify(sona.schema)));
    void setExecNoteReadOnly(true);
    void message.success('执行备注修改成功');
  };

  const handleCancelSaveExecNote = () => {
    // @ts-ignore
    void setSchema([
      {
        type: 'paragraph',
        children: [
          {
            text: '',
          },
        ],
      },
    ]);
    void setExecNoteReadOnly(true);
  };

  const handleChangeCurCaseIdx = (isToNext: boolean) => {
    const idx = testCaseTreeLeafs.findIndex((leaf: any) => leaf.id === curCase.caseInfo.id);
    const len = testCaseTreeLeafs.length;
    if (isToNext) void setCurCaseId(testCaseTreeLeafs[(idx + 1) % len].id);
    else void setCurCaseId(testCaseTreeLeafs[(idx - 1 + len) % len].id);
  };

  const mergeCheckedBugs2AssociationBugs = async (_checkedBugs = checkedBugs) => {
    const preBugIds = associationBug.map((bug) => bug.id);
    const curAssociationBugs = [...associationBug, ..._checkedBugs.filter((bug) => !preBugIds.includes(bug.id))];
    void setAssociationBug(curAssociationBugs);
    void (await postRequest(relatedBug, {
      data: {
        phaseId: phaseId,
        caseId: curCase.caseInfo.id,
        bugs: curAssociationBugs.map((bug) => bug.id),
      },
    }));
    void setCheckedBugs([]);
    void message.success('关联bug成功');
  };

  const handleDeleteAssociationBug = async (id: React.Key) => {
    const nextAssociationBugs = associationBug.filter((bug) => bug.id !== id);
    void setAssociationBug(nextAssociationBugs);
    void (await postRequest(relatedBug, {
      data: {
        phaseId: phaseId,
        caseId: curCase.caseInfo.id,
        bugs: nextAssociationBugs.map((bug) => bug.id),
      },
    }));
    void setCheckedBugs([]);
    void message.success('删除bug成功');
  };

  const handleBugStatusChange = (bugInfo: any, status: number) => {
    const loadEnd = message.loading('正在修改Bug状态');
    let relatedCases = [];
    try {
      relatedCases = JSON.parse(bugInfo.relatedCases);
    } catch (e) {}
    postRequest(modifyBug, {
      data: {
        ...bugInfo,
        status,
        desc: bugInfo.description,
        relatedCases: relatedCases,
        modifyUser: userInfo.userName,
      },
    }).then((res) => {
      void loadEnd();
      void message.success('修改Bug状态成功');
      void updateCurCase();
    });
  };

  const handleSmartSubmit = async () => {
    if (!curCase?.caseInfo) return;
    const finishLoading = message.loading('正在提交Bug');
    let desc = [];
    try {
      let caseDesc = JSON.parse(curCase.executeNote || '');
      if (!(caseDesc instanceof Array)) caseDesc = [];
      desc = [...caseDesc, ...sona.schema];
    } catch (e) {
      void finishLoading();
      void message.error('未知错误');
      return;
    }

    const requestParams = {
      name: `${curCase.caseInfo.title}--不符合预期结果`,
      // business: plan.projectId,
      projectId: +plan.projectId,
      demandId: +plan.demandId,
      subDemandId: +plan.subDemandId,
      priority: 1,
      bugType: 0,
      onlineBug: 0,
      phaseId,
      relatedCases: [curCase.caseInfo.id],
      desc: desc.length === 0 ? '' : JSON.stringify(desc),
      agent: userInfo.userName,
      status: '0',
      createUser: userInfo.userName,
    };
    const res = await postRequest(addBug, { data: requestParams }).finally(() => {
      void finishLoading();
    });

    if (!res) return;
    // @ts-ignore
    const newBugInfo = { ...requestParams, id: res.data.id };
    void setCheckedBugs([newBugInfo]);
    void (await mergeCheckedBugs2AssociationBugs([newBugInfo]));
    void updateCurCase();
    void message.success('一键提交成功');
  };

  return (
    <div className={className}>
      <div className="case-header">
        <div className="title-col">
          <span className="case-title">
            #{curCase?.caseInfo?.id} {curCase?.caseInfo?.title}
          </span>
          <Select
            className={
              'w-100 ml-auto ' + ['beExecuted', 'executeSuccess', 'executeFailure', 'block', 'pass'][+(caseStatus || 0)]
            }
            value={caseStatus}
            onChange={handleCaseStatusChange}
          >
            {caseStatusEnum.map((item) => (
              <Select.Option value={item.value} style={{ background: item.color }}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
          <Button
            className="ml-20"
            icon={<UpOutlined style={{ color: '#5F677A' }} />}
            onClick={() => handleChangeCurCaseIdx(false)}
          />
          <Button icon={<DownOutlined style={{ color: '#5F677A' }} />} onClick={() => handleChangeCurCaseIdx(true)} />
        </div>

        <div>
          <span className="case-prop-title">优先级:</span> {curCase?.caseInfo?.priority}
          <span className="case-prop-title ml-20">所属模块:</span> {plan.projectName}
        </div>
      </div>

      <div className="case-body">
        <div className="case-prop-title">前置条件:</div>
        <div className="mh-40">{curCase?.caseInfo?.precondition}</div>

        <div className="case-prop-title mt-12">步骤描述:</div>
        <Table dataSource={curCase?.caseInfo?.stepContent} bordered pagination={false}>
          <Table.Column title="序号" render={(_: any, __: any, idx: number) => idx + 1} />
          <Table.Column title="步骤描述" dataIndex="input" />
          <Table.Column title="预期结果" dataIndex="output" />
        </Table>

        <div className="case-prop-title mt-12">用例备注:</div>
        <RichText readOnly={true} schema={caseNote} />

        <div className="case-prop-title mt-12">执行备注:</div>
        <div className="executeNote">
          <RichText sona={sona} readOnly={execNoteReadOnly} schema={schema} />
          {!execNoteReadOnly ? (
            <div className="executeNote-btn-container">
              <Space>
                <Button type="primary" onClick={handleSaveExecNote}>
                  保存
                </Button>
                <Button onClick={handleCancelSaveExecNote}>取消</Button>
              </Space>
            </div>
          ) : (
            <div className="executeNote-btn-container">
              <Button type="primary" onClick={() => setExecNoteReadOnly(false)}>
                编辑
              </Button>
            </div>
          )}
        </div>

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
                <Button type="primary" ghost onClick={handleSmartSubmit}>
                  一键提交
                </Button>
              </Space>
            }
          >
            <Tabs.TabPane tab="关联Bug" key="1">
              <Table dataSource={associationBug}>
                <Table.Column title="ID" dataIndex="id" />
                <Table.Column title="标题" dataIndex="name" />
                <Table.Column
                  title="状态"
                  dataIndex="status"
                  render={(status, record: any) => (
                    <Select
                      value={+status}
                      options={bugStatusEnum}
                      onChange={(value) => handleBugStatusChange(record, value)}
                    ></Select>
                  )}
                />
                <Table.Column
                  title="操作"
                  render={(record: any) => (
                    <Button type="link" onClick={() => handleDeleteAssociationBug(record.id)}>
                      删除
                    </Button>
                  )}
                />
              </Table>
            </Tabs.TabPane>
            <Tabs.TabPane tab="活动日志" key="2">
              {curCase?.records?.length ? (
                curCase.records.map((item: any) => {
                  return (
                    <Row style={{ width: '100%', overflow: 'hidden' }}>
                      <Col span={17}>
                        <Text>
                          {item.createUser} 执行了用例，状态为：{caseStatusEnum[item.status].label}
                        </Text>
                      </Col>
                      <Col span={7} className="activity-log">
                        <Text type="secondary">{moment(item.gmtModify).fromNow()}</Text>
                      </Col>
                    </Row>
                  );
                })
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="没有活动日志" />
              )}
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>

      <AssociationBugModal
        associationBugModalVisible={associationBugModalVisible}
        setAssociationBugModalVisible={setAssociationBugModalVisible}
        checkedBugs={checkedBugs}
        setCheckedBugs={setCheckedBugs}
        mergeCheckedBugs2AssociationBugs={mergeCheckedBugs2AssociationBugs}
        associationBugs={associationBug}
      />

      <AddBugDrawer
        visible={addBugDrawerVisible}
        setVisible={setAddBugDrawerVisible}
        updateCaseTable={updateBugList}
        projectList={projectList}
        defaultRelatedCases={[curCase?.caseInfo.id]}
        phaseId={phaseId}
        onAddBug={(newBugInfo: any) => {
          void setCheckedBugs([newBugInfo]);
          void mergeCheckedBugs2AssociationBugs([newBugInfo]);
        }}
      />
    </div>
  );
}
