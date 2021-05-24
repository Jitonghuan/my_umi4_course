import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import { FormInstance } from 'antd/lib';
import { history } from 'umi';
import EditTable from '../../../component/editTable';
import { renderForm } from '@/components/table-search/form';
import { FormProps, OptionProps } from '@/components/table-search/typing';
import useRequest from '@/utils/useRequest';
import { Item } from '../../../typing';
import { queryPrometheusList } from '../../../service';
import usePublicData from '../../usePublicData';

interface StepOneProps {
  getTableData: (value: Item[]) => void;
  matchlabelsList?: Item[];
}

const StepOne: React.FC<StepOneProps> = ({
  getTableData,
  matchlabelsList = [],
}) => {
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
    console.log(value, 'label');
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
      placeholder: '请输入(最多253字符，暂不支持中文)',
      required: true,
      disable: isEdit,
      rules: [
        {
          whitespace: true,
          required: true,
          message: "请输入正确的名称(字母数字开头、结尾，支持 '-' , '.')",
          pattern: /^[\d|a-z]+$|^[\d|a-z][(a-z\d\-\.)]*[\d|a-z]$|^[\d|a-z]+$/,
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
      disable: isEdit,
      option: appManageListData as OptionProps[],
      onChange: (e: string) => {
        setAppCode(e);
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
      disable: isEdit,
      option: appManageEnvData as OptionProps[],
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
          message: '请输入正确的url(示例:http://127.0.0.1:8080/health)',
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
          <EditTable
            onTableChange={matchlabelsFun}
            initData={matchlabels}
            headerTitle={
              <span style={{ color: '#999' }}>
                (MatchLabels已设置默认值，无特殊需求，请不要填写)
              </span>
            }
          />
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
