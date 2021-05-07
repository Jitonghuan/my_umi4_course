import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { renderForm } from '@/components/table-search/form';
import { FormProps } from '@/components/table-search/typing';
import { BaseFormProps } from '../../typing';

const BaseForm: React.FC<BaseFormProps> = ({ initValueObj, isCheck }) => {
  const baseFormOption: FormProps[] = [
    {
      key: '1',
      type: 'select',
      option: [],
      label: '应用名',
      dataIndex: 'useName',
      showSelectSearch: true,
      required: true,
      width: '100%',
      defaultValue: initValueObj?.useName,
    },
    {
      key: '2',
      type: 'input',
      label: '版本号',
      dataIndex: 'version',
      width: '100%',
      defaultValue: initValueObj?.version,
    },
    {
      key: '3',
      type: 'input',
      label: '版本分支',
      dataIndex: 'branch',
      width: '100%',
      defaultValue: initValueObj?.branch,
    },
    {
      key: '4',
      type: 'input',
      label: '版本依赖',
      dataIndex: 'modules',
      defaultValue: initValueObj?.modules,
    },
    {
      key: '5',
      type: 'input',
      label: '开发',
      dataIndex: 'develop',
      required: true,
      width: '100%',
      defaultValue: initValueObj?.develop,
    },
    {
      key: '6',
      type: 'input',
      label: '测试',
      dataIndex: 'test',
      required: true,
      width: '100%',
      defaultValue: initValueObj?.test,
    },
    {
      key: '7',
      type: 'input',
      label: '发布人',
      dataIndex: 'publisher',
      required: true,
      width: '100%',
      defaultValue: initValueObj?.publisher,
    },
    {
      key: '8',
      type: 'date',
      label: '期望发布日期',
      dataIndex: 'planTime',
      required: true,
      width: '100%',
      defaultValue: initValueObj?.planTime,
    },
  ];

  baseFormOption.forEach((v) => {
    v.itemStyle = { width: '100%' };
    v.labelCol = { span: 8 };
    v.wrapperCol = { span: 18 };
    v.disable = isCheck;
  });

  return (
    <>
      {
        <Row>
          {baseFormOption.map((v) => (
            <Col span={6}>{renderForm([v])}</Col>
          ))}
        </Row>
      }
    </>
  );
};

export default BaseForm;
