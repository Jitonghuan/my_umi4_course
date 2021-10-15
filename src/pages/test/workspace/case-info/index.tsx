import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Form, Drawer, Modal, Input, Switch, Select, Tabs, Button, message, TreeSelect, Space, Row, Col } from 'antd';
import { FileOutlined, FolderOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { getRequest, postRequest } from '@/utils/request';
import { createCase, updateCase, getCaseInfo, getCaseCategoryDeepList } from '../service';
import { priorityEnum } from '../constant';
import { createSona } from '@cffe/sona';
import { ContentCard, CardRowGroup } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';
import RichText from '@/components/rich-text';
import FELayout from '@cffe/vc-layout';
import EditableTable from '../_components/editable-table';
import PreconditionEditableTable from '../_components/precondition-editable-table';
import { history } from 'umi';
import './index.less';

const { TabPane } = Tabs;

export default function CaseInfo(props: any) {
  // @ts-ignore
  const { caseId, cateId } = history.location.query;

  const userInfo = useContext(FELayout.SSOUserInfoContext);

  const [descType, setDescType] = useState('0');
  const [saveLoding, setSaveLoding] = useState<boolean>(false);
  const [expandKeys, setExpandKeys] = useState<React.Key[]>();
  const [schema, setSchema] = useState<any>();
  const [caseCateTreeData, setCaseCateTreeData] = useState<any[]>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [form] = Form.useForm();
  const sona = useMemo(() => createSona(), []);

  const [caseData, setCaseData] = useState<any>();
  const [caseCate, setCaseCate] = useState<any>();

  useEffect(() => {
    let cnt = 0;
    void setSchema(undefined);
    form.resetFields();
    if (caseId) {
      getRequest(getCaseInfo + '/' + caseId).then((res) => {
        setCaseData(res.data);
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
  }, []);

  useEffect(() => {
    if (cateId) {
      const dataClean = (node: any) => {
        node.key = node.id;
        node.title = node.name;
        node.children = node.items;
        if (!node.children?.length) {
          node.isLeaf = true;
          node.icon = <FileOutlined />;
        } else {
          node.switcherIcon = (nodeInfo: any) => {
            if (!nodeInfo.expanded) return <FolderOutlined />;
            return <FolderOpenOutlined />;
          };
        }
        node.children?.forEach((item: any) => dataClean(item));

        return node;
      };

      Promise.all([
        getRequest(getCaseCategoryDeepList, {
          data: {
            id: 0,
            deep: 1,
          },
        }),
        getRequest(getCaseCategoryDeepList, {
          data: {
            id: cateId,
            deep: -1,
          },
        }),
      ]).then(([{ data: rootArr }, { data: caseCateTreeData }]) => {
        const _root = rootArr?.map((item: any) => ({ ...item, key: item.id, title: item.name })) || [];
        const _curTreeData = [
          dataClean({
            ..._root.find((item: any) => +item.id === +cateId),
            items: caseCateTreeData,
          }),
        ];
        setCaseCateTreeData(_curTreeData || []);
      });
    }
  }, []);

  useEffect(() => {
    caseData?.categoryId && expandA(caseData.categoryId);
  }, [caseData, caseCateTreeData]);

  const expandA = (cateId: number) => {
    if (!caseCateTreeData) return;

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

  const handleSave = async () => {
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

      void message.success('编辑用例成功');

      setSaveLoding(false);
      setIsEdit(false);
    });
  };

  const handleEditBtnClick = () => {
    setIsEdit(true);
  };

  const handleGoBackBtnClick = () => {
    history.goBack();
  };

  const handleCancel = () => {
    setIsEdit(false);
  };

  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
    labelAlign: 'right' as 'right',
  };

  const ReadOnlyDiv = (props: any) => {
    return <div>{props.render?.(props.value) || props.value}</div>;
  };

  return (
    <PageContainer>
      <HeaderTabs activeKey="test-case-library" history={props.history} />
      <CardRowGroup>
        <ContentCard>
          <div className="case-info-containerr">
            <Form className="add-case-form" {...layout} form={form}>
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
                  {isEdit ? (
                    <Select disabled={!isEdit} options={priorityEnum} style={{ width: '300px' }} />
                  ) : (
                    <ReadOnlyDiv />
                  )}
                </Form.Item>
                <Form.Item name="isAuto" label="是否自动化" valuePropName="checked" style={{ marginBottom: 'unset' }}>
                  <Switch disabled={!isEdit} />
                </Form.Item>
              </Form.Item>
              <Form.Item label="前置条件:" name="precondition">
                <PreconditionEditableTable readOnly={!isEdit} />
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
                  <Button type="primary" onClick={handleGoBackBtnClick}>
                    返回
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
          </div>
        </ContentCard>
      </CardRowGroup>
    </PageContainer>
  );
}
