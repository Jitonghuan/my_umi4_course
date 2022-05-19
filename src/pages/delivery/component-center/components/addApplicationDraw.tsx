// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2022/05/10 10:30

import React from 'react';
import { useState, useEffect } from 'react';
import { Drawer, Button, Form, Tree, Spin, Select, Space, Divider, Input, message } from 'antd';
import { useAddApplication, useGetApplicationOption, useQueryEnvList } from '../hook';
import { getRequest } from '@/utils/request';
import { getVersionCheck } from '../../service';

export interface AppComponentProps {
  mode: EditorMode;
  productLineOptions?: any;
  tabActiveKey: string;
  curProductLine: string;
  curVersion?: string;
  versionId?: number;
  initData?: any;
  onClose?: () => any;
  onSave: () => any;
}

export default function TmplEditor(props: AppComponentProps) {
  const [addForm] = Form.useForm();
  const { mode, initData, productLineOptions, tabActiveKey, onClose, curVersion, onSave, versionId, curProductLine } =
    props;
  const [selectedKeys, setSelectedKeys] = useState<any>([]);
  const [curComponentName, setCurComponentName] = useState<any>([]);
  const [addLoading, addApplication] = useAddApplication();
  const [appLoading, applicationOptions, setAppOptions, getApplicationOption] = useGetApplicationOption();
  const [envListLoading, envDataSource, queryEnvData] = useQueryEnvList();
  const [loading, setLoading] = useState<boolean>(false);
  const [rightInfo, setRightInfo] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [type, setType] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  //   const [form] = Form.useForm();
  const handleSubmit = () => {
    if (type === 'success') {
      addForm.validateFields().then((params) => {
        // let componentName;
        // if (!Array.isArray(params.componentName)) {
        //   componentName = [params.componentName];
        // } else {
        //   componentName = params.componentName;
        // }
        addApplication({ ...params, componentName: curComponentName, componentType: tabActiveKey }).then(() => {
          onSave();
        });
      });
    } else {
      message.warning('请通过版本号校验再提交！');
    }
  };
  const getCheck = async (
    componentName: string,
    componentType: string,
    componentVersion: string,
    productLine: string,
  ) => {
    setLoading(true);
    setType('begin');
    try {
      await getRequest(
        `${getVersionCheck}?componentName=${componentName}&componentType=${componentType}&componentVersion=${componentVersion}&productLine=${productLine}`,
      )
        .then((res) => {
          if (res.success && res.data === 'success') {
            setRightInfo(true);
            setType('success');
          } else if (res.success && res.data !== 'success') {
            setRightInfo(false);
            setErrorMessage(res.data);
            setType('error');
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const onVersionChange = (value: any) => {
    let formData = addForm.getFieldsValue();
    getCheck(formData.componentName, tabActiveKey, formData.componentVersion, curProductLine);
  };
  useEffect(() => {
    if (mode === 'HIDE') return;
    if (Object.keys(initData || {})?.length !== 0) {
      addForm.setFieldsValue({ ...initData, componentVersion: curVersion });
      if (tabActiveKey === 'app') {
        getApplicationOption(initData.componentSourceEnv);
      }

      setIsDisabled(true);
    }
    queryEnvData();
    return () => {
      addForm.resetFields();
      setType('');
      setIsDisabled(false);
      setAppOptions([]);
      setSelectedKeys([]);
    };
  }, [mode]);
  const getEnvCode = (value: string) => {
    getApplicationOption(value);
  };

  const onCheck = (checkedKeys: React.Key[], info: any) => {
    let nameArry: any = [];

    info.checkedNodes?.map((item: any) => {
      nameArry.push(item.title);
    });
    setSelectedKeys(checkedKeys);
    setCurComponentName(nameArry);
  };
  const allCheck = () => {
    let arry: any = [];
    let nameArry: any = [];
    applicationOptions.map((item: any) => {
      arry.push(item.key);
      nameArry.push(item.title);
    });
    setCurComponentName(nameArry);
    setSelectedKeys(arry);
  };
  const unAllCheck = () => {
    setSelectedKeys([]);
    setCurComponentName([]);
  };

  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title="应用组件接入"
      // maskClosable={false}
      onClose={onClose}
      width={'50%'}
      footer={
        <div className="drawer-footer">
          <Button type="primary" disabled={isDisabled} loading={addLoading} onClick={handleSubmit}>
            保存
          </Button>
          <Button type="default" onClick={onClose}>
            取消
          </Button>
        </div>
      }
    >
      <Form layout="horizontal" form={addForm} labelCol={{ flex: '100px' }}>
        <Form.Item label="环境" name="componentSourceEnv" rules={[{ required: true, message: '请选择环境' }]}>
          <Select style={{ width: 320 }} options={envDataSource} onChange={getEnvCode} disabled={isDisabled}></Select>
        </Form.Item>
        <Form.Item label="产品线" name="productLine" rules={[{ required: true, message: '请选择产品线' }]}>
          <Select style={{ width: 320 }} options={productLineOptions || []} disabled={isDisabled}></Select>
        </Form.Item>
        {/* <Form.Item label="组件名称" name="componentName" rules={[{ required: true, message: '请选择组件名称' }]}>
          <Select style={{ width: 320 }} mode="multiple" options={applicationOptions} disabled={isDisabled}></Select>
        </Form.Item> */}
        <Form.Item
          label="组件版本"
          name="componentVersion"
          hasFeedback
          rules={[
            {
              required: true,
              message: '请输入组件版本',
              validateTrigger: 'onBlur',
            },
          ]}
          validateStatus={
            type === 'success' ? 'success' : type === 'begin' ? 'validating' : type === 'error' ? 'error' : 'warning'
          }
          help={type === 'success' ? '版本号检查通过' : type === 'error' ? errorMessage : '等待检查版本号'}
        >
          <Input style={{ width: 320 }} placeholder="请按照 1.0.0 的格式输入版本号！" onBlur={onVersionChange}></Input>
        </Form.Item>
      </Form>
      <Divider />
      {applicationOptions.length > 0 && (
        <p className="app-list-show">
          <span> 应用列表:</span>
          <Space style={{ marginLeft: 12 }}>
            <Button size="small" type="primary" onClick={allCheck}>
              全选
            </Button>
            <Button size="small" onClick={unAllCheck}>
              全不选
            </Button>
          </Space>
        </p>
      )}

      <Spin spinning={appLoading}>
        <Tree
          checkable
          rootClassName="app-list-tree"
          checkedKeys={selectedKeys}
          onCheck={onCheck}
          height={495}
          treeData={applicationOptions}
        />
      </Spin>
    </Drawer>
  );
}
