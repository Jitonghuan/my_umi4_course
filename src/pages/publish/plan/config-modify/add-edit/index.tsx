import React, { useState, useEffect } from 'react';
import { Form, Card, Button, Input, Row, Col, Space } from 'antd';
import { history } from 'umi';
import { ContentCard } from '@/components/vc-page-content';
import BaseForm from '../../components/base-form';
import { InitValue, BaseFormProps } from '../../../typing';
import './index.less';

interface ModifyProps extends InitValue {
  config?: string;
}

interface IProps extends BaseFormProps {
  initValueObj?: ModifyProps;
  type: 'add' | 'edit' | 'check';
}

const Coms: React.FC<IProps> = ({ initValueObj, type }) => {
  const [form] = Form.useForm();
  const isCheck = type === 'check';

  const submit = () => {
    form.validateFields().then((value) => {
      console.log(value, 'lll');
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
                name="config"
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
