import React, { useContext, useState, useCallback } from 'react';
import { Drawer, Form, Input, Radio, Select, DatePicker, Button } from 'antd';

import FEContext from '@/layouts/basic-layout/FeContext';
import { queryBizDatas } from '../../service';
import { DEPLOY_TYPE_OPTIONS } from '../../const';

export interface IProps {
  visible: boolean;
  onClose: (reload?: boolean) => void;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const AddDrawer = (props: IProps) => {
  const { visible, onClose } = props;
  const { belongData } = useContext(FEContext);
  const [formInstance] = Form.useForm();

  const [businessData, setBusinessData] = useState<any[]>([]);
  const [envData, setEnvData] = useState<any[]>([]);

  // 根据所属查询业务线
  const queryBusiness = (belong: string) => {
    queryBizDatas({ belong }).then((datas) => {
      setBusinessData(datas);
    });
  };

  const handleFormChange = useCallback((vals) => {
    console.log(vals);
    const [name, value] = (Object.entries(vals)?.[0] || []) as [string, any];
    if (name && name === 'belongCode') {
      formInstance.resetFields(['lineCode']);
      queryBusiness(value);
    }
  }, []);

  const handleSubmit = () => {
    formInstance.validateFields().then((vals) => {
      // TODO
      onClose && onClose(true);
    });
  };

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Drawer
      title="新增发布申请"
      visible={visible}
      width={720}
      onClose={handleClose}
      footer={
        <>
          <Button
            type="primary"
            style={{ marginRight: '12px' }}
            onClick={handleSubmit}
          >
            确定
          </Button>
          <Button onClick={handleClose}>取消</Button>
        </>
      }
      footerStyle={{
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <Form
        {...layout}
        name="basic"
        form={formInstance}
        onValuesChange={handleFormChange}
      >
        <Form.Item
          label="所属"
          name="belongCode"
          rules={[{ required: true, message: '请选择所属!' }]}
        >
          <Radio.Group>
            {belongData?.map((el) => (
              <Radio value={el.belongCode}>{el.belongName}</Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="业务线"
          name="lineCode"
          rules={[{ required: true, message: '请选择业务线!' }]}
        >
          <Select placeholder="请选择">
            {businessData?.map((el) => (
              <Select.Option key={el.lineCode} value={el.lineCode}>
                {el.lineName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="发布申请名"
          name="title"
          rules={[{ required: true, message: '请输入发布申请名!' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="发布类型"
          name="deployType"
          rules={[{ required: true, message: '请选择发布类型!' }]}
        >
          <Radio.Group>
            {DEPLOY_TYPE_OPTIONS?.map((el) => (
              <Radio value={el.value}>{el.label}</Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="机构"
          name="deployEnv"
          rules={[{ required: true, message: '请选择机构!' }]}
        >
          <Select placeholder="请选择">
            {envData?.map((el) => (
              <Select.Option key={el.value} value={el.value}>
                {el.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="计划发布时间"
          name="deployDate"
          rules={[{ required: true, message: '请选择计划发布时间!' }]}
        >
          <DatePicker
            placeholder="请选择"
            format={'YYYY-MM-DD'}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          label="发布负责人"
          name="deployUser"
          rules={[{ required: true, message: '请输入发布负责人!' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

AddDrawer.defaultProps = {};

export default AddDrawer;
