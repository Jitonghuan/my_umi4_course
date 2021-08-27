import React, { useState, useContext, useEffect } from 'react';
import { postRequest } from '@/utils/request';
import { Input, Modal, message } from 'antd';
import { createCaseCategory, updateCaseCategory } from '../../service';
import FELayout from '@cffe/vc-layout';

export default function OprateCaseLibModal(props: any) {
  const { visible, setVisible, caseCateId, caseCateName, updateDatasource, parentId = '0' } = props;
  const userInfo = useContext(FELayout.SSOUserInfoContext);

  const [curCaseModuleName, setCurCaseModuleName] = useState<string>('');

  useEffect(() => {
    setCurCaseModuleName(caseCateName);
  }, [caseCateName]);

  const submit = async () => {
    const isAdd = caseCateId === undefined;
    const load = message.loading(isAdd ? '正在添加测试模块' : '正在更新测试模块');
    const targetUrl = isAdd ? createCaseCategory : updateCaseCategory + '/' + caseCateId;
    await postRequest(targetUrl, {
      data: {
        name: curCaseModuleName,
        parentId: parentId,
        currentUser: userInfo.userName,
      },
    });
    void load();
    void message.success(isAdd ? '成功添加测试模块！' : '成功更新测试模块！');
    void setVisible(false);
    void updateDatasource();
    void setCurCaseModuleName('');
  };

  return (
    <Modal
      title={caseCateId === undefined ? '新增模块' : '编辑模块'}
      visible={visible}
      onCancel={() => setVisible(false)}
      onOk={submit}
    >
      <label className="inline-item">
        <span> 模块名称：</span>
        <Input
          value={curCaseModuleName}
          onChange={(e) => setCurCaseModuleName(e.target.value)}
          placeholder="输入模块名称"
        />
      </label>
    </Modal>
  );
}
