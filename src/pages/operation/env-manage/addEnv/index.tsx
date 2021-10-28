// 新增环境抽屉页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/10/25 18:30

import React from 'react';
import { history } from 'umi';
import { getRequest, postRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import { Drawer, Input, Button, Form, Select, Space, message, Switch, Divider, Radio } from 'antd';
import { EnvEditData } from '../env-list/index';
import { createEnv, appTypeList } from '../service';
export interface EnvEditorProps {
  mode?: EditorMode;
  initData?: EnvEditData;
  onClose?: () => any;
  onSave?: () => any;
}

export default function addEnvData(props: EnvEditorProps) {
  const [createEnvForm] = Form.useForm();
  const { mode, onClose, onSave, initData } = props;
  const [checkedOption, setCheckedOption] = useState<number>();
  const [isBlockChangeOption, setIsBlockChangeOption] = useState<number>();
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    selectCategory();
  }, [mode]);

  useEffect(() => {
    if (mode === 'HIDE') return;
    createEnvForm.resetFields();
    if (mode === 'VIEW') {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
    if (initData) {
      let isBlockCurrent;
      let useNacosCurrent;
      if (initData?.isBlock === 1) {
        isBlockCurrent == true;
      } else {
        isBlockCurrent == false;
      }

      if (initData?.useNacos === 1) {
        useNacosCurrent == true;
      } else {
        useNacosCurrent == false;
      }
      createEnvForm.setFieldsValue({
        // envTypeCode: initData?.envTypeCode,
        // envName: initData?.envName,
        // envCode: initData?.envCode,
        // categoryCode: initData?.categoryCode,
        // mark: initData?.mark,
        ...initData,
        isBlock: isBlockCurrent,
        useNacos: useNacosCurrent,
        // nacosAddress: initData?.nacosAddress,
        // clusterName:initData?.clusterName,
        // clusterType:initData?.clusterType,
        // clusterNetType:initData?.clusterNetType,
      });
    }
  }, [mode]);
  // 加载应用分类下拉选择
  const selectCategory = () => {
    getRequest(appTypeList).then((result) => {
      const list = (result.data.dataSource || []).map((n: any) => ({
        label: n.categoryName,
        value: n.categoryCode,
        data: n,
      }));
      setCategoryData(list);
    });
  };
  //启用配置管理选择
  const handleNacosChange = (checked: boolean) => {
    if (checked === true) {
      setCheckedOption(1);
    } else {
      setCheckedOption(0);
    }
  };
  //是否封网
  const isBlockChange = (checked: boolean) => {
    if (checked === true) {
      setIsBlockChangeOption(1);
    } else {
      setIsBlockChangeOption(0);
    }
  };
  //新增环境
  const addEnv = (params: any) => {
    console.log('params', params);
    postRequest(createEnv, {
      data: {
        envTypeCode: params?.envTypeCode,
        categoryCode: params?.categoryCode,
        isBlock: isBlockChangeOption,
        useNacos: checkedOption,
        nacosAddress: params?.nacosAddress,
        envCode: params?.envCode,
        envName: params?.envName,
        clusterName: params?.clusterName,
        clusterType: params?.clusterType,
        clusterNetType: params?.clusterNetType,
        mark: params?.mark,
      },
    }).then((result) => {
      if (result.success) {
        message.success('新增环境成功！');
        onSave?.();
      } else {
        message.error(result.errorMsg);
      }
    });
  };
  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title={mode === 'EDIT' ? '编辑环境' : mode === 'VIEW' ? '查看环境' : '新增环境'}
      // maskClosable={false}
      initData={initData}
      onClose={onClose}
      width={'40%'}
    >
      <div className="envAdd">
        <Form
          form={createEnvForm}
          labelCol={{ flex: '120px' }}
          onFinish={addEnv}
          onReset={() => {
            createEnvForm.resetFields();
          }}
        >
          <Form.Item label="环境大类：" name="envTypeCode" rules={[{ required: true, message: '这是必填项' }]}>
            {/* onChange={onEnvTypeChange} value={envTypeValue} */}
            <Radio.Group disabled={isDisabled}>
              <Radio value={'dev'}>DEV</Radio>
              <Radio value={'test'}>TEST</Radio>
              <Radio value={'pre'}>PRE</Radio>
              <Radio value={'prod'}>PROD</Radio>
            </Radio.Group>
          </Form.Item>
          <div>
            <Form.Item label="环境名：" name="envName" rules={[{ required: true, message: '这是必填项' }]}>
              <Input style={{ width: 220 }} placeholder="请输入环境名" disabled={isDisabled}></Input>
            </Form.Item>
          </div>
          <div>
            <Form.Item label="环境CODE：" name="envCode" rules={[{ required: true, message: '这是必填项' }]}>
              <Input style={{ width: 220 }} placeholder="请输入环境CODE" disabled={isDisabled}></Input>
            </Form.Item>
          </div>
          <div>
            <Form.Item label="默认分类：" name="categoryCode" rules={[{ required: true, message: '这是必选项' }]}>
              <Select showSearch style={{ width: 150 }} options={categoryData} disabled={isDisabled} />
            </Form.Item>
          </div>
          <div>
            <Form.Item name="mark" label="备注：">
              <Input.TextArea
                placeholder="请输入"
                style={{ width: 480, height: 80 }}
                disabled={isDisabled}
              ></Input.TextArea>
            </Form.Item>
          </div>
          <Divider />
          <div>
            <Form.Item name="isBlock" label="是否封网：">
              <Switch onChange={isBlockChange} disabled={isDisabled}></Switch>
            </Form.Item>
            <Form.Item name="useNacos" label="启用配置管理：">
              <Switch onChange={handleNacosChange} disabled={isDisabled}></Switch>
            </Form.Item>
            {checkedOption === 1 && (
              <Form.Item name="nacosAddress" label="NaCos地址：">
                <Input style={{ width: 280 }} placeholder="请输入NaCos地址" disabled={isDisabled}></Input>
              </Form.Item>
            )}
          </div>
          <Form.Item name="clusterName" label="集群名称" rules={[{ required: true, message: '这是必填项' }]}>
            <Input placeholder="请输入集群名称" style={{ width: 280 }} disabled={isDisabled}></Input>
          </Form.Item>
          <Form.Item label="集群类型:" name="clusterType" rules={[{ required: true, message: '这是必填项' }]}>
            {/* onChange={onClusterTypeChange} value={clusterType} */}
            <Radio.Group disabled={isDisabled}>
              <Radio value={'vm'}>虚拟机</Radio>
              <Radio value={'k8s'}>kubernetes</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="集群网络类型:" name="clusterNetType" rules={[{ required: true, message: '这是必填项' }]}>
            {/* onChange={onClusterNetTypeChange} value={clusterNetType} */}
            <Radio.Group disabled={isDisabled}>
              <Radio value={'vpc'}>私有环境</Radio>
              <Radio value={'public'}>公有环境</Radio>
            </Radio.Group>
          </Form.Item>
          <Divider />
          {isDisabled !== true && (
            <Space size="small" style={{ marginTop: '50px', float: 'right' }}>
              <Form.Item>
                <Button type="ghost" htmlType="reset" onClick={onClose}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit" style={{ marginLeft: '4px' }}>
                  保存
                </Button>
              </Form.Item>
            </Space>
          )}
        </Form>
      </div>
    </Drawer>
  );
}
