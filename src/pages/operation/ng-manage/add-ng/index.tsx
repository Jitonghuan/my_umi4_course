// 新增环境抽屉页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/10/25 18:30

import React from 'react';
import { history } from 'umi';
import { getRequest, postRequest, putRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import { Drawer, Input, Button, Form, Select, Space, message, Switch, Divider, Radio } from 'antd';
import { record } from '../type';
import AceEditor from '@/components/ace-editor';
import { createNg, updateNg } from '../service';
import './index.less';
export interface IProps {
  mode?: EditorMode;
  initData?: record;
  onClose?: () => any;
  onSave?: () => any;
}

export default function addEnvData(props: IProps) {
  const { mode, onClose, onSave, initData } = props;
  const [createNgForm] = Form.useForm();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  useEffect(() => {
    if (mode === 'HIDE') return;
    createNgForm.resetFields();
    if (mode === 'VIEW') {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
    if (initData) {
      createNgForm.setFieldsValue({
        ...initData,
        value: initData.templateContext,
      });
    }
  }, [mode]);

  const handleSubmit = async () => {
    if (mode === 'ADD') {
      const params = await createNgForm.validateFields();
      // const params = createNgForm.getFieldsValue();
      // 新增实例
      postRequest(createNg, {
        data: {
          ngInstCode: params?.ngInstCode,
          ngInstName: params?.ngInstName,
          ipAddress: params?.ipAddress,
          confFilePath: params?.confFilePath,
          resourceFilePath: params?.resourceFilePath,
          reMark: params?.reMark,
          templateContext: params?.value,
        },
      }).then((result) => {
        if (result.success) {
          message.success('新增实例成功！');
          onSave?.();
        } else {
          message.error(result.errorMsg);
        }
      });
    } else if (mode === 'EDIT') {
      //编辑实例
      const initValue = await createNgForm.validateFields();
      putRequest(updateNg, {
        data: {
          id: initData?.id,
          ngInstCode: initValue?.ngInstCode,
          ngInstName: initValue?.ngInstName,
          ipAddress: initValue?.ipAddress,
          confFilePath: initValue?.confFilePath,
          resourceFilePath: initValue?.resourceFilePath,
          reMark: initValue?.reMark,
          templateContext: initValue?.value,
        },
      }).then((result) => {
        if (result.success) {
          message.success('编辑实例成功！');
          onSave?.();
        } else {
          message.error(result.errorMsg);
        }
      });
    }
  };
  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title={mode === 'EDIT' ? '编辑NG实例' : mode === 'VIEW' ? '查看NG实例' : '新增NG实例'}
      maskClosable={false}
      onClose={onClose}
      width={'40%'}
      footer={
        isDisabled !== true && (
          <div className="drawer-footer">
            <Button type="default" onClick={onClose}>
              取消
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              保存
            </Button>
          </div>
        )
      }
    >
      <div className="envAdd">
        <Form
          form={createNgForm}
          labelCol={{ flex: '120px' }}
          onFinish={handleSubmit}
          onReset={() => {
            createNgForm.resetFields();
          }}
        >
          <div>
            <Form.Item label="实例CODE：" name="ngInstCode" rules={[{ required: true, message: '这是必填项' }]}>
              <Input
                style={{ width: 220 }}
                placeholder="请输入实例CODE"
                disabled={isDisabled || mode === 'EDIT'}
              ></Input>
            </Form.Item>
          </div>
          <div>
            <Form.Item label="实例名：" name="ngInstName" rules={[{ required: true, message: '这是必填项' }]}>
              <Input style={{ width: 220 }} placeholder="请输入实例名" disabled={isDisabled}></Input>
            </Form.Item>
          </div>
          <div>
            <Form.Item label="实例IP：" name="ipAddress" rules={[{ required: true, message: '这是必填项' }]}>
              <Input style={{ width: 220 }} placeholder="请输入实例IP" disabled={isDisabled}></Input>
            </Form.Item>
          </div>
          <div>
            <Form.Item label="配置文件路径：" name="confFilePath" rules={[{ required: true, message: '这是必填项' }]}>
              <Input style={{ width: 220 }} placeholder="请输入配置文件路径" disabled={isDisabled}></Input>
            </Form.Item>
          </div>
          <div>
            <Form.Item
              label="静态资源路径："
              name="resourceFilePath"
              rules={[{ required: true, message: '这是必填项' }]}
            >
              <Input style={{ width: 220 }} placeholder="请输入静态资源路径" disabled={isDisabled}></Input>
            </Form.Item>
          </div>
          <div>
            <Form.Item name="reMark" label="备注：">
              <Input.TextArea
                placeholder="请输入"
                style={{ width: 480, height: 80 }}
                disabled={isDisabled}
              ></Input.TextArea>
            </Form.Item>
          </div>
          <div>
            <Form.Item label="配置模版" name="value" className="form-ace" style={{ flexDirection: 'column' }}>
              <AceEditor mode="yaml" height={400} readOnly={mode === 'VIEW'} />
            </Form.Item>
          </div>
        </Form>
      </div>
    </Drawer>
  );
}
