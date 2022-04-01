// 新增环境抽屉页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/10/25 18:30

import React from 'react';
import { history } from 'umi';
import { getRequest, postRequest, putRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import { Drawer, Input, Button, Form, Select, Space, message, Switch, Divider, Radio, Tag } from 'antd';
import { EnvEditData } from '../env-list/index';
import { createEnv, appTypeList, updateEnv, queryNGList } from '../service';
import './index.less';
export interface EnvEditorProps {
  mode?: EditorMode;
  initData?: EnvEditData;
  onSave: () => any;
  onClose: () => any;
}

export default function addEnvData(props: EnvEditorProps) {
  const [createEnvForm] = Form.useForm();
  const { mode, initData, onSave, onClose } = props;
  const [checkedOption, setCheckedOption] = useState<number>(0); //是否启用nacos
  const [nacosChecked, setNacosChecked] = useState<boolean>(false);
  const [needApplyOption, setNeedApplyOption] = useState<number>(1); //是否启用发布审批
  const [needApplyChecked, setNeedApplyChecked] = useState<boolean>(false);
  //ngInstCode
  const [isBlockChangeOption, setIsBlockChangeOption] = useState<number>(0); //是否封网
  const [isBlockChecked, setIsBlockChecked] = useState<boolean>(false);
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [editEnvCode, setEditEnvCode] = useState<boolean>(false);

  useEffect(() => {
    selectCategory();
  }, [mode]);

  useEffect(() => {
    if (mode === 'HIDE') return;
    queryNGlist();
    createEnvForm.resetFields();
    if (mode === 'VIEW') {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
    if (mode === 'EDIT') {
      setEditEnvCode(true);
    }
    if (initData) {
      if (initData?.isBlock === 1) {
        setIsBlockChecked(true);
        setIsBlockChangeOption(1);
      } else {
        setIsBlockChecked(false);
        setIsBlockChangeOption(0);
      }

      if (initData?.useNacos === 1) {
        setNacosChecked(true);
        setCheckedOption(1);
      } else {
        setNacosChecked(false);
        setCheckedOption(0);
      }
      if (initData?.needApply === 0) {
        setNeedApplyChecked(true);
        setNeedApplyOption(0);
      } else {
        setNeedApplyChecked(false);
        setNeedApplyOption(1);
      }

      createEnvForm.setFieldsValue({
        ...initData,
        isBlock: isBlockChecked,
        useNacos: nacosChecked,
        needApply: needApplyChecked,
      });
    }
  }, [mode]);
  // 加载应用分类下拉选择
  const selectCategory = () => {
    getRequest(appTypeList).then((result) => {
      if (result?.success) {
        const list = (result?.data?.dataSource || [])?.map((n: any) => ({
          label: n.categoryName,
          value: n.categoryCode,
          data: n,
        }));
        setCategoryData(list);
      } else {
        return;
      }
    });
  };
  // 启用发布审批为0，不启用为1
  const handleNeedApplyChange = (checked: boolean) => {
    if (checked === true) {
      setNeedApplyChecked(true);
      setNeedApplyOption(0);
    } else {
      setNeedApplyChecked(false);
      setNeedApplyOption(1);
    }
  };
  //启用配置管理选择
  const handleNacosChange = (checked: boolean) => {
    if (checked === true) {
      setCheckedOption(1);
      setNacosChecked(true);
    } else {
      setCheckedOption(0);
      setNacosChecked(false);
    }
  };
  //是否封网
  const isBlockChange = (checked: boolean) => {
    if (checked === true) {
      setIsBlockChangeOption(1);
      setIsBlockChecked(true);
    } else {
      setIsBlockChangeOption(0);
      setIsBlockChecked(false);
    }
  };

  //查询NG实例
  const [ngInstOptions, setNgInstOptions] = useState<any>([]);
  const queryNGlist = () => {
    getRequest(queryNGList).then((res) => {
      if (res?.success) {
        let data = res?.data?.dataSource;
        let ngList = data?.map((el: any) => ({
          label: el?.ngInstName,
          value: el?.ngInstCode,
        }));
        setNgInstOptions(ngList);
      }
    });
  };
  const handleSubmit = () => {
    if (mode === 'ADD') {
      // const params = createEnvForm.getFieldsValue();
      //新增环境
      createEnvForm.validateFields().then((params) => {
        postRequest(createEnv, {
          data: {
            envTypeCode: params?.envTypeCode,
            categoryCode: params?.categoryCode,
            isBlock: isBlockChangeOption,
            useNacos: checkedOption,
            needApply: needApplyOption,
            proEnvType: 'benchmark',
            nacosAddress: params?.nacosAddress,
            envCode: params?.envCode,
            envName: params?.envName,
            clusterName: params?.clusterName,
            clusterType: params?.clusterType,
            clusterNetType: params?.clusterNetType,
            mark: params?.mark,
            ngInstCode: params?.ngInstCode,
          },
        }).then((result) => {
          if (result.success) {
            message.success('新增环境成功！');
            onSave?.();
          } else {
            message.error(result.errorMsg);
          }
        });
      });
    } else if (mode === 'EDIT') {
      //编辑环境
      // const initValue = createEnvForm.getFieldsValue();
      createEnvForm.validateFields().then((params) => {
        putRequest(updateEnv, {
          data: {
            ...params,
            // envCode: initValue?.envCode,
            // envName: initValue?.envName,
            useNacos: checkedOption,
            isBlock: isBlockChangeOption,
            needApply: needApplyOption,
            proEnvType: 'benchmark',
            // mark: initValue?.mark,
            // nacosAddress: initValue?.nacosAddress,
            // envTypeCode: initValue?.envTypeCode,
            // categoryCode: initValue?.categoryCode,
            // clusterName: initValue?.clusterName,
            // clusterType: initValue?.clusterType,
            // clusterNetType: initValue?.clusterNetType,
            // ngInstCode:params?.ngInstCode,
          },
        }).then((result) => {
          if (result.success) {
            message.success('编辑环境成功！');
            onSave?.();
          } else {
            message.error(result.errorMsg);
          }
        });
      });
    }
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
          onFinish={handleSubmit}
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
            {mode !== 'EDIT' && (
              <Form.Item label="环境CODE：" name="envCode" rules={[{ required: true, message: '这是必填项' }]}>
                <Input style={{ width: 220 }} placeholder="请输入环境CODE" disabled={isDisabled}></Input>
              </Form.Item>
            )}
            {mode === 'EDIT' && (
              <Form.Item label="环境CODE：" name="envCode" rules={[{ required: true, message: '这是必填项' }]}>
                <Input style={{ width: 220 }} placeholder="请输入环境CODE" disabled={editEnvCode}></Input>
              </Form.Item>
            )}
          </div>
          <Form.Item label="当前环境：">
            <Tag color="geekblue">基准环境</Tag>
          </Form.Item>
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
              <Switch
                className="isBlock"
                onChange={isBlockChange}
                checked={isBlockChecked}
                disabled={isDisabled}
              ></Switch>
            </Form.Item>
            <Form.Item name="needApply" label="启用发布审批：">
              <Switch
                className="needApply"
                onChange={handleNeedApplyChange}
                checked={needApplyChecked}
                disabled={isDisabled}
              ></Switch>
            </Form.Item>
            <Form.Item name="useNacos" label="启用配置管理：">
              <Switch
                className="useNacos"
                onChange={handleNacosChange}
                checked={nacosChecked}
                disabled={isDisabled}
              ></Switch>
            </Form.Item>
            {mode !== 'ADD' && checkedOption === 1 && (
              <Form.Item name="nacosAddress" label="Nacos地址：">
                <Input style={{ width: 280 }} placeholder="请输入NaCos地址" disabled={isDisabled}></Input>
              </Form.Item>
            )}
            {mode === 'ADD' && checkedOption === 1 && (
              <Form.Item name="nacosAddress" label="Nacos地址：">
                <Input style={{ width: 280 }} placeholder="请输入NaCos地址" disabled={isDisabled}></Input>
              </Form.Item>
            )}
          </div>
          <Form.Item name="ngInstCode" label="NG实例" rules={[{ required: true, message: '这是必填项' }]}>
            <Select showSearch style={{ width: 280 }} options={ngInstOptions} disabled={isDisabled} />
          </Form.Item>
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
              <Radio value={'vpc'}>私有环境(VPC)</Radio>
              <Radio value={'public'}>公有环境(Public)</Radio>
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
                {/* onClick={handleSubmit} */}
              </Form.Item>
            </Space>
          )}
        </Form>
      </div>
    </Drawer>
  );
}
