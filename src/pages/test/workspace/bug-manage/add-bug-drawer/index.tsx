import React, { useState, useEffect, useContext, useMemo } from 'react';
import { bugTypeEnum, statusEnum, bugPriorityEnum } from '../../constant';
import { Select, Input, Switch, Button, Form, Space, Drawer, message, Radio, Modal, Tree } from 'antd';
import { addBug, modifyBug, getCaseMultiDeepList, getCaseCategoryPageList } from '../../service';
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
  const [caseTreeData, setCaseTreeData] = useState<any[]>([]);
  const [caseCateList, setCaseCateList] = useState<any[]>([]);
  const [caseCateId, setCaseCateId] = useState<React.Key>();
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
    if (bugInfo) {
      form.setFieldsValue(bugInfo);
      void setRelatedCases(bugInfo.relatedCases);
      try {
        void setSchema(JSON.parse(bugInfo.description));
      } catch {
        void setSchema(undefined);
      }
    } else {
      form.resetFields();
      void setRelatedCases([]);
      void setSchema(undefined);
    }

    if (continueAdd && !bugInfo) return;
    void setVisible(false);
  };

  // useEffect(() => {
  //   if (visible) {

  //   }
  // }, [visible]);

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
  };

  /** -------------------------- 关联用例 start -------------------------- */

  useEffect(() => {
    getRequest(getCaseCategoryPageList, {
      data: {
        pageSize: 1000,
        id: 0,
      },
    }).then((res) => {
      if (!res?.data?.dataSource?.length) return;
      void setCaseCateList(res.data.dataSource);
    });
  }, []);

  useEffect(() => {
    getRequest(getCaseMultiDeepList, { data: { categoryId: 1 } }).then((res) => {
      // TODO: 清洗下数据，放到 caseTreeData 里
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
              <Button type="primary" ghost onClick={() => setAssociationUseCaseModalVisible(true)}>
                关联用例
              </Button>
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

      <Modal
        title="关联用例"
        visible={associationUseCaseModalVisible}
        onCancel={() => setAssociationUseCaseModalVisible(false)}
        className="association-use-case-modal"
        width={400}
      >
        <div className="searchHeader">
          <Select></Select>
          <Input placeholder="请输入关键词" />
        </div>
        <Tree />
      </Modal>
    </>
  );
}
