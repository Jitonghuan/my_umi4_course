// test case editor
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 20:15

import { useState, useEffect, useCallback, useContext } from 'react';
import { Drawer, Form, Tabs, message, Button } from 'antd';
import { CaseItemVO } from '../../interfaces';
import CaseFormEditor, { getInitAddFieldData, getInitEditFieldData } from './form-editor';
import FELayout from '@cffe/vc-layout';
import SourceCodeEdit from './source-code-edit';
import { CaseEditorProps, ParamType, TabKeys } from './types';
import { postRequest } from '@/utils/request';
import YAML from 'yaml';
import * as APIS from '../../service';
import './index.less';

export default function CaseEditor(props: CaseEditorProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [editField] = Form.useForm<Record<string, any>>();
  const [paramType, setParamType] = useState<ParamType>('json');
  const [activeKey, setActiveKey] = useState<TabKeys>('form-mode');
  const [editorValue, setEditorValue] = useState<string>('');

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

  const handleTabChange = useCallback(
    (nextKey: TabKeys) => {
      if (nextKey === 'source-mode') {
        const values = editField.getFieldsValue();
        const payload = {
          name: values.name,
          desc: values.desc,
          allowSkip: values.allowSkip || false,
          skipReason: values.skipReason || '',
          headers: values.headers || [],
          parameters: values.parameters || values.parametersJSON || [],
          preStep: (values.beforeCases || []).map((n: any) => n.id).join(','),
          customVars: values.customVars || [],
          savedVars: values.savedVars || [],
          hooks: {
            setup: (values.beforeFuncs || []).map((n: any) => ({
              id: n.id,
              type: n.type || 0,
              argument: n.argument || '',
            })),
            teardown: (values.afterFuncs || []).map((n: any) => ({
              id: n.id,
              type: n.type || 0,
              argument: n.argument || '',
            })),
          },
          resAssert: values.resAssert || [],
          modifyUser: userInfo.userName,
          id: props.initData?.id,
          apiId: props.initData?.apiId || props.apiDetail?.id,
          createUser: props.initData?.createUser,
        };
        if (Object.keys(payload).length === 0) return;
        postRequest(APIS.caseToYml, { data: payload }).then((res) => {
          setEditorValue(YAML.stringify(res.data));
          setActiveKey(nextKey);
        });
      } else {
        let finalJSON;
        try {
          finalJSON = YAML.parse(editorValue);
        } catch (e) {
          message.warning('数据校验失败，无法切换至表单模式');
          return;
        }
        postRequest(APIS.ymlToCase, {
          data: { ...finalJSON, apiId: props.initData?.apiId, validates: finalJSON.validate, validate: undefined },
        })
          .then((res) => {
            editField.resetFields();
            initEditField({ ...res.data, hooks: JSON.stringify(res.data.hooks || {}) });
            setActiveKey(nextKey);
          })
          .catch((e) => {
            message.warning('数据校验失败，无法切换至表单模式');
          });
      }
    },
    [props.initData, props.paramType, props.apiDetail, editorValue],
  );

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
      {activeKey === 'source-mode' && (
        <SourceCodeEdit {...props} editorValue={editorValue} setEditorValue={setEditorValue} />
      )}
    </Drawer>
  );
}
