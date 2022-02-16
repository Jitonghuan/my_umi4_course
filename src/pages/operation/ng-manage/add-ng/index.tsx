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
export interface IProps {
  mode?: EditorMode;
  initData?: record;
  onClose?: () => any;
  onSave?: () => any;
}

export default function addEnvData(props: IProps) {
  const [createNgForm] = Form.useForm();
  const { mode, onClose, onSave, initData } = props;
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
      });
    }
  }, [mode]);

  const handleSubmit = () => {
    if (mode === 'ADD') {
      const params = createNgForm.getFieldsValue();
      console.log(params, 111);
      //新增环境
      //   postRequest(createNg, {
      //     data: params,
      //   }).then((result) => {
      //     if (result.success) {
      //       message.success('新增实例成功！');
      //       onSave?.();
      //     } else {
      //       message.error(result.errorMsg);
      //     }
      //   });
    } else if (mode === 'EDIT') {
      //编辑环境
      const initValue = createNgForm.getFieldsValue();
      putRequest(updateNg, {
        data: initValue,
      }).then((result) => {
        if (result.success) {
          message.success('编辑环境成功！');
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
      // maskClosable={false}
      initData={initData}
      onClose={onClose}
      width={'40%'}
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
            <Form.Item label="实例名：" name="ngInstName">
              <Input style={{ width: 220 }} placeholder="请输入实例名" disabled={isDisabled}></Input>
            </Form.Item>
          </div>
          <div>
            <Form.Item label="实例IP：" name="ipAddress">
              <Input style={{ width: 220 }} placeholder="请输入实例IP" disabled={isDisabled}></Input>
            </Form.Item>
          </div>
          <div>
            <Form.Item label="配置文件路径：" name="confFilePath">
              <Input style={{ width: 220 }} placeholder="请输入配置文件路径" disabled={isDisabled}></Input>
            </Form.Item>
          </div>
          <div>
            <Form.Item label="静态资源路径：" name="resourceFilePath">
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
            <Form.Item label="配置模版" name="templateContext">
              {/* <TextArea rows={18} disabled /> */}
              <AceEditor mode="yaml" height={400} readOnly={mode === 'VIEW'} />
            </Form.Item>
          </div>
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
