import React, { useState, useEffect, useContext, useMemo } from 'react';
import { bugTypeEnum, bugStatusEnum, bugPriorityEnum } from '../../constant';
import { Select, Input, Switch, Button, Form, Space, Drawer, message, Radio, Modal, TreeSelect } from 'antd';
import { addBug, modifyBug, getAllTestCaseTree, getCaseCategoryPageList, getManagerList } from '../../service';
import { getRequest, postRequest } from '@/utils/request';
import { createSona } from '@cffe/sona';
import AddCaseModal from '../add-case-modal';
import RichText from '@/components/rich-text';
import FELayout from '@cffe/vc-layout';
import _ from 'lodash';
import './index.less';

export default function BugManage(props: any) {
  const { visible, setVisible, projectList, bugInfo, updateBugList, defaultRelatedCases } = props;
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [relatedCases, setRelatedCases] = useState<any[]>([]);
  const [schema, setSchema] = useState<any[]>();
  const [addCaseModalVisible, setAddCaseModalVisible] = useState<boolean>(false);
  const [testCaseTree, setTestCaseTree] = useState<any[]>([]);
  const [cates, setCates] = useState<any[]>([]);
  const [manageList, setManageList] = useState<string[]>([]);
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
    void (await postRequest(bugInfo ? modifyBug : addBug, { data: requestParams }).finally(() => {
      void finishLoading();
    }));
    void message.success(bugInfo ? '修改成功' : '新增成功');

    void (updateBugList && updateBugList());

    // 保存后清空form
    void form.resetFields();
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
    if (visible) {
      if (bugInfo) {
        bugInfo.status = bugInfo?.status.toString();
        void form.setFieldsValue(bugInfo);
        void setRelatedCases(bugInfo.relatedCases);
        try {
          void setSchema(JSON.parse(bugInfo.description));
        } catch {
          void setSchema(undefined);
        }
      } else {
        void form.resetFields();
        void setSchema(undefined);
        void setRelatedCases(defaultRelatedCases || []);
      }
    }
  }, [visible]);

  /** -------------------------- 关联用例 start -------------------------- */

  /** 关联用例-数据清洗 */
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

  const caseCateTreeDataClean = (node: any) => {
    node.key = node.id;
    node.title = node.name;
    node.children = node.subItems;
    node.children?.forEach((item: any) => caseCateTreeDataClean(item));
  };

  const updateAssociatingCaseTreeSelect = () => {
    void getRequest(getAllTestCaseTree).then((res) => {
      // 新增用例-用例库数据
      const caseCateTreeDataRoot = _.cloneDeep(res.data);
      void caseCateTreeDataClean(caseCateTreeDataRoot);
      void setCates(caseCateTreeDataRoot.children);

      const root = res.data;
      void dataClean(root);
      void setTestCaseTree(root.children);
    });
  };

  /** 获得可关联的测试用例树 */
  useEffect(() => {
    void updateAssociatingCaseTreeSelect();
    void getRequest(getManagerList).then((res) => {
      void setManageList(res.data.usernames);
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
              <Button type="primary" ghost onClick={() => setAddCaseModalVisible(true)}>
                新增用例
              </Button>
            </Space>
          </Form.Item>
          <Form.Item label="描述" name="desc">
            <RichText width="524px" sona={sona} schema={schema} />
          </Form.Item>
          <Form.Item label="经办人" name="agent">
            <Select
              options={manageList.map((item) => ({ label: item, value: item }))}
              optionFilterProp="label"
              showSearch
            />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select options={bugStatusEnum}></Select>
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

      <AddCaseModal
        visible={addCaseModalVisible}
        setVisible={setAddCaseModalVisible}
        cates={cates}
        updateAssociatingCaseTreeSelect={updateAssociatingCaseTreeSelect}
      />
    </>
  );
}
