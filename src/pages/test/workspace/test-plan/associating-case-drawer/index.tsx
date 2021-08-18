import React, { useState, useEffect, useContext } from 'react';
import { getRequest, postRequest } from '@/utils/request';
import { modifyPhaseCase, getTestPhaseDetail, getAllTestCaseTree, getPhaseCaseTree } from '../../service';
import { Button, Tabs, Drawer, message, TreeSelect } from 'antd';
import FELayout from '@cffe/vc-layout';
import './index.less';

export default function AssociatingCaseDrawer(props: any) {
  const { plan, visible, setVisible } = props;
  const userInfo = useContext(FELayout.SSOUserInfoContext);

  const [testCaseTree, setTestCaseTree] = useState([]);
  const [curActivePhase, setCurActivePhase] = useState<string>();
  const [selectedTestPlanIds, setselectedTestPlanIds] = useState<React.Key[]>([]);

  useEffect(() => {
    void getRequest(getAllTestCaseTree).then((res) => {
      const curCaseTree = res.data.subItems.filter((item: any) => item.subItems?.length || item.cases?.length);
      const Q = [...curCaseTree];
      while (Q.length) {
        const cur = Q.shift();
        cur.key = cur.id;
        cur.title = cur.name;
        if (cur.subItems?.length) {
          cur.subItems = cur.subItems.filter((item: any) => item.subItems?.length || item.cases?.length);
          cur.children = cur.subItems;
          Q.push(...cur.subItems);
        } else if (cur.cases?.length) {
          cur.cases.forEach((item: any) => (item.key = item.id));
          cur.children = cur.cases;
        }
      }
      void setTestCaseTree(curCaseTree || []);
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
    void postRequest(modifyPhaseCase, {
      data: {
        phaseId: curActivePhase,
        cases: selectedTestPlanIds,
        modifyUser: userInfo.userName,
      },
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
              value={selectedTestPlanIds}
              onChange={onSelectChange}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>

      <div className="btn-container">
        <Button type="primary" onClick={submit}>
          确定
        </Button>
        <Button type="primary" onClick={() => setVisible(false)} className="ml-12">
          取消
        </Button>
      </div>
    </Drawer>
  );
}
