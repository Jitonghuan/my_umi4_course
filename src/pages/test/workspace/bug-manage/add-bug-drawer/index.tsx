import React, { useState, useEffect, useContext, useMemo } from 'react';
import { bugTypeEnum, statusEnum, bugPriorityEnum } from '../../constant';
import { Select, Input, Switch, Button, Form, Space, Drawer, message, Radio, Modal, TreeSelect } from 'antd';
import { addBug, modifyBug, getAllTestCaseTree, getCaseCategoryPageList } from '../../service';
import { createSona } from '@cffe/sona';
import RichText from '@/components/rich-text';
import FELayout from '@cffe/vc-layout';
import './index.less';
import { getRequest, postRequest } from '@/utils/request';

export default function BugManage(props: any) {
  const { visible, setVisible, projectList, bugInfo, updateBugList } = props;
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [relatedCases, setRelatedCases] = useState<any[]>([]);
  const [schema, setSchema] = useState<any[]>();
  const [associationUseCaseModalVisible, setAssociationUseCaseModalVisible] = useState(false);
  const [testCaseTree, setTestCaseTree] = useState<any[]>([]);
  const [form] = Form.useForm();
  const sona = useMemo(() => createSona(), []);

  const submit = async (continueAdd = false) => {
    const finishLoading = message.loading(bugInfo ? '正在修改' : '正在新增');
    const formData = form.getFieldsValue();
    const requestParams = {
      ...formData,
      desc: JSON.stringify(sona.schema),
      onlineBug: formData.onlineBug ? 1 : 0,
      relatedCases,
      id: bugInfo?.id,
      ...(bugInfo ? { modifyUser: userInfo.userName } : { createUser: userInfo.userName }),
    };
    await postRequest(bugInfo ? modifyBug : addBug, { data: requestParams }).finally(() => {
      void finishLoading();
    });
    void message.success(bugInfo ? '修改成功' : '新增成功');
    void updateBugList();

    // 保存后清空form
    form.resetFields();
    void setRelatedCases([]);
    void setSchema(undefined);

    if (continueAdd && !bugInfo) return;
    void setVisible(false);
  };

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
  };

  // 如果是编辑，则回填信息
  useEffect(() => {
    if (visible && bugInfo) {
      form.setFieldsValue(bugInfo);
      void setRelatedCases(bugInfo.relatedCases);
      try {
        void setSchema(JSON.parse(bugInfo.description));
      } catch {
        void setSchema(undefined);
      }
    }
  }, [visible]);

  /** -------------------------- 关联用例 start -------------------------- */

  const dataClean = (node: any): boolean => {
    node.key = node.id;
    node.title = node.name;

    const isLeaf = !node.subItems?.length;
    // 终点条件，叶子节点是否有cases
    if (isLeaf) {
      node.children = node.cases.map((node: any) => ({ ...node, key: node.id }));
      return !!node.children?.length;
    }

    node.children = [];
    node.subItems.forEach((subNode: any) => dataClean(subNode) && node.children.push(subNode));
    return !!node.children.length;
  };

  // 获得可关联的测试用例树
  useEffect(() => {
    void getRequest(getAllTestCaseTree).then((res) => {
      const root = res.data;
      void dataClean(root);
      void setTestCaseTree(root.children);
    });
  }, []);

  /** -------------------------- 关联用例 end -------------------------- */

  return (
    <>
      <Drawer
        visible={visible}
        onClose={() => setVisible(false)}
        width={700}
        title={bugInfo ? '编辑Bug' : '新增Bug'}
        className="test-workspace-bug-manage-add-bug-drawer"
        maskClosable={false}
      >
        <Form {...formItemLayout} form={form}>
          <Form.Item label="标题" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="所属业务" name="business">
            <Select>
              {projectList.map((item: any) => (
                <Select.Option value={item.id} key={item.id}>
                  {item.categoryName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="优先级" name="priority">
            <Radio.Group>
              {bugPriorityEnum.map((title, index) => (
                <Radio value={index} key={index}>
                  {title}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item label="类型" name="bugType">
            <Select>
              {bugTypeEnum.map((title, index) => (
                <Select.Option value={index} key={index}>
                  {title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="是否线上Bug" valuePropName="checked" name="onlineBug">
            <Switch />
          </Form.Item>
          <Form.Item label="关联用例" name="relatedCases">
            <Space>
              <TreeSelect
                className="test-case-tree-select"
                multiple
                treeCheckable
                placeholder="请选择用例集合"
                treeNodeLabelProp="title"
                treeNodeFilterProp="title"
                treeData={testCaseTree}
                value={relatedCases}
                onChange={setRelatedCases}
              />
              <Button type="primary" ghost>
                新增用例
              </Button>
            </Space>
          </Form.Item>
          <Form.Item label="描述" name="desc">
            <RichText width="524px" sona={sona} schema={schema} />
          </Form.Item>
          <Form.Item label="经办人" name="agent">
            <Input />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select>
              {statusEnum.map((title, index) => (
                <Select.Option value={index} key={index}>
                  {title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>

        <div className="footer">
          <Space>
            {!bugInfo ? (
              <Button type="primary" onClick={() => submit(true)}>
                保存并新增
              </Button>
            ) : (
              ''
            )}
            <Button type="primary" onClick={() => submit(false)}>
              保存
            </Button>
            <Button className="ml-auto" onClick={() => setVisible(false)}>
              取消
            </Button>
          </Space>
        </div>
      </Drawer>
    </>
  );
}
