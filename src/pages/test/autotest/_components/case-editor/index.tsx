// test case editor
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 20:15

import { useState, useEffect, useCallback } from 'react';
import { Drawer, Form, Tabs, message } from 'antd';
import { CaseItemVO } from '../../interfaces';
import CaseFormEditor, { getInitAddFieldData, getInitEditFieldData } from './form-editor';
import { CaseEditorProps, ParamType, TabKeys } from './types';
import './index.less';

export default function CaseEditor(props: CaseEditorProps) {
  const [editField] = Form.useForm<Record<string, any>>();
  const [paramType, setParamType] = useState<ParamType>('json');
  const [activeKey, setActiveKey] = useState<TabKeys>('form-mode');

  // 编辑时回填数据
  const initEditField = async (initData: CaseItemVO) => {
    const { nextParamType, ...values } = await getInitEditFieldData(initData);

    nextParamType && setParamType(nextParamType);
    editField.setFieldsValue(values);
  };

  // 新增的回填数据
  const initAddField = async (apiDetail?: Record<string, any>) => {
    if (!apiDetail) return;
    const { nextParamType, ...values } = await getInitAddFieldData(apiDetail);

    nextParamType && setParamType(nextParamType);
    editField.setFieldsValue(values);
  };

  const handleTabChange = useCallback((nextKey: TabKeys) => {
    if (nextKey === 'source-mode') {
      // TODO 重新回填数据
      setActiveKey(nextKey);
    } else {
      // TODO 先校验数据，再回填表单
      // message.warning('数据校验失败，无法切换至表单模式');
      setActiveKey(nextKey);
    }
  }, []);

  useEffect(() => {
    if (props.mode === 'HIDE') {
      setActiveKey('form-mode');

      return;
    }

    editField.resetFields();
    setParamType('json');

    if (props.mode === 'EDIT') {
      initEditField(props.initData || ({} as CaseItemVO));
    } else {
      initAddField(props.apiDetail);
    }
  }, [props.mode]);

  return (
    <Drawer
      title={props.mode === 'EDIT' ? '编辑用例' : '新增用例'}
      visible={props.mode !== 'HIDE'}
      maskClosable={false}
      onClose={props.onCancel}
      placement="right"
      width={900}
      className="test-case-editor"
      footer={false}
    >
      <Tabs activeKey={activeKey} onChange={handleTabChange as any} type="card">
        <Tabs.TabPane tab="表单模式" key="form-mode" />
        <Tabs.TabPane tab="源码模式" key="source-mode" />
      </Tabs>
      {activeKey === 'form-mode' && (
        <CaseFormEditor {...props} field={editField} paramType={paramType} onParamTypeChange={(n) => setParamType(n)} />
      )}
      {activeKey === 'source-mode' && <div>敬请期待~~</div>}
    </Drawer>
  );
}
