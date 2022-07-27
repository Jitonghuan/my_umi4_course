// 筛选 header
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/23 15:36

import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { FilterCard } from '@/components/vc-page-content';
import { FeContext } from '@/common/hooks';

const { Item: FormItem } = Form;

export interface FilterHeaderProps {
  onSearch?: (values: any) => any;
  trggerSearchOnInit?: boolean;
  searchParams?: any;
}

export default function FilterHeader(props: FilterHeaderProps) {
  const { onSearch, trggerSearchOnInit = false, searchParams = {} } = props;

  const [searchField] = Form.useForm();
  const { categoryData } = useContext(FeContext);
  const [categoryCode, setCategoryCode] = useState<string>();

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
      <Form
        layout="inline"
        initialValues={searchParams}
        form={searchField}
        onFinish={handleSearch}
        onReset={handleReset}
      >
        <FormItem label="名称" name="appName">
          <Input placeholder="请输入" style={{ width: 140 }} />
        </FormItem>
        <FormItem label="分类" name="appCategoryCode">
          <Select
            options={categoryData}
            placeholder="请选择"
            style={{ width: 120 }}
            allowClear
            onChange={handleAppCategoryChange}
          />
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}>
            查询
          </Button>
          <Button type="default" htmlType="reset" danger>
            重置
          </Button>
        </FormItem>
      </Form>
    </FilterCard>
  );
}
