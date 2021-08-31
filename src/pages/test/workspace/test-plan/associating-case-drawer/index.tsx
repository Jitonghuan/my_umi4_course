import React, { useState, useEffect, useContext } from 'react';
import { getRequest, postRequest } from '@/utils/request';
import { modifyPhaseCase, getTestPhaseDetail, getAllTestCaseTree, getPhaseCaseTree } from '../../service';
import { Button, Tabs, Drawer, message, TreeSelect, Space } from 'antd';
import FELayout from '@cffe/vc-layout';
import './index.less';

export default function AssociatingCaseDrawer(props: any) {
  const { plan, visible, setVisible } = props;
  const userInfo = useContext(FELayout.SSOUserInfoContext);

  const [testCaseTree, setTestCaseTree] = useState([]);
  const [curActivePhase, setCurActivePhase] = useState<string>();
  const [selectedTestPlanIds, setselectedTestPlanIds] = useState<React.Key[]>([]);

  const dataClean = (node: any): boolean => {
    node.key = node.id;
    node.title = node.name;

    const isLeaf = !node.subItems?.length;
    // 终点条件，叶子节点是否有cases
    if (isLeaf) {
      node.children = node.cases.map((node: any) => ({ ...node, key: node.id }));
      return !!node.children?.length;
    }

    node.children = [];
    node.subItems.forEach((subNode: any) => dataClean(subNode) && node.children.push(subNode));
    return !!node.children.length;
  };

  useEffect(() => {
    void getRequest(getAllTestCaseTree).then((res) => {
      const root = res.data;
      void dataClean(root);
      void setTestCaseTree(root.children);
    });
  }, []);

  useEffect(() => {
    if (visible) {
      void updateSelectTree(plan?.phaseCollection?.[0].id.toString());
      void setCurActivePhase(plan?.phaseCollection?.[0].id.toString());
    }
  }, [visible]);

  const updateSelectTree = (phaseId: number | string) => {
    void setCurActivePhase(phaseId.toString());
    void getRequest(getPhaseCaseTree, { data: { phaseId } }).then((res) => {
      const selected = [];
      const Q = [...(res.data.length ? res.data : [])];
      while (Q.length) {
        const cur = Q.shift();
        !cur.subItems?.length && selected.push(cur.id);
        cur.subItems?.length && Q.push(...cur.subItems);
      }
      void setselectedTestPlanIds(selected);
    });
  };

  const onSelectChange = (vals: React.Key[]) => {
    void setselectedTestPlanIds(vals);
  };

  const submit = () => {
    const loadFinish = message.loading('正在关联中');
    void postRequest(modifyPhaseCase, {
      data: {
        phaseId: curActivePhase,
        cases: selectedTestPlanIds,
        modifyUser: userInfo.userName,
      },
    }).then(() => {
      void loadFinish();
      void message.success('关联成功');
      void setVisible(false);
    });
  };

  const submitAndContinue = () => {
    const loadFinish = message.loading('正在关联中');
    void postRequest(modifyPhaseCase, {
      data: {
        phaseId: curActivePhase,
        cases: selectedTestPlanIds,
        modifyUser: userInfo.userName,
      },
    }).then(() => {
      void loadFinish();
      void message.success('关联成功');
    });
  };

  return (
    <Drawer
      className="test-workspace-test-plan-add-test-plan-drawer"
      visible={visible}
      width="650"
      title="关联用例"
      onClose={() => setVisible(false)}
    >
      <Tabs onChange={(key) => updateSelectTree(key)} activeKey={curActivePhase}>
        {plan?.phaseCollection?.map((item: any) => (
          <Tabs.TabPane tab={item.name} key={item.id}>
            <TreeSelect
              className="test-case-tree-select"
              treeData={testCaseTree}
              multiple
              treeCheckable
              placeholder="请选择用例集合"
              treeNodeLabelProp="title"
              treeNodeFilterProp="title"
              value={selectedTestPlanIds}
              onChange={onSelectChange}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>

      <div className="btn-container">
        <Space>
          <Button type="primary" onClick={submit}>
            确定
          </Button>
          <Button type="primary" onClick={submitAndContinue}>
            确定并继续
          </Button>
          <Button type="primary" onClick={() => setVisible(false)}>
            取消
          </Button>
        </Space>
      </div>
    </Drawer>
  );
}
