import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Select, Input, Switch, Button, Table, Form, Space, Drawer, Row, Col, Checkbox, message } from 'antd';
import { bugTypeEnum, statusEnum, priorityEnum } from '../../constant';
import { addBug, modifyBug } from '../../service';
import { createSona } from '@cffe/sona';
import RichText from '@/components/rich-text';
import FELayout from '@cffe/vc-layout';
import './index.less';
import { postRequest } from '@/utils/request';

export default function BugManage(props: any) {
  const { visible, setVisible, projectList, bugInfo } = props;
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [continueAdd, setContinueAdd] = useState(false);
  const [relatedCases, setRelatedCases] = useState<any[]>([]);
  const [form] = Form.useForm();
  const sona = useMemo(() => createSona(), []);

  const submit = async () => {
    const finishLoading = message.loading(bugInfo ? '正在修改' : '正在新增');
    const formData = form.getFieldsValue();
    const requestParams = {
      ...formData,
      desc: JSON.stringify(sona.schema),
      createUser: userInfo.userName,
      onlineBug: formData.onlineBug ? 1 : 0,
      relatedCases,
      id: bugInfo.id,
    };
    await postRequest(bugInfo ? modifyBug : addBug, { data: requestParams }).finally(() => {
      void finishLoading();
    });
    void message.success(bugInfo ? '修改成功' : '新增成功');
    if (continueAdd && !bugInfo) return;
    void setVisible(false);
  };

  useEffect(() => {
    if (visible) {
      form.resetFields();
      void setRelatedCases([]);
      sona.schema = [];
      bugInfo && form.setFieldsValue(bugInfo);
    }
  }, [visible]);

  return (
    <Drawer
      visible={visible}
      onClose={() => setVisible(false)}
      width={700}
      title={bugInfo ? '编辑Bug' : '新增Bug'}
      className="test-workspace-bug-manage-add-bug-drawer"
      maskClosable={false}
    >
      <Form labelCol={{ style: { width: '100px' } }} labelAlign="left" form={form}>
        <Row gutter={[16, 0]}>
          <Col span="24">
            <Form.Item label="标题" name="name">
              <Input />
            </Form.Item>
          </Col>
          <Col span="12">
            <Form.Item label="所属业务" name="business">
              <Select>
                {projectList.map((item: any) => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.categoryName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span="12">
            <Form.Item label="优先级" name="priority">
              <Select>
                {priorityEnum.map((title, index) => (
                  <Select.Option value={index} key={index}>
                    {title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span="12">
            <Form.Item label="类型" name="bugType">
              <Select>
                {bugTypeEnum.map((title, index) => (
                  <Select.Option value={index} key={index}>
                    {title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span="12">
            <Form.Item label="是否线上Bug" valuePropName="checked" name="onlineBug">
              <Switch />
            </Form.Item>
          </Col>
          <Col span="24">
            <Form.Item label="描述" name="desc">
              <RichText width="560px" sona={sona} />
            </Form.Item>
          </Col>
          <Col span="24">
            <Form.Item label="关联用例" name="relatedCases">
              icon1,icon2,list
            </Form.Item>
          </Col>
          <Col span="12">
            <Form.Item label="经办人" name="agent">
              <Input />
            </Form.Item>
          </Col>
          <Col span="12" />
          <Col span="12">
            <Form.Item label="状态" name="status">
              <Select>
                {statusEnum.map((title, index) => (
                  <Select.Option value={index} key={index}>
                    {title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className="footer">
        <Checkbox checked={continueAdd} onChange={(e) => setContinueAdd(e.target.checked)}>
          继续新增下一个
        </Checkbox>
        <Button type="primary" className="ml-auto" onClick={() => setVisible(false)}>
          取消
        </Button>
        <Button type="primary" className="ml-12" onClick={submit}>
          确定
        </Button>
      </div>
    </Drawer>
  );
}
