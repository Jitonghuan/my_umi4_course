import React, { useState, useEffect } from 'react';
import { Form, Table, Input, Radio } from 'antd';
import './index.less';

const pointRulesTableDescribe = [
  {
    key: 1,
    title: '质量分',
    name: 'qualityPoints',
    ruleStr: '>=',
  },
  {
    key: 2,
    title: '单元测试',
    name: 'utSwitch',
    children: [
      {
        key: 3,
        title: '单测用例数',
        name: 'utTotal',
        ruleStr: '>=',
      },
      {
        key: 4,
        title: '单测通过率',
        name: 'utPassRate',
        ruleStr: '>=',
        addonAfter: '%',
        width: '90px',
      },
      {
        key: 5,
        title: '单测覆盖率',
        name: 'utCovRate',
        ruleStr: '>=',
        addonAfter: '%',
        width: '90px',
      },
    ],
  },
  {
    key: 6,
    title: '代码扫描',
    name: 'sonarSwitch',
    children: [
      {
        key: 7,
        title: '阻塞级别BUG数',
        name: 'bugsBlocker',
        ruleStr: '<=',
      },
      {
        key: 8,
        title: '严重级别BUG数',
        name: 'bugsCritical',
        ruleStr: '<=',
      },
      {
        key: 9,
        title: '主要级别BUG数',
        name: 'bugsMajor',
        ruleStr: '<=',
      },
      {
        key: 10,
        title: '阻塞级别漏洞数',
        name: 'vulnerabilityBlocker',
        ruleStr: '<=',
      },
      {
        key: 11,
        title: '严重级别漏洞数',
        name: 'vulnerabilityCritical',
        ruleStr: '<=',
      },
      {
        key: 12,
        title: '主要级别漏洞数',
        name: 'vulnerabilityMajor',
        ruleStr: '<=',
      },
    ],
  },
];
export default function ConfigurePointRulesContent(props: any) {
  const { isEdit, form, isGlobal = false } = props;

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
                        { label: '开启', value: 1 },
                        { label: '关闭', value: 0 },
                      ]}
                      optionType="button"
                      buttonStyle="solid"
                      disabled={!isEdit}
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
                  <Form.Item
                    name={record.name}
                    noStyle
                    rules={[
                      {
                        validator: (_, value) => {
                          if (value.length === 0) {
                            return Promise.reject(new Error(`请输入${record.title}`));
                          }
                          const num = Number(value);
                          if (Number.isNaN(num)) {
                            return Promise.reject(new Error(`请输入数字`));
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      style={{ width: record.width || '60px' }}
                      disabled={!isEdit}
                      addonAfter={record.addonAfter}
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
                    <Input style={{ width: record.width || '60px' }} disabled addonAfter={record.addonAfter} />
                  </>
                );
            }}
          />
        )}
      </Table>
    </Form>
  );
}
