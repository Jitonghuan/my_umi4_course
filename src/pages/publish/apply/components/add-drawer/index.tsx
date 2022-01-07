import React, { useContext, useState, useCallback, useRef, useMemo } from 'react';
import { Drawer, Form, Input, Radio, Select, DatePicker, Button, Table, Divider } from 'antd';

import { FeContext } from '@/common/hooks';
import { DEPLOY_TYPE_OPTIONS } from '../../const';
import { createPlanSchemaColumns } from '../../schema';
import {
  addPublishApplyReq,
  queryAppGroupReq,
  queryEnvsReq,
  queryPublishPlanReq,
  queryPlanNoApplyRel,
} from '@/pages/publish/service';

export interface IProps {
  visible: boolean;
  envsUrlList: any[];
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
  const { visible, onClose, envsUrlList } = props;
  const { categoryData = [], businessData: businessDataList = [] } = useContext(FeContext);
  const [formInstance] = Form.useForm();
  const [businessData, setBusinessData] = useState<any[]>([]);
  const [businessCurrent, setBusinessCurrent] = useState<string>();
  const [appCategoryCodeCurrent, setAppCategoryCodeCurrent] = useState<string>();
  const [deployEnvData, setDeployEnvData] = useState<any[]>([]);
  const [deployPlanData, setDeployPlanData] = useState<any[]>([]);
  const [selectPlan, setSelectPlan] = useState<React.Key[]>([]);
  const [businessPlanData, setBusinessPlanData] = useState<any[]>([]);

  // 根据应用分类查询应用组
  const queryBusiness = (categoryCode: string) => {
    setBusinessData([]);
    queryAppGroupReq({ categoryCode }).then((datas) => {
      setBusinessData(datas.list);
      setBusinessPlanData(datas.list);
    });
  };

  // 根据应用分类查询环境
  const queryDeployEnv = (categoryCode: string) => {
    setDeployEnvData([]);
    queryEnvsReq({ categoryCode, envTypeCode: 'prod' }).then((datas) => {
      setDeployEnvData(datas.list);
    });
  };

  // 根据应用分类和应用组查询未上线的计划
  const queryDeployPlan = (appCategoryCode: string, appGroupCode: string, deployStatus: number) => {
    setDeployPlanData([]);
    queryPlanNoApplyRel({ appGroupCode, appCategoryCode, deployStatus }).then((datas) => {
      setDeployPlanData(
        datas.map((data: any) => {
          return {
            ...data.plan,
          };
        }),
      );
    });
  };

  const changeAppGroupCode = (value: string) => {
    setBusinessCurrent(value);
  };
  const planAppCategory = (categoryCode: string) => {
    setAppCategoryCodeCurrent(categoryCode);
    queryAppGroupReq({ categoryCode }).then((datas) => {
      setBusinessPlanData(datas.list);
    });
    setBusinessCurrent('');
  };

  const planAppGroup = (appGroupValue: string) => {
    setBusinessCurrent(appGroupValue);
    queryDeployPlan(appCategoryCodeCurrent || '', appGroupValue, 0);
  };
  const rowSelection = useMemo(() => {
    return {
      selectedRowKeys: selectPlan,
      onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        setSelectPlan(selectedRowKeys);
      },
    };
  }, [selectPlan]);
  const [appCategoryCode, setAppCategoryCode] = useState<string>();

  const handleFormChange = useCallback(
    (vals) => {
      const [name, value] = (Object.entries(vals)?.[0] || []) as [string, any];
      if (name && name === 'appCategoryCode') {
        formInstance.resetFields(['appGroupCode']);
        formInstance.resetFields(['deployEnv']);
        setBusinessCurrent('');
        queryBusiness(value);
        queryDeployEnv(value);
        setDeployPlanData([]);
        setSelectPlan([]);
        setAppCategoryCode(value);
        setAppCategoryCodeCurrent(value);
      }
      if (name && name === 'appGroupCode') {
        setSelectPlan([]);
        queryDeployPlan(appCategoryCode || '', value, 0);
      }
    },
    [appCategoryCode],
  );

  const handleSubmit = () => {
    formInstance.validateFields().then((vals) => {
      addPublishApplyReq({
        applyInfo: {
          ...vals,
          deployEnv: vals.deployEnv.join(','),
          deployDate: vals.deployDate.format('YYYY-MM-DD HH:mm'),
        },
        planIds: selectPlan,
      }).then((resp) => {
        if (resp?.success) {
          handleClose(true);
        }
      });
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
      maskClosable={false}
      footer={
        <>
          <Button type="primary" style={{ marginRight: '12px' }} onClick={handleSubmit}>
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
      <Form {...layout} name="basic" form={formInstance} onValuesChange={handleFormChange}>
        <Form.Item
          label="发布环境的应用分类"
          name="appCategoryCode"
          rules={[{ required: true, message: '请选择应用分类!' }]}
        >
          <Select>
            {categoryData?.map((el) => (
              <Select.Option key={el.value} value={el.value}>
                {el.label}
              </Select.Option>
            ))}
          </Select>
          {/* <Radio.Group>
            {categoryData?.map((el) => (
              <Radio key={el.value} value={el.value}>
                {el.label}
              </Radio>
            ))}
          </Radio.Group> */}
        </Form.Item>
        <Form.Item label="应用组" name="appGroupCode" rules={[{ required: true, message: '请选择应用组!' }]}>
          <Select placeholder="请选择" onChange={changeAppGroupCode}>
            {businessData?.map((el) => (
              <Select.Option key={el.value} value={el.value}>
                {el.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="发布申请名" name="title" rules={[{ required: true, message: '请输入发布申请名!' }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="发布类型" name="deployType" rules={[{ required: true, message: '请选择发布类型!' }]}>
          <Radio.Group>
            {DEPLOY_TYPE_OPTIONS?.map((el) => (
              <Radio value={el.value}>{el.label}</Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="发布环境" name="deployEnv" rules={[{ required: true, message: '请选择发布环境!' }]}>
          <Select mode="multiple" placeholder="请选择">
            {deployEnvData?.map((el) => (
              <Select.Option key={el.value} value={el.value}>
                {el.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="计划发布时间" name="deployDate" rules={[{ required: true, message: '请选择计划发布时间!' }]}>
          <DatePicker
            placeholder="请选择发布时间"
            format={'YYYY-MM-DD HH:mm'}
            showTime={{ format: 'HH:mm' }}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label="发布负责人" name="deployUser" rules={[{ required: true, message: '请输入发布负责人!' }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Divider />
        <Form.Item label="发布计划的应用分类">
          <Select options={categoryData} value={appCategoryCodeCurrent} onChange={planAppCategory}></Select>
        </Form.Item>
        <Form.Item label="发布计划的应用组">
          <Select placeholder="请选择" value={businessCurrent} onChange={planAppGroup}>
            {businessPlanData?.map((el) => (
              <Select.Option key={el.value} value={el.value}>
                {el.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout} extra="请在此表单中选择关联的发布计划!" label="" name="planIds">
          <Table
            rowKey="planId"
            scroll={{ x: 2000 }}
            rowSelection={rowSelection}
            columns={createPlanSchemaColumns({
              categoryData,
              businessDataList,
            })}
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
