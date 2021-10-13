import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Form, Drawer, Modal, Input, Switch, Select, Tabs, Button, message, TreeSelect, Space, Row, Col } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import { createCase, updateCase, getCaseInfo } from '../../service';
import { priorityEnum } from '../../constant';
import { createSona } from '@cffe/sona';
import RichText from '@/components/rich-text';
import FELayout from '@cffe/vc-layout';
import EditableTable from '../../_components/editable-table';
import './index.less';

const { TabPane } = Tabs;

export default function RightDetail(props: any) {
  const { visible, setVisible, readOnly, onSuccess, caseId, cateId, isModal = false, caseCateTreeData = [] } = props;
  const userInfo = useContext(FELayout.SSOUserInfoContext);

  const [descType, setDescType] = useState('0');
  const [saveLoding, setSaveLoding] = useState<boolean>(false);
  const [expandKeys, setExpandKeys] = useState<React.Key[]>();
  const [schema, setSchema] = useState<any>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [form] = Form.useForm();
  const sona = useMemo(() => createSona(), []);

  const [caseCate, setCaseCate] = useState<any>();

  useEffect(() => {
    setIsEdit(!readOnly);
  }, [visible]);

  useEffect(() => {
    if (visible) {
      let cnt = 0;
      void setSchema(undefined);
      form.resetFields();
      if (caseId) {
        getRequest(getCaseInfo + '/' + caseId).then((res) => {
          res.data.categoryId && expandA(res.data.categoryId);
          void setDescType(res.data.descType.toString());
          res.data.stepContent = res.data.stepContent.map((item: any) => ({
            ...item,
            value: item.input,
            desc: item.output,
            key: `init-${cnt++}`,
          }));
          void form.setFieldsValue(res.data);
          try {
            void setSchema(JSON.parse(res.data.comment));
          } catch (e) {}
        });
      } else {
        void setDescType('0');
        void form.resetFields();
        void form.setFieldsValue({ categoryId: cateId });
        void setSchema(undefined);
      }
    }
  }, [visible]);

  useEffect(() => {
    if (visible && !caseId) {
      expandA(cateId);
    }
  }, [visible]);

  const expandA = (cateId: number) => {
    const exps: any[] = [];
    const dfs = (nodeArr: any[]) => {
      if (!nodeArr?.length) return false;

      for (const node of nodeArr) {
        exps.push(node.key);
        if (+node.key === +cateId) {
          setCaseCate(node);
          exps.pop();
          return true;
        }
        if (dfs(node.children)) return true;
        exps.pop();
      }
    };
    dfs(caseCateTreeData);
    setExpandKeys(exps);
  };

  const handleSave = async (needContinue: boolean = false) => {
    form.validateFields().then(async (_data) => {
      setSaveLoding(true);
      const formData = {
        ..._data,
        comment: JSON.stringify(sona.schema),
        currentUser: userInfo.userName,
        descType: +descType,
        isAuto: _data.isAuto ? 1 : 0,
        categoryId: +_data.categoryId,
      };

      let res;
      if (caseId) {
        res = await postRequest(updateCase + '/' + caseId, { data: formData });
      } else {
        res = await postRequest(createCase, { data: formData });
      }

      void onSuccess({ ...formData, id: res?.data.id });
      void message.success(caseId ? '编辑用例成功' : '新增用例成功');

      // 保存后清空表单
      void form.resetFields();
      void form.setFieldsValue({ categoryId: cateId });

      setSaveLoding(false);

      !needContinue && setVisible(false);
    });
  };

  const handleCancel = () => {
    void setVisible(false);
  };

  const handleEditBtnClick = () => {
    setIsEdit(true);
  };

  const layout = {
    labelCol: { span: isEdit ? 3 : 3 },
    wrapperCol: { span: isEdit ? 21 : 21 },
    labelAlign: 'right' as 'right',
  };

  const ReadOnlyDiv = (props: any) => {
    return <div>{props.render?.(props.value) || props.value}</div>;
  };

  const infoEl = (
    <>
      <Form className="add-case-form" {...layout} form={form} initialValues={{ priority: 'P2' }}>
        <Form.Item label="标题:" name="title" rules={[{ required: true, message: '请输入标题' }]}>
          {isEdit ? <Input disabled={!isEdit} placeholder="请输入标题" /> : <ReadOnlyDiv />}
        </Form.Item>
        <Form.Item label="所属:" name="categoryId" rules={[{ required: true, message: '请选择所属模块' }]}>
          {isEdit ? (
            <TreeSelect
              treeLine
              treeExpandedKeys={expandKeys}
              onTreeExpand={setExpandKeys}
              disabled={!isEdit}
              treeData={caseCateTreeData}
              showSearch
              treeNodeFilterProp="title"
            />
          ) : (
            <ReadOnlyDiv render={() => caseCate?.name} />
          )}
        </Form.Item>
        <Form.Item label="优先级" className="inline-form-item-group">
          <Form.Item name="priority" rules={[{ required: true, message: '请选择优先级' }]}>
            {isEdit ? <Select disabled={!isEdit} options={priorityEnum} style={{ width: '300px' }} /> : <ReadOnlyDiv />}
          </Form.Item>
          <Form.Item name="isAuto" label="是否自动化" valuePropName="checked" style={{ marginBottom: 'unset' }}>
            <Switch disabled={!isEdit} />
          </Form.Item>
        </Form.Item>
        <Form.Item label="前置条件:" name="precondition">
          <Input.TextArea className="precondition-h" disabled={!isEdit} placeholder="请输入前置条件"></Input.TextArea>
        </Form.Item>
        <Form.Item label="用例描述:" className="step-content-form-item">
          <Tabs activeKey={descType} onChange={setDescType}>
            <TabPane tab="卡片式" key="0">
              <div className="cardtype-case-desc-wrapper">
                <Form.Item
                  noStyle
                  name={['stepContent', 0, 'input']}
                  rules={[{ required: true, message: '请输入步骤描述' }]}
                >
                  <Input.TextArea
                    autoSize={{ minRows: 10 }}
                    disabled={!isEdit}
                    placeholder="步骤描述"
                    className="step-desc"
                  />
                </Form.Item>
                <Form.Item
                  noStyle
                  name={['stepContent', 0, 'output']}
                  rules={[{ required: true, message: '请输入预期结果' }]}
                >
                  <Input.TextArea
                    autoSize={{ minRows: 10 }}
                    disabled={!isEdit}
                    placeholder="预期结果"
                    className="step-expected-results"
                  />
                </Form.Item>
              </div>
            </TabPane>
            <TabPane tab="步骤式" key="1">
              <Form.Item name="stepContent">
                <EditableTable readOnly={!isEdit} />
              </Form.Item>
            </TabPane>
          </Tabs>
        </Form.Item>
        <Form.Item label="备注" name="comment">
          <RichText readOnly={!isEdit} sona={sona} schema={schema} width="100%" height="400px" />
        </Form.Item>
      </Form>

      <div className="drawer-btn-group">
        {!isEdit ? (
          <Space>
            <Button type="primary" onClick={handleEditBtnClick}>
              编辑
            </Button>
          </Space>
        ) : (
          <Space>
            <Button type="primary" onClick={() => handleSave()} loading={saveLoding}>
              保存
            </Button>
            {/* <Button type="primary" onClick={handleCancel}>
              取消
            </Button> */}
          </Space>
        )}
      </div>
    </>
  );

  return isModal ? (
    <Modal
      className="add-case-modal"
      visible={visible}
      width={900}
      title={!isEdit ? '查看用例' : caseId ? '编辑用例' : '添加用例'}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      footer={false}
    >
      {infoEl}
    </Modal>
  ) : (
    <Drawer
      className="add-case-drawer"
      visible={visible}
      width={900}
      title={!isEdit ? '查看用例' : caseId ? '编辑用例' : '添加用例'}
      onClose={() => setVisible(false)}
      maskClosable={false}
    >
      {infoEl}
    </Drawer>
  );
}
