import React, { useState, useEffect, useContext, useMemo } from 'react';
import { bugTypeEnum, bugStatusEnum, bugPriorityEnum } from '../../constant';
import {
  Select,
  Input,
  Switch,
  Button,
  Form,
  Space,
  Drawer,
  message,
  Radio,
  Modal,
  TreeSelect,
  Cascader,
  Row,
  Col,
} from 'antd';
import { addBug, modifyBug, getManagerList, getAllTestCaseTree, getCaseCategoryDeepList } from '../../service';
import { getRequest, postRequest } from '@/utils/request';
import { createSona } from '@cffe/sona';
import AddCaseModal from '../../test-case/add-case-drawer';
import RichText from '@/components/rich-text';
import FELayout from '@cffe/vc-layout';
import _ from 'lodash';
import './index.less';

export default function BugManage(props: any) {
  const {
    visible,
    setVisible,
    bugInfo,
    updateBugList,
    defaultRelatedCases,
    phaseId,
    onAddBug,
    projectTreeData,
    readOnly,
  } = props;
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [relatedCases, setRelatedCases] = useState<any[]>([]);
  const [schema, setSchema] = useState<any[]>();
  const [addCaseModalVisible, setAddCaseModalVisible] = useState<boolean>(false);
  const [testCaseTree, setTestCaseTree] = useState<any[]>([]);
  const [manageList, setManageList] = useState<string[]>([]);
  const [caseCateTreeData, setCaseCateTreeData] = useState<any[]>([]);
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

  const updateAssociatingCaseTreeSelect = () => {
    void getRequest(getAllTestCaseTree).then((res) => {
      // 新增用例-用例库数据
      void setTestCaseTree(res.data);
    });
  };

  const handleAddCaseSuccess = (newCase: any) => {
    console.log('newCase :>> ', newCase);
    void updateAssociatingCaseTreeSelect();
    void setRelatedCases([...relatedCases, newCase?.id]);
  };

  /** 获得可关联的测试用例树 */
  useEffect(() => {
    void updateAssociatingCaseTreeSelect();
    void getRequest(getManagerList).then((res) => {
      void setManageList(res.data.usernames);
    });
  }, []);

  /** -------------------------- 关联用例 end -------------------------- */

  const dataCleanCateTree = (node: any) => {
    node.key = node.id;
    node.title = node.name;
    node.children = node.items;
    node.children?.forEach((item: any) => dataCleanCateTree(item));

    return node;
  };

  useEffect(() => {
    getRequest(getCaseCategoryDeepList).then((res) => {
      const curTreeData = dataCleanCateTree({ key: -1, items: res.data }).children;
      void setCaseCateTreeData(curTreeData || []);
    });
  }, []);

  return (
    <>
      <Drawer
        visible={visible}
        onClose={() => setVisible(false)}
        width={700}
        title={bugInfo ? '编辑Bug' : '新增Bug'}
        className="test-workspace-bug-manage-add-bug-drawer"
        maskClosable={false}
        destroyOnClose
      >
        <Form {...formItemLayout} form={form}>
          <Form.Item label="标题" name="name" rules={[{ required: true, message: '请输入标题' }]}>
            <Input disabled={readOnly} />
          </Form.Item>
          <Form.Item label="项目/需求" name="demandId" rules={[{ required: true, message: '请选择项目/需求' }]}>
            <Cascader placeholder="请选择" options={projectTreeData} disabled={readOnly} />
          </Form.Item>

          <Row className="row-form-item">
            <Col span="10" push="2" className="col-form-item">
              <span className="form-item-label">优先级: </span>
              <Form.Item
                name="priority"
                rules={[{ required: true, message: '请选择优先级' }]}
                className="form-item-info"
              >
                <Radio.Group disabled={readOnly}>
                  {bugPriorityEnum.map((title, index) => (
                    <Radio value={index} key={index}>
                      {title}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span="7" style={{ display: 'flex' }} className="col-form-item ">
              <span className="form-item-label">类型: </span>
              <Form.Item name="bugType" rules={[{ required: true, message: '请选择类型' }]} className="form-item-info">
                <Select disabled={readOnly}>
                  {bugTypeEnum.map((title, index) => (
                    <Select.Option value={index} key={index}>
                      {title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span="7" style={{ display: 'flex' }} className="col-form-item ">
              <span className="form-item-label">是否线上Bug: </span>
              <Form.Item valuePropName="checked" name="onlineBug" className="form-item-info">
                <Switch disabled={readOnly} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="关联用例" name="relatedCases">
            <Space>
              <TreeSelect
                disabled={readOnly}
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
              {readOnly ? null : (
                <Button type="primary" ghost onClick={() => setAddCaseModalVisible(true)}>
                  新增用例
                </Button>
              )}
            </Space>
          </Form.Item>
          <Form.Item label="描述" name="desc">
            <RichText width="520px" height="500px" sona={sona} schema={schema} readOnly={readOnly} />
          </Form.Item>
          <Form.Item label="经办人" name="agent" rules={[{ required: true, message: '请选择经办人' }]}>
            <Select
              disabled={readOnly}
              options={manageList.map((item) => ({ label: item, value: item }))}
              optionFilterProp="label"
              showSearch
            />
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
            <Select disabled={readOnly} options={bugStatusEnum}></Select>
          </Form.Item>
        </Form>

        <div className="footer">
          <Space>
            {readOnly ? (
              <Button type="primary" onClick={() => setVisible(false)}>
                关闭
              </Button>
            ) : (
              <>
                {' '}
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
              </>
            )}
          </Space>
        </div>
      </Drawer>

      <AddCaseModal
        isModal
        visible={addCaseModalVisible}
        setVisible={setAddCaseModalVisible}
        onSuccess={handleAddCaseSuccess}
        caseCateTreeData={caseCateTreeData}
      />
    </>
  );
}
