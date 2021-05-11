import React, { useState, useEffect } from 'react';
import { Button, Space, Drawer, Form, Select, TimePicker } from 'antd';
import { renderForm } from '@/components/table-search/form';
import { FormProps } from '@/components/table-search/typing';
import EditTable from '../editTable';
import { Item } from '../../typing';
import './index.less';

interface TemplateDrawerProps {
  visible: boolean;
  drawerTitle: string;
  onClose: () => void;
  record?: Record<string, string>;
  onSubmit?: (value: any) => void;
}

const TemplateDrawer: React.FC<TemplateDrawerProps> = ({
  visible,
  onClose,
  drawerTitle,
  record,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [labelTableData, setLabelTableData] = useState<Item[]>([]);
  const [annotationsTableData, setAnnotationsTableData] = useState<Item[]>([]);

  const labelFun = (value: Item[]) => {
    console.log(value, 'label');
    setLabelTableData(value);
  };

  const annotationsFun = (value: Item[]) => {
    console.log(value, 'ann');
    setAnnotationsTableData(value);
  };

  const formOptions: FormProps[] = [
    {
      key: '1',
      type: 'input',
      label: '规则名称',
      dataIndex: 'ruleName',
      // width: '144px',
      placeholder: '请输入',
      required: true,
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '2',
      type: 'select',
      label: '分类',
      dataIndex: 'classify',
      placeholder: '请选择',
      required: true,
      // rules: [
      //   {
      //     required: true,
      //     message: 'Please input your name',
      //   },
      // ],
      option: [
        {
          key: '1',
          value: 'kkkk节点',
        },
      ],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '3',
      type: 'area',
      label: '告警表达式(PromQL)',
      dataIndex: 'expression',
      placeholder: '请输入',
      required: true,
      option: [
        {
          key: '1',
          value: 'kkkk节点',
        },
      ],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '3',
      type: 'inputNumber',
      label: '持续时间',
      dataIndex: 'time',
      placeholder: '请输入',
      width: '90%',
      required: true,
      style: { marginRight: 10 },
      className: 'extraStyleTime',
      extraForm: (
        <Form.Item name="timeType" noStyle initialValue="m">
          <Select style={{ width: '90%' }}>
            <Select.Option value="h">小时</Select.Option>
            <Select.Option value="m">分钟</Select.Option>
            <Select.Option value="s">秒</Select.Option>
          </Select>
        </Form.Item>
      ),
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '5',
      type: 'input',
      label: '告警消息',
      dataIndex: 'news',
      // width: '144px',
      placeholder: '请输入',
      required: true,
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '6',
      type: 'select',
      label: '告警级别',
      dataIndex: 'alertRank',
      // width: '144px',
      placeholder: '请输入',
      required: true,
      option: [
        {
          key: 1,
          value: '1',
        },
        {
          key: 2,
          value: '2',
        },
        {
          key: 3,
          value: '3',
        },
      ],
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '7',
      type: 'other',
      label: '高级配置',
      dataIndex: '',
      // width: '144px',
      placeholder: '请输入',
      required: true,
      extraForm: (
        <Form.Item noStyle>
          <Form.Item
            name="labelTableData"
            label="标签（Labels)"
            className="table-item"
          >
            <EditTable onTableChange={labelFun} />
          </Form.Item>
          <Form.Item
            name="annotationsTableData"
            label="注释（Annotations)"
            className="table-item"
          >
            <EditTable onTableChange={annotationsFun} />
          </Form.Item>
        </Form.Item>
      ),
    },
    {
      key: '8',
      type: 'select',
      label: '通知对象',
      dataIndex: 'notifyObject',
      placeholder: '请选择',
      required: true,
      option: [
        {
          key: 'dong',
          value: '东来',
        },
      ],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '9',
      type: 'select',
      label: '通知方式',
      dataIndex: 'notifyType',
      placeholder: '请选择',
      required: true,
      option: [
        {
          key: 'ding',
          value: '钉钉',
        },
      ],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '10',
      type: 'radio',
      label: '是否静默',
      dataIndex: 'isSilence',
      placeholder: '请选择',
      required: true,
      defaultValue: 0,
      style: { verticalAlign: 'sub' },
      option: [
        {
          key: 1,
          value: '是',
        },
        {
          key: 0,
          value: '否',
        },
      ],
      extraForm: (
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, curValues) =>
            prevValues.isSilence !== curValues.isSilence
          }
        >
          {({ getFieldValue }) =>
            getFieldValue('isSilence') === 1 ? (
              <Form.Item
                name="silenceTime"
                rules={[
                  {
                    required: true,
                    message: '请选择',
                  },
                ]}
              >
                <TimePicker.RangePicker
                  format="HH:mm"
                  style={{ width: '100%', marginTop: 8 }}
                />
              </Form.Item>
            ) : null
          }
        </Form.Item>
      ),
      onChange: (e: string) => {
        console.log(e);
      },
    },
  ];

  formOptions.forEach((v) => {
    v.itemStyle = { width: '100%' };
    v.labelCol = { span: 6 };
    v.wrapperCol = { span: 17 };
  });

  const onFinish = () => {
    form.validateFields().then((value) => {
      const obj = { ...value, labelTableData, annotationsTableData };
      console.log(obj, 'ssss');
      onSubmit && onSubmit(value);
    });
  };

  return (
    <Drawer
      title={drawerTitle}
      onClose={() => {
        onClose();
        form.resetFields();
      }}
      visible={visible}
      width={700}
      bodyStyle={{ paddingRight: 0 }}
      footer={
        <Space>
          <Button type="primary" onClick={onFinish}>
            确认
          </Button>
          <Button
            onClick={() => {
              onClose();
              form.resetFields();
            }}
          >
            取消
          </Button>
        </Space>
      }
      footerStyle={{ textAlign: 'right' }}
      destroyOnClose
    >
      <Form form={form}>{renderForm(formOptions)}</Form>
    </Drawer>
  );
};

export default TemplateDrawer;
