// 告警规则
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React, { useState } from 'react';
import { Form, Select, Input, Button } from 'antd';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import RulesTable from './_components/rules-table';
import { useAppOptions, useStatusOptions, useEnvListOptions } from './hooks';
import useTable from '@/utils/useTable';
import { queryRulesList } from '../basic/services';

export default function AlarmRules() {
  const [searchRulesForm] = Form.useForm();
  const [statusOptions] = useStatusOptions();
  const [appOptions] = useAppOptions();
  const [appCode, setAppCode] = useState<string>();
  const [clusterEnvOptions, queryEnvCodeList] = useEnvListOptions();

  const [currentEnvType, setCurrentEnvType] = useState('');
  const [currentEnvCode, setCurrentEnvCode] = useState(''); // 环境code

  const envTypeData = [
    {
      label: 'DEV',
      value: 'dev',
    },
    {
      label: 'TEST',
      value: 'test',
    },
    {
      label: 'PRE',
      value: 'pre',
    },
    {
      label: 'PROD',
      value: 'prod',
    },
  ]; //环境大类

  //列表
  const {
    tableProps,
    search: { submit: queryList, reset },
  } = useTable({
    url: queryRulesList,
    method: 'GET',
    form: searchRulesForm,
    formatter: () => {
      return {
        envCode: currentEnvCode
      };
    },
  });
  // 应用Code 联动 envCode
  const handleAppCodeChange = (next: string) => {
    setAppCode(next);
    searchRulesForm.resetFields(['envCode']);
  };
  return (
    <PageContainer>
      <FilterCard>
        <Form
          layout="inline"
          form={searchRulesForm}
          onFinish={(values: any) => {
            queryList();
          }}
          onReset={() => {
            searchRulesForm.resetFields();
            queryList();
          }}
        >
          <Form.Item label="环境" name="envCode">
            <Select
              style={{ width: '100px' }}
              options={envTypeData}
              value={currentEnvType}
              placeholder="分类"
              onChange={(value) => {
                setCurrentEnvType(value);
                setCurrentEnvCode('');
                void queryEnvCodeList(value);
              }}
              allowClear
            />
            <Select
              style={{ width: '140px', marginLeft: '5px' }}
              options={clusterEnvOptions}
              placeholder="环境名称"
              onChange={(value) => {
                setCurrentEnvCode(value);
              }}
              value={currentEnvCode}
              allowClear
            />
          </Form.Item>
          <Form.Item label="关联应用" name="appCode">
            <Select showSearch allowClear style={{ width: 120 }} options={appOptions} onChange={handleAppCodeChange} />
          </Form.Item>
          <Form.Item label="报警名称" name="name">
            <Input style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select showSearch allowClear style={{ width: 120 }} options={statusOptions} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="ghost" htmlType="reset" danger>
              重置
            </Button>
          </Form.Item>
        </Form>
      </FilterCard>
      <ContentCard>
        <RulesTable dataSource={tableProps} onQuery={queryList} />
      </ContentCard>
    </PageContainer>
  );
}
