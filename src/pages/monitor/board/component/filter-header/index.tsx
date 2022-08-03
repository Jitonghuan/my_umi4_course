// 筛选 header
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/23 15:36

import React, { useEffect } from 'react';
import { Form, Input, Select, Button } from 'antd';

const { Item: FormItem } = Form;

export interface FilterHeaderProps {
  onSearch?: (values: any) => any;
  trggerSearchOnInit?: boolean;
  searchParams?: any;
}

export default function FilterHeader(props: FilterHeaderProps) {
  const { onSearch } = props;

  const [searchField] = Form.useForm();

  const handleSearch = () => {
    const values = searchField.getFieldsValue();
    onSearch?.(values);
  };

  const handleReset = () => {
    searchField.resetFields();
    handleSearch();
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
      <Form
        layout="inline"
        form={searchField}
        onFinish={handleSearch}
        onReset={handleReset}
      >
        <FormItem label="名称" name="keyword">
          <Input placeholder="请输入" style={{ width: 140 }} />
        </FormItem>
        <FormItem label="分类" name="graphType">
          <Select
            options={[
              {
                label: "业务监控大盘",
                value: "业务监控大盘",
              },
              {
                label: "集群监控大盘",
                value: "集群监控大盘",
              }
            ]}
            placeholder="请选择"
            style={{ width: 120 }}
            allowClear
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
  );
}
