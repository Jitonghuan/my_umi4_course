// 筛选 header
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/23 15:36

import React, { useCallback } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { FilterCard } from '@/components/vc-page-content';
import { useQueryCategory } from '../../hooks';

const { Item: FormItem } = Form;

export interface FilterHeaderProps {
  onSearch?: (paramsObj: { versionCode?: string; versionName?: string; appCategoryCode?: string }) => any;
}

export default function FilterHeader(props: FilterHeaderProps) {
  const [loading, categoryData] = useQueryCategory();
  const { onSearch } = props;
  const [searchField] = Form.useForm();
  const handleSearch = useCallback(() => {
    const values = searchField.getFieldsValue();
    onSearch?.(values);
  }, [searchField]);

  const handleReset = useCallback(() => {
    searchField.setFieldsValue({
      versionName: '',
      appCategoryCode: '',
      versionCode: '',
    });
    handleSearch();
  }, [searchField]);

  return (
    <FilterCard>
      <Form layout="inline" form={searchField} onFinish={handleSearch} onReset={handleReset}>
        <FormItem label="应用分类" name="appCategoryCode">
          <Select
            options={categoryData}
            loading={loading}
            placeholder="请选择"
            style={{ width: 140 }}
            allowClear
            onChange={handleSearch}
          />
        </FormItem>
        <FormItem label="版本名称" name="versionName">
          <Input placeholder="请输入版本名称" style={{ width: 200 }} />
        </FormItem>
        <FormItem label="版本CODE" name="versionCode">
          <Input placeholder="请输入版本CODE" style={{ width: 200 }} />
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
