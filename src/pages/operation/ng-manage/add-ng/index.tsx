// 新增环境抽屉页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/10/25 18:30

import React from 'react';
import { history } from 'umi';
import { getRequest, postRequest, putRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import { Drawer, Input, Button, Form, Select, Space, message, Switch, Divider, Radio } from '@cffe/h2o-design';
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
          serverName: params?.serverName,
          beDomainName: params?.beDomainName,
        },
      }).then((result) => {
        if (result.success) {
          message.success('新增NG配置成功！');
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
          serverName: initValue?.serverName,
          beDomainName: initValue?.beDomainName,
        },
      }).then((result) => {
        if (result.success) {
          message.success('编辑配置成功！');
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
      title={mode === 'EDIT' ? '编辑NG配置' : mode === 'VIEW' ? '查看NG配置' : '新增NG配置'}
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
          <Form.Item
            label="实例CODE："
            name="ngInstCode"
            rules={[
              {
                required: true,
                message: '输入的实例Code里请不要包含中文',
                pattern: /^[^\u4e00-\u9fa5]*$/,
              },
            ]}
          >
            <Input
              style={{ width: 230 }}
              placeholder="请输入实例Code(不要包含中文）"
              disabled={isDisabled || mode === 'EDIT'}
            ></Input>
          </Form.Item>
          <Form.Item label="实例名：" name="ngInstName" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 230 }} placeholder="请输入实例名" disabled={isDisabled}></Input>
          </Form.Item>

          <Form.Item label="实例IP：" name="ipAddress" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 230 }} placeholder="请输入实例IP" disabled={isDisabled}></Input>
          </Form.Item>

          <Form.Item label="配置文件路径：" name="confFilePath" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 230 }} placeholder="请输入配置文件路径" disabled={isDisabled}></Input>
          </Form.Item>

          <Form.Item label="静态资源路径：" name="resourceFilePath" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 230 }} placeholder="请输入静态资源路径" disabled={isDisabled}></Input>
          </Form.Item>

          <Form.Item label="前端域名：" name="serverName" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 230 }} placeholder="请输入前端域名" disabled={isDisabled}></Input>
          </Form.Item>
          <Form.Item label="后端域名：" name="beDomainName" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 230 }} placeholder="请输入后端域名" disabled={isDisabled}></Input>
          </Form.Item>

          <Form.Item name="reMark" label="备注：">
            <Input.TextArea
              placeholder="请输入"
              style={{ width: 480, height: 80 }}
              disabled={isDisabled}
            ></Input.TextArea>
          </Form.Item>
          <div>
            <Form.Item label="配置模版" name="value" className="form-ace" style={{ flexDirection: 'column' }}>
              <AceEditor mode="yaml" height={450} readOnly={mode === 'VIEW'} />
            </Form.Item>
          </div>
        </Form>
      </div>
    </Drawer>
  );
}
