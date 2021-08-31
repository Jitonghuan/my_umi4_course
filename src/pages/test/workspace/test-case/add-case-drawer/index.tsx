import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Form, Drawer, Modal, Input, Switch, Select, Tabs, Button, message, TreeSelect, Space } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import { createCase, updateCase, getCategoryList, getCaseInfo } from '../../service';
import { priorityEnum } from '../../constant';
import { createSona } from '@cffe/sona';
import EditorTable from '@cffe/pc-editor-table';
import RichText from '@/components/rich-text';
import FELayout from '@cffe/vc-layout';
import './index.less';

const { TabPane } = Tabs;

export default function RightDetail(props: any) {
  const { visible, setVisible, onSuccess, caseId, cateId, isModal = false } = props;
  const userInfo = useContext(FELayout.SSOUserInfoContext);

  const [caseDescArr, setCaseDescArr] = useState<any[]>([]);
  const [stepContent, setStepContent] = useState<string | string[]>('');
  const [stepContentFormItemHelp, setStepContentFormItemHelp] = useState<any>();
  const [stepContentFormItemvalidateStatus, setStepContentFormItemvalidateStatus] = useState<any>('validating');
  const [expectedResult, setExpectedResult] = useState<string | string[]>('');
  const [descType, setDescType] = useState('0');
  const [schema, setSchema] = useState<any>();
  const [form] = Form.useForm();
  const sona = useMemo(() => createSona(), []);

  useEffect(() => {
    if (visible) {
      void setSchema(undefined);
      if (caseId) {
        getRequest(getCaseInfo + '/' + caseId).then((res) => {
          void form.setFieldsValue(res.data);
          if (res.data.descType === '0') {
            void setStepContent(res.data.stepContent[0].input);
            void setExpectedResult(res.data.stepContent[0].output);
          } else {
            void setCaseDescArr(
              res.data.stepContent.map((item: any) => ({ ...item, value: item.input, desc: item.output })),
            );
            void setStepContent(res.data.stepContent.map((item: any) => item.input));
            void setExpectedResult(res.data.stepContent.map((item: any) => item.output));
          }
          try {
            void setSchema(JSON.parse(res.data.comment));
          } catch (e) {}
        });
      } else {
        void form.resetFields();
        void setStepContent('');
        void setExpectedResult('');
        void setSchema(undefined);
      }
    }
  }, [visible]);

  const handleSave = async (needContinue: boolean = false) => {
    let finalStepContent = stepContent;
    let finalExpectedResult = expectedResult;
    if (typeof finalStepContent === 'string') {
      if (finalStepContent.length > 0) finalStepContent = [finalStepContent];
      else finalStepContent = [];
    }
    if (typeof finalExpectedResult === 'string') {
      if (finalExpectedResult.length > 0) finalExpectedResult = [finalExpectedResult];
      else finalExpectedResult = [];
    }

    try {
      form.validateFields();
      await form.validateFields().finally(() => {
        if (finalStepContent.length === 0 || finalExpectedResult.length === 0) {
          void setStepContentFormItemHelp('请输入步骤描述');
          void setStepContentFormItemvalidateStatus('error');
          throw '请输入步骤描述';
        }
      });
    } catch (e) {
      return;
    }

    const _data = form.getFieldsValue();
    const formData = {
      ..._data,
      stepContent: finalStepContent.map((item, idx) => ({ input: item, output: finalExpectedResult[idx] })),
      comment: JSON.stringify(sona.schema),
      currentUser: userInfo.userName,
      descType: +descType,
      isAuto: _data.isAuto ? 1 : 0,
      categoryId: +cateId,
    };

    // const loadEnd = message.loading(`正在${caseId ? '更新' : '新增'}用例`);

    if (caseId) {
      void (await postRequest(updateCase + '/' + caseId, { data: formData }));
    } else if (cateId) {
      void (await postRequest(createCase, { data: formData }));
    }

    // void loadEnd();
    void onSuccess();
    void message.success(caseId ? '编辑用例成功' : '新增用例成功');

    // 保存后清空表单
    void form.resetFields();
    if (descType === '0') {
      void setStepContent('');
      void setExpectedResult('');
    } else {
      void setCaseDescArr([]);
      void setStepContent([]);
      void setExpectedResult([]);
    }

    !needContinue && setVisible(false);
  };

  const handleCancel = () => {
    void setVisible(false);
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
    labelAlign: 'left' as 'left',
  };

  const infoEl = (
    <>
      <Form {...layout} form={form}>
        <Form.Item label="标题:" name="title" rules={[{ required: true, message: '请输入标题' }]}>
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Form.Item label="优先级:" name="priority" rules={[{ required: true, message: '请选择优先级' }]}>
          <Select>
            {priorityEnum.map((item) => (
              <Select.Option value={item.value} key={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="是否自动化:" name="isAuto" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="前置条件:" name="precondition">
          <Input.TextArea placeholder="请输入前置条件"></Input.TextArea>
        </Form.Item>
        <Form.Item
          label="用例描述:"
          name="stepContent"
          help={stepContentFormItemHelp}
          validateStatus={stepContentFormItemvalidateStatus}
          className="step-content-form-item"
        >
          <Tabs
            activeKey={descType}
            onChange={(key) => {
              void setDescType(key);
              if (key === '0') {
                void setStepContent('');
                void setExpectedResult('');
              } else {
                void setCaseDescArr([]);
                void setStepContent([]);
                void setExpectedResult([]);
              }
            }}
          >
            <TabPane tab="卡片式" key="0">
              <div className="cardtype-case-desc-wrapper">
                <Input.TextArea
                  placeholder="输入步骤描述"
                  className="step-desc"
                  value={stepContent}
                  onChange={(e) => {
                    void setStepContentFormItemHelp('');
                    void setStepContentFormItemvalidateStatus(undefined);
                    void setStepContent(e.target.value);
                  }}
                ></Input.TextArea>
                <Input.TextArea
                  placeholder="预期结果"
                  className="step-expected-results"
                  value={expectedResult}
                  onChange={(e) => {
                    void setStepContentFormItemHelp('');
                    void setStepContentFormItemvalidateStatus(undefined);
                    void setExpectedResult(e.target.value);
                  }}
                ></Input.TextArea>
              </div>
            </TabPane>
            <TabPane tab="步骤式" key="1">
              <EditorTable
                value={caseDescArr}
                onChange={(val) => {
                  void setStepContentFormItemHelp('');
                  void setStepContentFormItemvalidateStatus(undefined);
                  void setCaseDescArr(val);
                  void setStepContent(val.map((item) => item.value));
                  void setExpectedResult(val.map((item) => item.desc));
                }}
                creator={{ record: { value: '', desc: '' } }}
                columns={[
                  {
                    title: '编号',
                    dataIndex: '__count',
                    fieldType: 'readonly',
                    colProps: { width: 60, align: 'center' },
                  },
                  { title: '步骤描述', dataIndex: 'value', required: true },
                  { title: '预期结果', dataIndex: 'desc', required: true },
                ]}
              />
            </TabPane>
          </Tabs>
        </Form.Item>
        <Form.Item label="备注" name="comment">
          <RichText sona={sona} schema={schema} width="100%" height="200px" />
        </Form.Item>
      </Form>

      <div className="drawer-btn-group">
        <Space>
          <Button type="primary" onClick={() => handleSave()}>
            保存
          </Button>
          {!caseId ? (
            <Button type="primary" onClick={() => handleSave(true)}>
              保存并继续
            </Button>
          ) : (
            ''
          )}
          <Button type="primary" onClick={handleCancel}>
            取消
          </Button>
        </Space>
      </div>
    </>
  );

  return isModal ? (
    <Modal
      className="add-case-modal"
      visible={visible}
      width="400"
      title={caseId ? '编辑用例' : '添加用例'}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      footer={false}
    >
      {infoEl}
    </Modal>
  ) : (
    <Drawer
      visible={visible}
      width="650"
      title={caseId ? '编辑用例' : '添加用例'}
      onClose={() => setVisible(false)}
      maskClosable={false}
    >
      {infoEl}
    </Drawer>
  );
}
