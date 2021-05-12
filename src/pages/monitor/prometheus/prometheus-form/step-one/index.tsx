import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import { FormInstance } from 'antd/lib';
import EditTable from '../../../template/editTable';
import { renderForm } from '@/components/table-search/form';
import { FormProps } from '@/components/table-search/typing';
import { Item } from '../../../typing';

interface StepOneProps {
  getTableData: (value: Record<string, Item[]>) => void;
  form?: FormInstance;
}

const StepOne: React.FC<StepOneProps> = ({ getTableData }) => {
  const [matchlabels, setMatchlabels] = useState<Item[]>([]);

  const matchlabelsFun = (value: Item[]) => {
    console.log(value, 'label');
    setMatchlabels(value);
  };

  useEffect(() => {
    getTableData({ matchlabels: matchlabels });
  }, [matchlabels]);

  const formOptions: FormProps[] = [
    {
      key: '1',
      type: 'input',
      label: '名称',
      dataIndex: 'name',
      placeholder: '请输入',
      required: true,
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '2',
      type: 'select',
      label: '应用名称',
      dataIndex: 'applyName',
      placeholder: '请选择',
      required: true,
      option: [{ key: 'ccc', value: 'hhh' }],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '3',
      type: 'select',
      label: '环境名称',
      dataIndex: 'environmentName',
      placeholder: '请选择',
      required: true,
      option: [{ key: 'aa', value: 'hhh' }],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '4',
      type: 'select',
      label: '采集频率',
      dataIndex: 'rate',
      placeholder: '请选择',
      required: true,
      option: [
        {
          key: '15s',
          value: '15s',
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
      dataIndex: 'url',
      placeholder: '请输入',
      required: true,
      pattern: /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/,
      validatorMessage: '请输入正确的url',
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '6',
      type: 'other',
      label: 'Matchlabels',
      dataIndex: 'matchlabels',
      placeholder: '请输入',
      required: true,
      extraForm: (
        <Form.Item noStyle>
          <EditTable onTableChange={matchlabelsFun} />
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
