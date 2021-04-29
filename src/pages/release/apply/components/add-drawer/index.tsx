import React, { useContext, useState, useCallback, useRef } from 'react';
import {
  Drawer,
  Form,
  Input,
  Radio,
  Select,
  DatePicker,
  Button,
  Table,
} from 'antd';

import FEContext from '@/layouts/basic-layout/FeContext';
import {
  queryBizDataReq,
  queryDeployEnvReq,
  queryDeployPlanReq,
} from '../../service';
import { DEPLOY_TYPE_OPTIONS } from '../../const';
import { planSchemaColumns } from '../../schema';

export interface IProps {
  visible: boolean;
  onClose: (reload?: boolean) => void;
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};

const AddDrawer = (props: IProps) => {
  const { visible, onClose } = props;
  const { belongData } = useContext(FEContext);
  const [formInstance] = Form.useForm();

  const [businessData, setBusinessData] = useState<any[]>([]);
  const [deployEnvData, setDeployEnvData] = useState<any[]>([]);
  const [deployPlanData, setDeployPlanData] = useState<any[]>([]);
  const [selectPlan, setSelectPlan] = useState<React.Key[]>([]);

  // 根据所属查询业务线
  const queryBusiness = (belong: string) => {
    setBusinessData([]);
    queryBizDataReq({ belong }).then((datas) => {
      setBusinessData(datas);
    });
  };

  // 根据所属查询机构
  const queryDeployEnv = (belong: string) => {
    setDeployEnvData([]);
    queryDeployEnvReq({ belong }).then((datas) => {
      setDeployEnvData(datas);
    });
  };

  // 根据业务线查询计划
  const queryDeployPlan = (lineCode: string) => {
    setDeployPlanData([]);
    queryDeployPlanReq({ lineCode }).then((datas) => {
      setDeployPlanData(datas);
    });
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectPlan(selectedRowKeys);
    },
  };

  const handleFormChange = useCallback((vals) => {
    const [name, value] = (Object.entries(vals)?.[0] || []) as [string, any];
    if (name && name === 'belongCode') {
      formInstance.resetFields(['lineCode']);
      formInstance.resetFields(['deployEnv']);
      queryBusiness(value);
      queryDeployEnv(value);
      setDeployPlanData([]);
      setSelectPlan([]);
    }
    if (name && name === 'lineCode') {
      setSelectPlan([]);
      queryDeployPlan(value);
    }
  }, []);

  const handleSubmit = () => {
    formInstance.validateFields().then((vals) => {
      // TODO submit
      handleClose(true);
    });
  };

  const handleClose = (reload?: boolean) => {
    formInstance.resetFields();
    setBusinessData([]);
    setDeployEnvData([]);
    setDeployPlanData([]);
    setSelectPlan([]);
    onClose && onClose(reload);
  };

  return (
    <Drawer
      title="新增发布申请"
      visible={visible}
      width="920"
      onClose={() => handleClose()}
      footer={
        <>
          <Button
            type="primary"
            style={{ marginRight: '12px' }}
            onClick={handleSubmit}
          >
            确定
          </Button>
          <Button onClick={() => handleClose()}>取消</Button>
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
            {deployEnvData?.map((el) => (
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
        <Form.Item
          {...tailLayout}
          extra="请在此表单中选择关联的发布计划!"
          label=""
          name="deployUser"
        >
          <Table
            rowKey="id"
            scroll={{ x: 2000 }}
            rowSelection={rowSelection}
            columns={planSchemaColumns}
            dataSource={deployPlanData}
            pagination={false}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

AddDrawer.defaultProps = {};

export default AddDrawer;
