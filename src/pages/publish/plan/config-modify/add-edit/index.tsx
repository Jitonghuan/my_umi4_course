import React, { useState, useEffect } from 'react';
import { Form, Card, Button, Input, Row, Col, Space, message } from 'antd';
import { history } from 'umi';
import { ContentCard } from '@/components/vc-page-content';
import BaseForm from '../../components/base-form';
import { InitValue, BaseFormProps } from '../../../typing';
import './index.less';
import { addPublishPlanReq } from '@/pages/publish/service';

interface ModifyProps extends InitValue {
  config?: string;
  id?: string;
}

interface IProps extends BaseFormProps {
  initValueObj?: ModifyProps;
  type: 'add' | 'edit' | 'check';
}

const Coms: React.FC<IProps> = ({ initValueObj, type }) => {
  console.log('initValueObj', initValueObj);
  const [form] = Form.useForm();
  const isCheck = type === 'check';

  const submit = () => {
    form.validateFields().then((value) => {
      const { preDeployTime, ...rest } = value;
      addPublishPlanReq({
        ...(type === 'edit' ? { id: initValueObj?.id } : {}),
        ...rest,
        deployType: 'config',
        preDeployTime: preDeployTime.format('YYYY-MM-DD'),
      }).then((resp) => {
        if (resp.success) {
          message.info('保存配置变更成功!');
          history.goBack();
        }
      });
    });
  };

  useEffect(() => {
    form.setFieldsValue({});
  }, [initValueObj]);

  return (
    <ContentCard>
      <Card
        bordered={false}
        title="基本信息"
        className="base-info"
        headStyle={{ paddingLeft: 0 }}
      >
        <Form form={form} className="form-list">
          {<BaseForm initValueObj={initValueObj} isCheck={isCheck} />}
        </Form>
      </Card>
      <Card
        bordered={false}
        title="配置变更内容"
        headStyle={{ paddingLeft: 0 }}
        className="content-info"
      >
        <Row>
          <Col span={18}>
            <Form form={form} className="form-list">
              <Form.Item
                label="配置变更"
                required
                name="configs"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 18 }}
                initialValue={initValueObj?.config}
              >
                <Input.TextArea
                  rows={18}
                  placeholder="请在此输入配置变更内容"
                  disabled={isCheck}
                />
              </Form.Item>
              {!isCheck && (
                <Form.Item wrapperCol={{ span: 18, offset: 2 }}>
                  <Space>
                    <Button type="primary" onClick={submit}>
                      确定
                    </Button>
                    <Button onClick={() => history.goBack()}>取消</Button>
                  </Space>
                </Form.Item>
              )}
            </Form>
          </Col>
        </Row>
      </Card>
    </ContentCard>
  );
};

export default Coms;
