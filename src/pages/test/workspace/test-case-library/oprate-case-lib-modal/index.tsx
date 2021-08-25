import React, { useState, useContext, useEffect } from 'react';
import { postRequest } from '@/utils/request';
import { Input, Modal, message } from 'antd';
import { createCaseCategory, updateCaseCategory } from '../../service';
import FELayout from '@cffe/vc-layout';

export default function OprateCaseLibModal(props: any) {
  const { visible, setVisible, caseCateId, caseCateName, updateDatasource, parentId = '0' } = props;
  const userInfo = useContext(FELayout.SSOUserInfoContext);

  const [curCaseCateName, setCurCaseCateName] = useState<string>('');

  useEffect(() => {
    setCurCaseCateName(caseCateName);
  }, [caseCateName]);

  const submit = async () => {
    const isAdd = caseCateId === undefined;
    const load = message.loading(isAdd ? '正在添加测试用例库' : '正在更新测试用例库');
    const targetUrl = isAdd ? createCaseCategory : updateCaseCategory + '/' + caseCateId;
    await postRequest(targetUrl, {
      data: {
        name: curCaseCateName,
        parentId: parentId,
        currentUser: userInfo.userName,
      },
    });
    void load();
    void message.success(isAdd ? '成功添加测试用例库！' : '成功更新测试用例库！');
    void setVisible(false);
    void updateDatasource();
  };

  return (
    <Modal
      title={caseCateId === undefined ? '新增用例库' : '编辑用例库'}
      visible={visible}
      onCancel={() => setVisible(false)}
      onOk={submit}
    >
      <label className="inline-item">
        <span> 用例库名称：</span>
        <Input
          value={curCaseCateName}
          onChange={(e) => setCurCaseCateName(e.target.value)}
          placeholder="输入用例库名称"
        />
      </label>
    </Modal>
  );
}
