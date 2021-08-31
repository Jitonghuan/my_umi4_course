import React, { useState, useEffect, useContext, useMemo } from 'react';
import { bugTypeEnum, bugStatusEnum, bugPriorityEnum } from '../../constant';
import { Select, Input, Switch, Button, Form, Space, Drawer, message, Radio, Modal, TreeSelect, Cascader } from 'antd';
import {
  addBug,
  modifyBug,
  getAllTestCaseTree,
  getCaseCategoryPageList,
  getManagerList,
  getProjectTreeData,
} from '../../service';
import { getRequest, postRequest } from '@/utils/request';
import { createSona } from '@cffe/sona';
import AddCaseModal from '../../test-case/add-case-drawer';
import RichText from '@/components/rich-text';
import FELayout from '@cffe/vc-layout';
import _ from 'lodash';
import './index.less';

export default function BugManage(props: any) {
  const { visible, setVisible, bugInfo, updateBugList, defaultRelatedCases, phaseId, onAddBug, projectTreeData } =
    props;
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
    try {
      void (await form.validateFields());
    } catch (e) {
      return;
    }
    // const finishLoading = message.loading(bugInfo ? '正在修改' : '正在新增');
    const formData = form.getFieldsValue();
    const requestParams = {
      ...formData,
      projectId: formData.demandId[0] && +formData.demandId[0],
      demandId: formData.demandId[1] && +formData.demandId[1],
      subDemandId: formData.demandId[2] && +formData.demandId[2],
      desc: JSON.stringify(sona.schema),
      onlineBug: formData.onlineBug ? 1 : 0,
      relatedCases,
      id: bugInfo?.id,
      ...(bugInfo ? { modifyUser: userInfo.userName } : { createUser: userInfo.userName }),
      phaseId,
    };
    const res = await postRequest(bugInfo ? modifyBug : addBug, { data: requestParams }).finally(() => {
      // void finishLoading();
    });
    void message.success(bugInfo ? '修改成功' : '新增成功');
    // 钩子
    void (onAddBug && onAddBug({ ...requestParams, id: res.data.id }));

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
        const demandId = [];
        bugInfo.projectId && demandId.push(bugInfo.projectId);
        bugInfo.demandId && demandId.push(bugInfo.demandId);
        bugInfo.subDemandId && demandId.push(bugInfo.subDemandId);
        void form.setFieldsValue({ ...bugInfo, demandId });
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

    // void getRequest(getProjectTreeData).then((res) => {
    //   const Q = [...res.data];
    //   while (Q.length) {
    //     const cur = Q.shift();
    //     cur.label = cur.name;
    //     cur.value = cur.id;
    //     cur.children && Q.push(...cur.children);
    //   }
    //   void setProjectTreeData(res.data);
    // });
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
          <Form.Item label="标题" name="name" rules={[{ required: true, message: '请输入标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="项目/需求" name="demandId" rules={[{ required: true, message: '请选择项目/需求' }]}>
            <Cascader placeholder="请选择" options={projectTreeData} />
          </Form.Item>
          <Form.Item label="优先级" name="priority" rules={[{ required: true, message: '请选择优先级' }]}>
            <Radio.Group>
              {bugPriorityEnum.map((title, index) => (
                <Radio value={index} key={index}>
                  {title}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item label="类型" name="bugType" rules={[{ required: true, message: '请选择类型' }]}>
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
          <Form.Item label="经办人" name="agent" rules={[{ required: true, message: '请选择经办人' }]}>
            <Select
              options={manageList.map((item) => ({ label: item, value: item }))}
              optionFilterProp="label"
              showSearch
            />
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
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
        isModal
        visible={addCaseModalVisible}
        setVisible={setAddCaseModalVisible}
        cates={cates}
        onSuccess={updateAssociatingCaseTreeSelect}
      />
    </>
  );
}
