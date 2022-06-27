import React, { useMemo, useState, useCallback, useContext } from 'react';
import {Button, Form, Input, message, Select, Table} from 'antd';
import PageContainer from '@/components/page-container';
import { FilterCard } from '@/components/vc-page-content';
import './index.less';
const { Item: FormItem } = Form;

export default function NpmList() {
  const [searchField] = Form.useForm();

  function handleSearch() {}

  return (
    <PageContainer className="npm-list-page">
      <FilterCard>
        <Form
          layout="inline"
          form={searchField}
          onFinish={handleSearch}
          onReset={() => {
            searchField.resetFields();
          }}
        >
          <FormItem label="包名" name="appCode">
            <Input placeholder="请输入" style={{ width: 140 }} />
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}>
              查询
            </Button>
            <Button type="default" htmlType="reset">
              重置
            </Button>
          </FormItem>
        </Form>
      </FilterCard>
    </PageContainer>
  );
}
