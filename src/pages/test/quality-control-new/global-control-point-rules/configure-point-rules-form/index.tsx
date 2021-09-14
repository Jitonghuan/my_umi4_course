import React, { useState, useEffect } from 'react';
import { Form, Table, Input, Radio } from 'antd';
import './index.less';

const pointRulesTableDescribe = [
  {
    key: 1,
    title: '质量分',
    name: 'a',
    ruleStr: '>=',
  },
  {
    key: 2,
    title: '单元测试',
    name: 'unitTest',
    children: [
      {
        key: 3,
        title: '单测用例数',
        name: 'c',
        ruleStr: '>=',
      },
      {
        key: 4,
        title: '单测通过率',
        name: 'd',
        ruleStr: '>=',
        addonAfter: '%',
        width: '90px',
      },
      {
        key: 5,
        title: '单测覆盖率',
        name: 'e',
        ruleStr: '>=',
        addonAfter: '%',
        width: '90px',
      },
    ],
  },
  {
    key: 6,
    title: '代码扫描',
    name: 'scanner',
    children: [
      {
        key: 7,
        title: '阻塞级别BUG数',
        name: 'c',
        ruleStr: '<=',
      },
      {
        key: 8,
        title: '严重级别BUG数',
        name: 'c',
        ruleStr: '<=',
      },
      {
        key: 9,
        title: '主要级别BUG数',
        name: 'c',
        ruleStr: '<=',
      },
      {
        key: 10,
        title: '阻塞界别漏洞数',
        name: 'c',
        ruleStr: '<=',
      },
      {
        key: 11,
        title: '严重级别漏洞数',
        name: 'c',
        ruleStr: '<=',
      },
      {
        key: 12,
        title: '主要级别漏洞数',
        name: 'c',
        ruleStr: '<=',
      },
    ],
  },
];
export default function ConfigurePointRulesContent(props: any) {
  const { isEdit, onChange, value, isGlobal = false } = props;
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<any>();

  useEffect(() => {
    onChange && onChange(formValues);
  }, [formValues]);

  return (
    <Form form={form} className="configure-point-rules-form">
      <Table dataSource={pointRulesTableDescribe} defaultExpandAllRows pagination={false}>
        <Table.Column
          title="指标"
          dataIndex="title"
          render={(title: string, record: any) => {
            if (record?.children?.length) {
              return (
                <div>
                  {title}{' '}
                  <Form.Item name={record.name} noStyle>
                    <Radio.Group
                      options={[
                        { label: '开启', value: true },
                        { label: '关闭', value: false },
                      ]}
                      optionType="button"
                      buttonStyle="solid"
                      onChange={() => {
                        setFormValues(form.getFieldsValue());
                      }}
                    />
                  </Form.Item>
                </div>
              );
            }
            return title;
          }}
        />
        <Table.Column
          title="目标值"
          render={(record) => {
            if (!record?.children?.length)
              return (
                <>
                  {' '}
                  {record.ruleStr}{' '}
                  <Form.Item name={record.name} noStyle>
                    <Input
                      style={{ width: record.width || '60px' }}
                      disabled={!isEdit}
                      addonAfter={record.addonAfter}
                      onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                          setFormValues(form.getFieldsValue());
                        } else {
                          form.setFieldsValue(formValues);
                        }
                      }}
                    />
                  </Form.Item>
                </>
              );
          }}
        />
        {isGlobal ? null : (
          <Table.Column
            title="全局值"
            render={(record) => {
              if (!record?.children?.length)
                return (
                  <>
                    {' '}
                    {record.ruleStr}{' '}
                    <Form.Item name={record.name} noStyle>
                      <Input style={{ width: record.width || '60px' }} disabled addonAfter={record.addonAfter} />
                    </Form.Item>
                  </>
                );
            }}
          />
        )}
      </Table>
    </Form>
  );
}
