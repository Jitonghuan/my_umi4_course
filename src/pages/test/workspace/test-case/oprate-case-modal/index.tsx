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
}

export default function OperateCaseModal(props: PropsInterface) {
  const { visible, setVisible, oprationType, checkedCaseIds, setCheckedCaseIds, caseCateTreeData } = props;
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [categoryId, setCategoryId] = useState<React.Key>();

  const dataClean = (node: any) => {
    node.key = node.id;
    node.title = node.name;
    node.children = node.items;
    node.children?.forEach((item: any) => dataClean(item));

    return node;
  };

  // useEffect(() => {
  //   getRequest(getCaseCategoryDeepList).then((res) => {
  //     const _curTreeData = dataClean({ key: -1, items: res.data }).children;
  //     void setDataSource(_curTreeData || []);
  //   });
  // }, []);

  const submit = async () => {
    void (await postRequest(oprationType === 'copy' ? copyCases : moveCases, {
      data: {
        ids: checkedCaseIds,
        categoryId: categoryId,
        currentUser: userInfo.userName,
      },
    }));
    void setCheckedCaseIds([]);
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
        />
      </div>
    </Modal>
  );
}
