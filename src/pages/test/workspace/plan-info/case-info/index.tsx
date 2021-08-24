import React, { useState, useMemo, useContext, useEffect } from 'react';
import { Col, Row, Tabs, Table, Input, Select, Tag, Button, Space, Modal, Typography, Empty, message } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import FELayout from '@cffe/vc-layout';
import { createSona } from '@cffe/sona';
import RichText from '@/components/rich-text';
import { caseStatusEnum } from '../../constant';
import { executePhaseCase } from '../../service';
import { getRequest, postRequest } from '@/utils/request';
import moment from 'moment';

moment.locale('zh-cn');

const { Text } = Typography;

export default function UserCaseInfoExec(props: any) {
  const { setAssociationBugModalVisible, setAddBugDrawerVisible, curCase, phaseId, testCaseTreeLeafs, setCurCaseId } =
    props;
  const userInfo = useContext(FELayout.SSOUserInfoContext);

  const [associationBug, setAssociationBug] = useState<any[]>([]);
  const [caseStatus, setCaseStatus] = useState<string>();
  const [execNoteReadOnly, setExecNoteReadOnly] = useState<boolean>(true);
  const [schema, setSchema] = useState();
  const sona = useMemo(() => createSona(), []);

  useEffect(() => {
    if (curCase && curCase.status !== undefined) {
      void setCaseStatus(curCase.status.toString());
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
    const loadEnd = message.loading('状态切换中');
    void (await changeCaseStatus(phaseId, curCase.caseInfo.id, caseStatus, executeNote));
    void loadEnd();
  };

  const handleCaseStatusChange = async (caseStatus: string) => {
    void (await handleCaseStatusSubmit(caseStatus));
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

  return (
    <div className="case-info">
      <div className="case-header">
        <div className="title-col">
          <span className="case-title">{curCase?.caseInfo?.title}</span>
          <Select
            className="w-100 ml-auto"
            value={caseStatus}
            onChange={handleCaseStatusChange}
            options={caseStatusEnum}
          ></Select>
          <Button className="ml-20" icon={<UpOutlined />} onClick={() => handleChangeCurCaseIdx(false)} />
          <Button icon={<DownOutlined />} onClick={() => handleChangeCurCaseIdx(true)} />
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
            {curCase?.records?.map((item: any) => {
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
  );
}
