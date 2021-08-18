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
  const [selectedTestPlanIds, setselectedTestPlanIds] = useState<React.Key[]>([]);

  useEffect(() => {
    if (visible) {
      console.log(plan);
    }
  }, [visible]);

  //TODO: 问清楚是什么接口先，可选择数据 和 已经选择的数据 怎么获取
  const updateSelectTree = (phaseId: number | string) => {
    getRequest(getAllTestCaseTree).then((res) => {
      const Q = [...res.data.subItems];
      while (Q.length) {
        const cur = Q.shift();
        cur.key = cur.id;
        cur.title = cur.name;
        cur.children = cur.subItems;
        cur.subItems?.length && Q.push(...cur.subItems);
      }
      void setTestCaseTree(res.data.subItems || []);
    });

    getRequest(getPhaseCaseTree, { data: { phaseId } }).then((res) => {
      const selected = [];
      const Q = [...res.data];
      while (Q.length) {
        const cur = Q.shift();
        !cur.subItems?.length && selected.push(cur.id);
        cur.subItems?.length && Q.push(...cur.subItems);
      }
      setselectedTestPlanIds(selected);
    });
  };

  const onSelectChange = (vals: React.Key[]) => {
    void setselectedTestPlanIds(vals);
  };

  return (
    <Drawer
      className="test-workspace-test-plan-add-test-plan-drawer"
      visible={visible}
      width="650"
      title="关联用例"
      onClose={() => setVisible(false)}
    >
      <Tabs onChange={(key) => updateSelectTree(key)}>
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
        <Button type="primary">确定</Button>
        <Button type="primary">取消</Button>
      </div>
    </Drawer>
  );
}
