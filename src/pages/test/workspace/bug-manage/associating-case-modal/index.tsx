import React, { useState, useEffect, useContext } from 'react';
import { getRequest, postRequest } from '@/utils/request';
import { modifyPhaseCase } from '../../service';
import { Button, Tabs, Modal, message, Tree, Space, Spin } from 'antd';
import * as HOOKS from '../../hooks';
import FELayout from '@cffe/vc-layout';
import './index.less';

export default function AssociatingCaseModal(props: any) {
  const { plan, visible, setVisible } = props;
  const userInfo = useContext(FELayout.SSOUserInfoContext);

  const [curActivePhase, setCurActivePhase] = useState<string>();
  const [treeData, _checkedKeys, _expandedKeys, querySubNode] = HOOKS.useSelectedCaseTree(curActivePhase);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    setCheckedKeys(_checkedKeys);
    setExpandedKeys(_expandedKeys);
  }, [_checkedKeys, _expandedKeys]);

  useEffect(() => {
    if (visible) {
      void setCurActivePhase(plan?.phaseCollection?.[0].id.toString());
    }
  }, [visible]);

  const submit = () => {
    void postRequest(modifyPhaseCase, {
      data: {
        phaseId: curActivePhase,
        cases: checkedKeys,
        modifyUser: userInfo.userName,
      },
    }).then(() => {
      void message.success('关联成功');
      void setVisible(false);
    });
  };

  const submitAndContinue = () => {
    void postRequest(modifyPhaseCase, {
      data: {
        phaseId: curActivePhase,
        cases: checkedKeys,
        modifyUser: userInfo.userName,
      },
    }).then(() => {
      void message.success('关联成功');
    });
  };

  const onLoadData = async ({ id }: any) => {
    await querySubNode(id);
  };

  return (
    <Modal
      className="test-workspace-test-plan-add-test-plan-modal"
      visible={visible}
      width="650"
      title="关联用例"
      maskClosable={false}
      onCancel={() => setVisible(false)}
      footer={false}
    >
      <Tabs onChange={(key) => setCurActivePhase(key)} activeKey={curActivePhase}>
        {plan?.phaseCollection?.map((item: any) => (
          <Tabs.TabPane tab={item.name} key={item.id}>
            {!treeData?.length ? (
              <div
                style={{
                  width: '100%',
                  height: '400px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Spin tip="Loading..." />
              </div>
            ) : (
              <Tree
                loadData={onLoadData}
                checkable
                treeData={treeData}
                checkedKeys={checkedKeys}
                onCheck={(checkedKeys) => setCheckedKeys(checkedKeys as React.Key[])}
                expandedKeys={expandedKeys}
                onExpand={setExpandedKeys}
              />
            )}
          </Tabs.TabPane>
        ))}
      </Tabs>

      <div className="btn-container">
        <Space>
          <Button type="primary" onClick={submit}>
            确定
          </Button>
          <Button type="primary" onClick={() => setVisible(false)}>
            取消
          </Button>
        </Space>
      </div>
    </Modal>
  );
}
