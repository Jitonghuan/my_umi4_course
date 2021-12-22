// 告警规则
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React, { useState } from 'react';
import { Form, Select, Input, Button } from 'antd';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import TemplateDrawer from '../_components/template-drawer';
import RulesTable from '../_components/rules-table';

export default function AlarmRules() {
  const { Search } = Input;
  return (
    <PageContainer>
      <FilterCard>
        <Form
          layout="inline"
          // form={formTmpl}
          // onFinish={(values: any) => {
          //   queryList({
          //     ...values,
          //     pageIndex: 1,
          //     pageSize: 20,
          //   });
          // }}
          onReset={() => {
            // formTmpl.resetFields();
            // queryList({
            //   pageIndex: 1,
            //   // pageSize: pageSize,
            // });
          }}
        >
          <Form.Item label="报警名称" name="appCategoryCode">
            <Search placeholder="按表达式或消息模糊搜索" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="环境大类" name="envTypeCode">
            <Select
              showSearch
              style={{ width: 150 }}
              // options={envTypeData}
            />
          </Form.Item>
          <Form.Item label="环境：" name="envCode">
            <Select
              // options={envDatas}
              allowClear
              // onChange={(n) => {
              //   setenvCode(n);
              // }}
              showSearch
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item label="应用" name="templateType">
            <Select
              showSearch
              allowClear
              style={{ width: 120 }}
              // options={templateTypes}
              // onChange={(n) => {
              //   setTemplateType(n);
              // }}
            />
          </Form.Item>
          <Form.Item label="状态" name="languageCode">
            <Select
              showSearch
              allowClear
              style={{ width: 120 }}
              //  options={appDevelopLanguageOptions}
            />
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
        <RulesTable />
      </ContentCard>
    </PageContainer>
  );
}
