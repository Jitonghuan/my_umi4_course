import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import { FormInstance } from 'antd/lib';
import EditTable from '../../../component/editTable';
import { renderForm } from '@/components/table-search/form';
import { FormProps } from '@/components/table-search/typing';
import { Item } from '../../../typing';

interface StepOneProps {
  getTableData: (value: Item[]) => void;
  tableData?: Item[];
  form?: FormInstance;
}

const StepOne: React.FC<StepOneProps> = ({ getTableData, tableData = [] }) => {
  const [matchlabels, setMatchlabels] = useState<Item[]>([]);

  const matchlabelsFun = (value: Item[]) => {
    console.log(value, 'label');
    setMatchlabels(value);
  };

  useEffect(() => {
    getTableData(matchlabels);
  }, [matchlabels]);

  useEffect(() => {
    // 或根据id form.setFieldsValue
  }, []);

  const formOptions: FormProps[] = [
    {
      key: '1',
      type: 'input',
      label: '名称',
      dataIndex: 'name',
      placeholder: '请输入(最多253字符，暂不支持中文)',
      required: true,
      rules: [
        {
          whitespace: true,
          required: true,
          message: '请输入正确的名称',
          pattern: /^\d+$|^\d[(a-z\d\-\.)]*\d$|^\d+$/,
          type: 'string',
          max: 253,
        },
      ],
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '2',
      type: 'select',
      label: '应用名称',
      dataIndex: 'appCode',
      placeholder: '请选择',
      required: true,
      showSelectSearch: true,
      option: [{ key: 'ccc', value: 'hhh' }],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '3',
      type: 'select',
      label: '环境名称',
      dataIndex: 'envCode',
      placeholder: '请选择',
      required: true,
      showSelectSearch: true,
      option: [{ key: 'aa', value: 'hhh' }],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '4',
      type: 'select',
      label: '采集频率',
      dataIndex: 'interval',
      placeholder: '请选择',
      required: true,
      option: [
        {
          key: '15s',
          value: '15s',
        },
        {
          key: '30s',
          value: '30s',
        },
        {
          key: '60s',
          value: '60s',
        },
      ],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '5',
      type: 'input',
      label: 'URL',
      dataIndex: 'metricsUrl',
      placeholder: '请输入',
      required: true,
      rules: [
        {
          type: 'url',
          required: true,
          message: '请输入正确的url',
        },
      ],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '6',
      type: 'other',
      label: 'Matchlabels',
      dataIndex: 'labels',
      placeholder: '请输入',
      required: true,
      extraForm: (
        <Form.Item noStyle>
          <EditTable onTableChange={matchlabelsFun} initData={matchlabels} />
        </Form.Item>
      ),
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
  ];

  formOptions.forEach((v) => {
    v.itemStyle = { width: '100%' };
    v.labelCol = { span: 8 };
    v.wrapperCol = { span: 12 };
  });

  return <>{renderForm(formOptions)}</>;
};

export default StepOne;
