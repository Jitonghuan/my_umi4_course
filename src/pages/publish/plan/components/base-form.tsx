import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col } from 'antd';
import { renderForm } from '@/components/table-search/form';
import { FormProps } from '@/components/table-search/typing';
import { BaseFormProps } from '../../typing';

const BaseForm: React.FC<BaseFormProps> = ({
  initValueObj,
  isCheck,
  appList,
  appChange,
}) => {
  const baseFormOption: FormProps[] = useMemo(() => {
    return [
      {
        key: '1',
        type: 'select',
        option: appList,
        label: '应用',
        dataIndex: 'appCode',
        showSelectSearch: true,
        required: true,
        allowClear: false,
        width: '100%',
        defaultValue: initValueObj?.appCode,
        onChange: appChange,
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
        dataIndex: 'deployRelease',
        width: '100%',
        defaultValue: initValueObj?.deployRelease,
      },
      {
        key: '4',
        type: 'input',
        label: '版本依赖',
        dataIndex: 'dependency',
        defaultValue: initValueObj?.dependency,
      },
      {
        key: '5',
        type: 'input',
        label: '开发',
        dataIndex: 'developer',
        required: true,
        width: '100%',
        defaultValue: initValueObj?.developer,
      },
      {
        key: '6',
        type: 'input',
        label: '测试',
        dataIndex: 'tester',
        required: true,
        width: '100%',
        defaultValue: initValueObj?.tester,
      },
      {
        key: '7',
        type: 'input',
        label: '发布人',
        dataIndex: 'deployer',
        required: true,
        width: '100%',
        defaultValue: initValueObj?.deployer,
      },
      {
        key: '8',
        type: 'date',
        label: '期望发布日期',
        dataIndex: 'preDeployTime',
        required: true,
        width: '100%',
        defaultValue: initValueObj?.preDeployTime,
        rules: [],
      },
    ];
  }, [initValueObj, appList]);

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
