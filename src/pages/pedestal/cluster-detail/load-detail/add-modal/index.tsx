import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { history } from 'umi';
import { MinusOutlined, PlusCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Table, Modal, Form, Input, Space, Select } from 'antd';
import './index.less';

export default function AddModal(props: any) {
  const { visible, onCancel, containerOption, type = 'tag', onSave, loading } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue({ tags: [undefined] });
    }
  }, [visible]);
  const handleSubmit = async () => {
    const formValue = await form.validateFields();
    if (formValue) {
      onSave(formValue);
    }
  };
  return (
    <Modal
      title={type === 'tag' ? '新增标签' : '新增环境变量'}
      width={500}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button onClick={onCancel}>取消</Button>,
        <Button type="primary" onClick={handleSubmit} loading={loading}>
          确认
        </Button>,
      ]}
    >
      <div className="load-tag-wrapper">
        <Form form={form} name="base" autoComplete="off" colon={false}>
          {type === 'var' && (
            <Form.Item label="请选择容器" name="container" rules={[{ required: true, message: '请选择容器' }]}>
              <Select options={containerOption} style={{ width: '240px' }}></Select>
            </Form.Item>
          )}
          <Form.List name="tags">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space key={field.key} align="baseline">
                    <Form.Item>
                      <MinusCircleOutlined className="tag-icon" onClick={() => remove(field.name)} />
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate>
                      {() => (
                        <Form.Item
                          className="v-item"
                          {...field}
                          // label="KEY"
                          label={index === 0 ? 'KEY' : ''}
                          name={[field.name, 'key']}
                          rules={[{ required: true, message: '此项为必填项' }]}
                        >
                          <Input size="small" />
                        </Form.Item>
                      )}
                    </Form.Item>
                    <span style={{ verticalAlign: 'text-bottom', lineHeight: '45px' }}>=</span>
                    <Form.Item
                      {...field}
                      // label="VALUE"
                      className="v-item"
                      label={index === 0 ? 'VALUE' : ''}
                      name={[field.name, 'value']}
                    >
                      <Input size="small" />
                    </Form.Item>
                    <Form.Item>
                      <PlusCircleOutlined className="tag-icon" onClick={() => add()} />
                    </Form.Item>
                  </Space>
                ))}
              </>
            )}
          </Form.List>
        </Form>
      </div>
    </Modal>
  );
}
