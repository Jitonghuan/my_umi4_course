// 模板执行
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/06 20:20

import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { Modal, message, Select, Form, Input, InputNumber, Empty } from 'antd';
import FELayout from '@cffe/vc-layout';
import { postRequest } from '@/utils/request';
import * as APIS from '../../service';
import EditorTable from '@cffe/pc-editor-table';
import { TemplateItemProps } from '../../interfaces';
import ExecResult from '@/components/exec-result';

export interface TemplExecProps {
  visible?: boolean;
  temp?: TemplateItemProps;
  onClose?: () => any;
}

const { Item: FormItem } = Form;

export default function TemplExec(props: TemplExecProps) {
  const { temp, visible, onClose } = props;
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [editField] = Form.useForm<any>();
  const [pending, setPending] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [resultData, setResultData] = useState<any>();

  useEffect(() => {
    if (!visible || !temp) return;

    editField.resetFields();

    // 初始化 params 数据
    const paramsArr = Array.isArray(temp.params) ? temp.params : temp.params?.['type'] ? [temp.params] : [];
    // const params = paramsArr.reduce((prev, curr) => {
    //   prev[curr.name] = curr.value || '';
    //   return prev;
    // }, {} as any);
    editField.setFieldsValue({
      params: paramsArr,
      // params: JSON.stringify(params, null, 2),
    });
  }, [visible]);

  // 提交数据
  const handleOk = useCallback(async () => {
    const values = await editField.validateFields();
    console.log('>> handleOK', values);

    setPending(true);
    try {
      const result = await postRequest(APIS.createData, {
        data: {
          project: temp?.project,
          name: temp?.name,
          createUser: userInfo.userName,
          factoryId: temp?.id,
          factoryName: temp?.name,
          ...values,
        },
      });

      message.success('执行成功！');
      onClose?.();
      setResultVisible(true);
      setResultData(result.data);
    } finally {
      setPending(false);
    }
  }, [temp, onClose]);

  // 从模板中获取可选择的环境
  const envOptions = useMemo(() => {
    return temp?.env ? temp.env.split(/,\s?/).map((n) => ({ label: n, value: n })) : [];
  }, [temp]);

  return (
    <>
      <Modal
        visible={visible}
        title="执行造数"
        width={840}
        onOk={handleOk}
        onCancel={onClose}
        maskClosable={false}
        confirmLoading={pending}
      >
        <Form form={editField} labelCol={{ flex: '80px' }}>
          <FormItem label="模板名称">
            <span className="ant-form-text">{temp?.name || '--'}</span>
          </FormItem>
          <FormItem label="执行配置">
            <Input.Group compact>
              <FormItem
                name="env"
                rules={[{ required: true, message: '请选择执行环境' }]}
                initialValue={envOptions[0]?.value}
              >
                <Select options={envOptions} placeholder="执行环境" style={{ width: 100 }} />
              </FormItem>
              <FormItem name="num" rules={[{ required: true, message: '请输入执行条数' }]} initialValue={1}>
                <InputNumber placeholder="执行条数" min={1} precision={0} style={{ width: 280 }} />
              </FormItem>
            </Input.Group>
          </FormItem>
          {/* <FormItem
            label="执行参数"
            name="params"
            rules={[
              { required: true, message: '请输入执行参数' },
              { validator: JSONValidator, validateTrigger: [] },
            ]}
          >
            <AceEditor mode="json" height={280} />
          </FormItem> */}
          <FormItem
            label="执行参数"
            name="params"
            rules={[
              {
                validator: async (_, value) => {},
                validateTrigger: [],
              },
            ]}
          >
            <EditorTable
              readOnly
              columns={[
                {
                  title: '序号',
                  dataIndex: '__count',
                  fieldType: 'readonly',
                  colProps: { width: 60, align: 'center' },
                },
                { title: '变量名', dataIndex: 'name', fieldType: 'readonly', colProps: { width: 140 } },
                { title: '类型', dataIndex: 'type', fieldType: 'readonly', colProps: { width: 90 } },
                { title: '值', dataIndex: 'value', fieldType: 'text', fieldProps: { readOnly: false } },
                { title: '描述', dataIndex: 'desc', fieldType: 'readonly' },
              ]}
              tableProps={{
                locale: { emptyText: <Empty description="没有定义执行参数" image={Empty.PRESENTED_IMAGE_SIMPLE} /> },
              }}
            />
          </FormItem>
        </Form>
      </Modal>
      <ExecResult visible={resultVisible} onClose={() => setResultVisible(false)} data={resultData} />
    </>
  );
}
