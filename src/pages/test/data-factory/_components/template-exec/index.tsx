// 模板执行
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/06 20:20

import React, { useState, useEffect, useMemo } from 'react';
import { Modal, message, Select, Form, Input, InputNumber } from 'antd';
import { postRequest } from '@/utils/request';
import * as APIS from '../../service';
import { TemplateItemProps } from '../../interfaces';

export interface TemplExecProps {
  visible?: boolean;
  temp?: TemplateItemProps;
  onClose?: () => any;
}

const { Item: FormItem } = Form;

export default function TemplExec(props: TemplExecProps) {
  const { temp } = props;

  const [editField] = Form.useForm<{ envId: string }>();
  // const [pending, setPending] = useState(false);
  const [resultInfo, setResultInfo] = useState<string>();

  useEffect(() => {
    if (!props.visible || !props.temp) return;

    editField.resetFields();
  }, [props.visible]);

  const handleOk = async () => {
    const { envId } = await editField.validateFields();

    try {
      const result = await postRequest(
        APIS.createData,
        {
          data: {
            envId,
            templId: 1,
            params: { name: 1 },
          },
        },
        true,
      );

      if (!result.data?.report) {
        message.warn('执行造数失败！');
        throw result;
      }
      setResultInfo(result.data);
      props.onClose?.();
    } catch (ex) {
      if (ex.data?.error) {
        setResultInfo(ex.data?.error);
        props.onClose?.();
      }
    }
  };
  let paramsArr = temp?.params;
  console.log('paramsArr', paramsArr);
  // if(props?.temp?.params){
  //   paramsArr = Object.keys(props.temp.params);
  // }

  const envOptions = useMemo(() => {
    return temp?.env ? temp.env.split(/,\s?/).map((n) => ({ label: n, value: n })) : [];
  }, [temp]);

  return (
    <Modal
      // key="exec"
      visible={props.visible}
      title="执行造数"
      width={720}
      onOk={handleOk}
      onCancel={props.onClose}
      maskClosable={false}
    >
      <Form form={editField} labelCol={{ flex: '80px' }}>
        <FormItem label="模板名称">
          <span className="ant-form-text">{temp?.name || '--'}</span>
        </FormItem>
        <FormItem label="执行配置">
          <Input.Group compact>
            <FormItem name="env" rules={[{ required: true, message: '请选择执行环境' }]}>
              <Select options={envOptions} placeholder="执行环境" style={{ width: 100 }} />
            </FormItem>
            <FormItem name="num" rules={[{ required: true, message: '请输入执行条数' }]}>
              <InputNumber placeholder="执行条数" min={1} precision={0} style={{ width: 200 }} />
            </FormItem>
          </Input.Group>
        </FormItem>
        {temp?.params &&
          temp?.params.map((item: any, index: number) => {
            return (
              <Form.Item name={['params', item.name]} label={<div>{item.name}</div>} initialValue={item.value}>
                <Input />
              </Form.Item>
            );
          })}
        <Form.Item label="执行配置" rules={[{ required: true }]}></Form.Item>
      </Form>
    </Modal>
  );
}
