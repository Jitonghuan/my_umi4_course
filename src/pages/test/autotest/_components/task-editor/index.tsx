// 任务新增 / 编辑
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/08 16:17

import React, { useEffect, useContext } from 'react';
import { Drawer, Button, Input, Form, Select, Radio, TreeSelect, message, Switch } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import FELayout from '@cffe/vc-layout';
import { postRequest } from '@/utils/request';
import * as APIS from '../../service';
import { EditorMode, TaskItemVO } from '../../interfaces';
import { useEnvOptions } from '../../hooks';
import { useCaseListForTaskEditor, useSceneListForTaskEditor } from './hooks';
import './index.less';

const { Item: FormItem } = Form;

export interface TaskEditorProps {
  mode?: EditorMode;
  initData?: TaskItemVO;
  onClose?: () => any;
  onSave?: () => any;
}

export default function TaskEditor(props: TaskEditorProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const { mode, initData, onClose, onSave } = props;
  const [envOptons] = useEnvOptions();
  const [editField] = Form.useForm();
  const [caseTree] = useCaseListForTaskEditor();
  const [sceneTree] = useSceneListForTaskEditor();

  useEffect(() => {
    if (mode === 'HIDE') return;
    editField.resetFields();
    if (mode === 'ADD') return;

    const initValues = {
      taskName: initData?.name,
      cron: initData?.cron,
      runEnv: initData?.runEnv,
      suiteType: initData?.suiteType,
      dingTalkFlag: initData?.dingTalkFlag || false,
      emailFlag: initData?.emailFlag || false,
      dingTalkUrls: initData?.dingTalkUrls || [],
      emailReceivers: initData?.emailReceivers || [],
      testSuiteCase: [] as number[],
      testSuiteScene: [] as number[],
    };

    if (initValues.suiteType === 1) {
      initValues.testSuiteScene = initData?.testSuite || [];
    } else {
      initValues.testSuiteCase = initData?.testSuite || [];
    }

    editField.setFieldsValue(initValues);
  }, [mode]);

  const handleSubmit = async () => {
    const values = await editField.validateFields();
    console.log('> handleSubmit', values);

    const { testSuiteCase, testSuiteScene, ...others } = values;

    // 14, 15, 19
    const payload = {
      ...others,
      cron: others.cron || '',
      testSuite: (others.suiteType === 0 ? testSuiteCase : testSuiteScene) || [],
    };

    if (mode === 'ADD') {
      payload.createUser = userInfo.userName;
      // payload.testSuite = [14, 15, 19];

      await postRequest(APIS.addTask, { data: payload });
    } else {
      payload.id = initData?.id;
      payload.modifyUser = userInfo.userName;
      await postRequest(APIS.updateTask, { data: payload });
    }

    message.success('保存成功！');
    onSave?.();
  };

  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title={mode === 'ADD' ? '新增任务' : '编辑任务'}
      maskClosable={false}
      onClose={onClose}
      width={720}
      footer={
        <div className="drawer-custom-footer">
          <Button type="primary" onClick={handleSubmit}>
            确定
          </Button>
          <Button type="default" onClick={() => onClose?.()}>
            取消
          </Button>
        </div>
      }
    >
      <Form form={editField} labelCol={{ flex: '100px' }} wrapperCol={{ span: 20 }}>
        <FormItem label="任务名称" name="taskName" rules={[{ required: true, message: '请输入任务名' }]}>
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          label="执行机制"
          name="cron"
          extra={
            <a target="_blank" href="https://www.pppet.net/">
              <BulbOutlined /> 在线Cron表达式生成器
            </a>
          }
        >
          <Input.TextArea placeholder="cron表达式，不填表示手动执行" />
        </FormItem>
        <FormItem label="执行环境" name="runEnv" rules={[{ required: true, message: '请选择执行环境' }]}>
          <Select placeholder="请选择" options={envOptons} />
        </FormItem>
        <FormItem label="钉钉通知" name="dingTalkFlag" initialValue={false} valuePropName="checked">
          <Switch />
        </FormItem>
        <FormItem label="邮件通知" name="emailFlag" initialValue={false} valuePropName="checked">
          <Switch />
        </FormItem>
        <FormItem label="钉钉Token" name="dingTalkUrls" initialValue={[]}>
          <Select placeholder="请输入钉钉token" mode="tags" notFoundContent="请输入内容，回车添加" />
        </FormItem>
        <FormItem
          label="通知邮箱"
          name="emailReceivers"
          initialValue={[]}
          rules={[
            {
              validator: async (_, value: string[]) => {
                if (value?.find((n) => !/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(n))) {
                  throw new Error('请输入合法邮箱');
                }
              },
            },
          ]}
        >
          <Select placeholder="请输入邮箱" mode="tags" notFoundContent="请输入内容，回车添加" />
        </FormItem>
        <FormItem label="集合类型" name="suiteType" initialValue={0}>
          <Radio.Group
            options={[
              { label: '用例', value: 0 },
              { label: '场景', value: 1 },
            ]}
          />
        </FormItem>
        <FormItem noStyle shouldUpdate={(prev, curr) => prev.suiteType !== curr.suiteType}>
          {({ getFieldValue }) =>
            getFieldValue('suiteType') === 0 ? (
              <FormItem label="用例集合" name="testSuiteCase">
                <TreeSelect
                  treeData={caseTree}
                  multiple
                  treeCheckable
                  placeholder="请选择用例集合"
                  treeNodeLabelProp="display"
                />
              </FormItem>
            ) : (
              <FormItem label="场景集合" name="testSuiteScene">
                <TreeSelect
                  treeData={sceneTree}
                  multiple
                  treeCheckable
                  placeholder="请选择场景集合"
                  treeNodeLabelProp="display"
                />
              </FormItem>
            )
          }
        </FormItem>
      </Form>
    </Drawer>
  );
}
