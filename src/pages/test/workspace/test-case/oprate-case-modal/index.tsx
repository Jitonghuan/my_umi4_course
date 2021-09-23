import React, { useState, useEffect, useContext } from 'react';
import { copyCases, moveCases } from '../../service';
import { postRequest, getRequest } from '@/utils/request';
import { Modal, TreeSelect } from 'antd';
import FELayout from '@cffe/vc-layout';
import './index.less';

interface PropsInterface {
  visible: boolean;
  setVisible: any;
  oprationType: 'copy' | 'move';
  checkedCaseIds: React.Key[];
  setCheckedCaseIds: any;
  caseCateTreeData: any;
  updateDatasource: any;
  cateId?: any;
}

export default function OperateCaseModal(props: PropsInterface) {
  const {
    visible,
    setVisible,
    oprationType,
    checkedCaseIds,
    setCheckedCaseIds,
    caseCateTreeData,
    updateDatasource,
    cateId,
  } = props;
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [categoryId, setCategoryId] = useState<React.Key>();

  useEffect(() => {
    if (visible) {
      setCategoryId(cateId);
    }
  }, [visible]);

  const dataClean = (node: any) => {
    node.key = node.id;
    node.title = node.name;
    node.children = node.items;
    node.children?.forEach((item: any) => dataClean(item));

    return node;
  };

  const submit = async () => {
    void (await postRequest(oprationType === 'copy' ? copyCases : moveCases, {
      data: {
        ids: checkedCaseIds,
        categoryId: categoryId,
        currentUser: userInfo.userName,
      },
    }));
    void setCheckedCaseIds([]);
    void updateDatasource();
    void setVisible(false);
  };

  return (
    <Modal
      visible={visible}
      onOk={submit}
      onCancel={() => setVisible(false)}
      title={oprationType === 'copy' ? '复制用例' : '移动用例'}
      maskClosable={false}
    >
      <div className="oprate-case-modal-body">
        <span className="oprate-case-label">目标位置：</span>
        <TreeSelect
          className="oprate-case-select-tree"
          value={categoryId}
          onChange={setCategoryId}
          treeData={caseCateTreeData}
          showSearch
          treeNodeFilterProp="title"
        />
      </div>
    </Modal>
  );
}
