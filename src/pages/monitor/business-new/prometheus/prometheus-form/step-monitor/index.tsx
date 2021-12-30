import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import type { FormInstance } from 'antd/lib';
import { history } from 'umi';
import EditTable from '@/components/edit-table';
import { renderForm } from '@/components/table-search/form';
import { FormProps, OptionProps } from '@/components/table-search/typing';
import { editColumns } from '../../../../component/template-drawer/colunms';
import { Item } from '../../../../typing';
import usePublicData from '../../usePublicData';

interface StepOneProps {
  getTableData: (value: Item[]) => void;
  matchlabelsList?: Item[];
  form?: FormInstance;
}

const StepOne: React.FC<StepOneProps> = ({ getTableData, matchlabelsList = [], form }) => {
  const [matchlabels, setMatchlabels] = useState<Item[]>([]);
  const [appCode, setAppCode] = useState('');

  const {
    location: { query },
  } = history;

  const isEdit = Object.keys(query as object).length > 0;

  const { appManageEnvData, appManageListData } = usePublicData({
    appCode,
  });

  const matchlabelsFun = (value: Item[]) => {
    setMatchlabels(value);
  };

  useEffect(() => {
    getTableData(matchlabels);
  }, [matchlabels]);

  useEffect(() => {
    setMatchlabels(matchlabelsList);
  }, [matchlabelsList]);

  const formOptions: FormProps[] = [
    {
      key: '1',
      type: 'input',
      label: '名称',
      dataIndex: 'name',
      placeholder: '请输入',
      required: true,
      disable: isEdit,
      rules: [
        {
          whitespace: true,
          required: true,
          message: '请输入正确的名称',
          // message: "请输入正确的名称(字母数字开头、结尾，支持 '-' , '.')",
          // pattern: /^[\d|a-z]+$|^[\d|a-z][(a-z\d\-\.)]*[\d|a-z]$|^[\d|a-z]+$/,
          type: 'string',
          max: 200,
        },
      ],
    },
    {
      key: '2',
      type: 'select',
      label: '应用code',
      dataIndex: 'appCode',
      placeholder: '请选择',
      required: true,
      showSelectSearch: true,
      disable: isEdit,
      option: appManageListData as OptionProps[],
      onChange: (e: string) => {
        setAppCode(e);
        if (!form?.getFieldValue('envCode')) return;
        form?.resetFields(['envCode']);
      },
    },
    {
      key: '3',
      type: 'select',
      label: '环境code',
      dataIndex: 'envCode',
      placeholder: '请选择',
      required: true,
      showSelectSearch: true,
      disable: isEdit,
      option: appManageEnvData as OptionProps[],
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
          label: '15s',
          value: '15s',
        },
        {
          key: '30s',
          label: '30s',
          value: '30s',
        },
        {
          key: '60s',
          label: '60s',
          value: '60s',
        },
      ],
    },
    {
      key: '5',
      type: 'input',
      label: 'URL',
      dataIndex: 'metricsUrl',
      placeholder: '请输入(示例:http://127.0.0.1:8080/health)',
      required: true,
      rules: [
        {
          type: 'url',
          required: true,
          message: '请输入正确的url(示例:http://127.0.0.1:8080/health)',
        },
      ],
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
          <EditTable
            onTableChange={matchlabelsFun}
            initData={matchlabels}
            headerTitle={<span style={{ color: '#999' }}>(MatchLabels已设置默认值，无特殊需求，请不要填写)</span>}
            columns={editColumns}
            handleAddItem={() => {
              return {
                id: matchlabels.length,
                key: 'key',
                value: 'value',
              };
            }}
          />
        </Form.Item>
      ),
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
