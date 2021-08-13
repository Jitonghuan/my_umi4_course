// 用例执行
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/06 20:20

import React, { useState, useEffect } from 'react';
import { Modal, message, Select, Form, Input, InputNumber, Col, Row, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { postRequest } from '@/utils/request';
import * as APIS from '../../service';
import { TemplateItemProps } from '../../interfaces';

export interface TemplExecProps {
  visible?: boolean;
  TemplVo?: TemplateItemProps;
  onClose?: () => any;
}

export default function TemplExec(props: TemplExecProps) {
  const { TemplVo } = props;

  const [editField] = Form.useForm<{ envId: string }>();
  const [pending, setPending] = useState(false);
  const [resultInfo, setResultInfo] = useState<string>();

  useEffect(() => {
    if (!props.visible || !props.TemplVo) return;

    editField.resetFields();
  }, [props.visible]);

  const handleOk = async () => {
    const { envId } = await editField.validateFields();

    setPending(true);
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
    } finally {
      setPending(false);
    }
  };
  let paramsArr = TemplVo?.params;
  console.log('paramsArr', paramsArr);
  // if(props?.TemplVo?.params){
  //   paramsArr = Object.keys(props.TemplVo.params);
  // }
  return (
    <>
      <Modal
        key="exec"
        visible={props.visible}
        title="执行造数"
        onOk={handleOk}
        onCancel={props.onClose}
        maskClosable={false}
        confirmLoading={pending}
      >
        <Form form={editField} labelCol={{ flex: '80px' }} wrapperCol={{ span: 12 }}>
          {TemplVo?.params &&
            TemplVo?.params.map((item: any, index: number) => {
              return (
                <Form.Item
                  name={['params', item.name]}
                  label={
                    <div>
                      <Tooltip placement="topLeft" title={item.desc} color="cyan">
                        <QuestionCircleOutlined style={{ color: 'blue' }} />
                      </Tooltip>
                      {item.name}
                    </div>
                  }
                  initialValue={item.value}
                >
                  <Input />
                </Form.Item>
              );
            })}
          <Form.Item label="执行配置" rules={[{ required: true }]}>
            <Input.Group compact>
              <Form.Item
                name={['address', 'province']}
                noStyle
                rules={[{ required: true, message: 'Province is required' }]}
              >
                <Select placeholder="选择执行环境">
                  <Option value="dev">dev</Option>
                  <Option value="test">test</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name={['conf', 'execNum']}
                noStyle
                rules={[{ required: true, message: '请输入执行条数' }]}
                wrapperCol={{ flex: 1 }}
              >
                <InputNumber style={{ width: '50%' }} min={1} placeholder="执行条数" />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        key="stack"
        visible={!!resultInfo}
        title="执行结果"
        footer={false}
        width={800}
        maskClosable={false}
        onCancel={() => setResultInfo('')}
      >
        <Input.TextArea value={resultInfo} rows={20} style={{ color: 'red' }} />
      </Modal>
    </>
  );
}
