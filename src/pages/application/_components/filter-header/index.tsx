// 筛选 header
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/23 15:36

import React, { useState, useCallback, useContext, useMemo } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { FilterCard } from '@/components/vc-page-content';
import FEContext from '@/layouts/basic-layout/fe-context';
import { useAppGroupOptions } from './hooks';

const { Item: FormItem } = Form;

export interface FilterHeaderProps {
  onSearch?: (values: any) => any;
}

export default function FilterHeader(props: FilterHeaderProps) {
  const [searchField] = Form.useForm();
  const { categoryData } = useContext(FEContext);
  const [categoryCode, setCategoryCode] = useState<string>();
  const [appGroupOptions, appGroupLoading] = useAppGroupOptions(categoryCode);

  const handleSearch = useCallback(() => {
    const values = searchField.getFieldsValue();
    console.log('> handleSearch', values);
    props.onSearch?.(values);
  }, [searchField]);

  const handleReset = useCallback(() => {
    setCategoryCode(undefined);
    handleSearch();
  }, [searchField]);

  const handleAppCategoryChange = useCallback(
    (next: string) => {
      searchField.resetFields(['appGroupCode']);
      setCategoryCode(next);
    },
    [searchField],
  );

  const appTypeOptions = useMemo(
    () => [
      { value: 'backend', label: '后端' },
      { value: 'frontend', label: '前端' },
    ],
    [],
  );

  return (
    <FilterCard>
      <Form layout="inline" form={searchField} onFinish={handleSearch} onReset={handleReset}>
        <FormItem label="应用类型" name="appType">
          <Select options={appTypeOptions} placeholder="请选择" style={{ width: 100 }} allowClear />
        </FormItem>
        <FormItem label="应用分类" name="appCategoryCode">
          <Select
            options={categoryData}
            placeholder="请选择"
            style={{ width: 120 }}
            allowClear
            onChange={handleAppCategoryChange}
          />
        </FormItem>
        <FormItem label="应用组" name="appGroupCode">
          <Select
            options={appGroupOptions}
            loading={appGroupLoading}
            placeholder="请选择"
            style={{ width: 140 }}
            allowClear
          />
        </FormItem>
        <FormItem label="应用名" name="appName">
          <Input placeholder="请输入" style={{ width: 140 }} />
        </FormItem>
        <FormItem label="应用Code" name="appCode">
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
  );
}
