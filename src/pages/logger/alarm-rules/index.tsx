// 告警规则
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React, { useState } from 'react';
import { Form, Select, Input, Button } from 'antd';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import TemplateDrawer from '../_components/template-drawer';
import RulesTable from '../_components/rules-table';
import { useAppOptions, useEnvOptions, useStatusOptions } from './hooks';
import useTable from '@/utils/useTable';
import { queryRulesList } from '../../monitor/basic/services';

export default function AlarmRules() {
  const [searchRulesForm] = Form.useForm();
  const [statusOptions] = useStatusOptions();
  const [appOptions] = useAppOptions();
  const [appCode, setAppCode] = useState<string>();
  const [envOptions] = useEnvOptions(appCode);

  const { Search } = Input;

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
    // formatter: () => {
    //   return {
    //     serviceId,
    //     pageIndex: -1,
    //   };
    // },
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
            reset;
          }}
        >
          <Form.Item label="报警名称" name="ruleName">
            <Search placeholder="按表达式或消息模糊搜索" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="环境大类" name="envTypeCode">
            <Select showSearch style={{ width: 100 }} options={envTypeData} />
          </Form.Item>
          <Form.Item label="应用" name="appCode">
            <Select showSearch allowClear style={{ width: 120 }} options={appOptions} onChange={handleAppCodeChange} />
          </Form.Item>
          <Form.Item label="环境" name="envCode">
            <Select
              options={envOptions}
              allowClear
              // onChange={(n) => {
              //   setenvCode(n);
              // }}
              showSearch
              style={{ width: 120 }}
            />
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
            <Button type="ghost" htmlType="reset">
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
