import React, { useState, useEffect, useContext } from 'react';
import { getRequest, postRequest } from '@/utils/request';
import { modifyPhaseCase, getTestPhaseDetail } from '../../service';
import { Form, Button, Table, Input, Select, Space, Drawer, message } from 'antd';
import FELayout from '@cffe/vc-layout';
import './index.less';

export default function AssociatingCaseDrawer(props: any) {
  const { plan, visible, setVisible } = props;
  const userInfo = useContext(FELayout.SSOUserInfoContext);

  useEffect(() => {
    if (visible) {
      console.log(plan);
    }
  }, [visible]);

  return (
    <Drawer
      className="test-workspace-test-plan-add-test-plan-drawer"
      visible={visible}
      width="650"
      title="关联用例"
      onClose={() => setVisible(false)}
    >
      123
    </Drawer>
  );
}
