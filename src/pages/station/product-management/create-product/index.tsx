//创建制品
import React, { useEffect,} from 'react';
import { Modal, Button, Form, Select, Input,} from 'antd';
import { useQueryProductList, useQueryProductVersionList, useCreateIndent } from './hook';
export interface ProductListProps {
  visable?: boolean;
  onClose?: () => any;
  onSave: () => any;
}

export default function CreateProductModal(props: ProductListProps) {
  const { visable, onClose, onSave } = props;
  const [productOptionsLoading, productOptions] = useQueryProductList();
  const [productVersionloading, ProductVersionOptions, queryProductVersionList] = useQueryProductVersionList();
  const [creatLoading, createIndent] = useCreateIndent();
  const [form] = Form.useForm();
  const chooseProduct = (param: any) => {
    queryProductVersionList(param.value);
  };

  const onCreatIndent = () => {
    form.validateFields().then((params) => {
      createIndent({ ...params, productName: params.productName.label }).then(() => {
        onSave();
      });
    });
  };

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, [visable]);

  return (
    <Modal
      title="创建制品"
      visible={visable}
      onCancel={onClose}
      // closable={!loading}
      width={580}
      footer={[
        <Button type="primary" loading={creatLoading} onClick={onCreatIndent}>
          确认
        </Button>,
        <Button onClick={onClose}>取消</Button>,
      ]}
    >
      <Form form={form} labelCol={{ flex: '120px' }}>
        <Form.Item label="制品名称" name="indentName" rules={[{ required: true, message: '请填写制品名称' }]}>
          <Input style={{ width: 320 }}></Input>
        </Form.Item>
        <Form.Item label="建站项目" name="deliveryProject" rules={[{ required: true, message: '请填写建站项目' }]}>
          <Input style={{ width: 320 }}></Input>
        </Form.Item>

        <Form.Item label="制品描述" name="indentDescription" rules={[{ required: true, message: '请填写制品描述' }]}>
          <Input.TextArea style={{ width: 320 }}></Input.TextArea>
        </Form.Item>
        <Form.Item label="建站产品" name="productName" rules={[{ required: true, message: '请选择建站产品' }]}>
          <Select
            style={{ width: 320 }}
            loading={productOptionsLoading}
            options={productOptions}
            labelInValue
            onChange={chooseProduct}
          ></Select>
        </Form.Item>
        <Form.Item label="产品版本" name="productVersion" rules={[{ required: true, message: '请选择产品版本' }]}>
          <Select style={{ width: 320 }} loading={productVersionloading} options={ProductVersionOptions}></Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
