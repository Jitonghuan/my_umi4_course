// 筛选 header
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/23 15:36

import React, { useState, useCallback, useEffect, useContext, useMemo } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { FilterCard } from '@/components/vc-page-content';
import { FeContext } from '@/common/hooks';
// import { useAppGroupOptions } from '../../hooks';

const { Item: FormItem } = Form;

export interface FilterHeaderProps {
  onSearch?: (values: any) => any;
  trggerSearchOnInit?: boolean;
}

export default function FilterHeader(props: FilterHeaderProps) {
  const { onSearch, trggerSearchOnInit = false } = props;
  const [searchField] = Form.useForm();
  const { categoryData } = useContext(FeContext);
  const [categoryCode, setCategoryCode] = useState<string>();
  // const [appGroupOptions, appGroupLoading] = useAppGroupOptions(categoryCode || searchParams.appCategoryCode);
  const handleSearch = useCallback(() => {
    const values = searchField.getFieldsValue();
    onSearch?.(values);
  }, [searchField]);

  const handleReset = useCallback(() => {
    setCategoryCode(undefined);
    searchField.setFieldsValue({
      appType: '',
      appCategoryCode: '',
      appGroupCode: '',
      appName: '',
      appCode: '',
    });
    handleSearch();
  }, [searchField]);

  const handleAppCategoryChange = useCallback(
    (next: string) => {
      searchField.setFieldsValue({
        appGroupCode: '',
      });
      setCategoryCode(next);
      handleSearch();
    },
    [searchField],
  );

  useEffect(() => {
    if (trggerSearchOnInit) {
      handleSearch();
    }
  }, []);

  return (
    <FilterCard>
      <Form layout="inline" form={searchField} onFinish={handleSearch} onReset={handleReset}>
        <FormItem label="应用分类" name="appCategoryCode">
          <Select
            // options={appGroupOptions}
            // loading={appGroupLoading}
            placeholder="请选择"
            style={{ width: 140 }}
            allowClear
            onChange={handleSearch}
          />
        </FormItem>
        <FormItem label="版本名称" name="appType">
          <Select
            // options={appTypeOptions}
            placeholder="请选择"
            style={{ width: 180 }}
            allowClear
            onChange={handleSearch}
          />
        </FormItem>
        <FormItem label="版本CODE" name="appCategoryCode">
          <Select
            // options={categoryData}
            placeholder="请选择"
            style={{ width: 180 }}
            allowClear
            onChange={handleAppCategoryChange}
          />
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
