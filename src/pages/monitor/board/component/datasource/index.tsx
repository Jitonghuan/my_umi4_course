import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { FilterCard } from '@/components/vc-page-content';
import { ContentCard } from '@/components/vc-page-content';
import { Divider, Drawer, Switch, Table } from '@cffe/h2o-design';


const DataSource = (props: any) => {
  const { onSearch, trggerSearchOnInit = false, searchParams = {} } = props;

  const [searchField] = Form.useForm();
  const [type, setType] = useState([])
  const [categoryCode, setCategoryCode] = useState<string>();
  const [checked, setChecked] = useState<boolean>(false)
  const [selectedType, setSelectedType] = useState<String>('')

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

  const onSwitchChange = () => {

  }

  const onTypeChange = (value: string) => {
    setType(value);
  }

  return (
    <>
      <FilterCard>
        <Form
          layout="inline"
          initialValues={searchParams}
          form={searchField}
          onFinish={handleSearch}
          onReset={handleReset}
        >
          <Form.Item label="名称" name="appName">
            <Input placeholder="请输入数据源名称" style={{ width: 140 }} />
          </Form.Item>
          <Form.Item label="数据源类型" name="appCategoryCode">
            <Select
              options={type}
              placeholder="请选择"
              style={{ width: 120 }}
              allowClear
              onChange={handleAppCategoryChange}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}>
              查询
            </Button>
            <Button type="default" htmlType="reset" danger>
              重置
            </Button>
          </Form.Item>
        </Form>
      </FilterCard>
      <ContentCard>
        <Table />
      </ContentCard>
      <Drawer>
        <Form
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item label="名称" name="">
            <Input />
          </Form.Item>
          <Form.Item label="类型" name="">
            <Select
              options={[
                { label: 'ElasticSearch', value: 'ElasticSearch' },
                { label: 'Prometheus', value: 'Prometheus' },
              ]}
              onChange={onTypeChange}
            />
          </Form.Item>
          <Form.Item label="URL" name="">
            <Input />
          </Form.Item>
          <Divider />
          <Form.Item label="认证">
            <Switch checked={checked} onChange={onSwitchChange} />
          </Form.Item>
          <Form.Item label="用户名" name="">
            <Input />
          </Form.Item>
          <Form.Item label="密码" name="">
            <Input type='password' />
          </Form.Item>
          {selectedType === 'ElasticSearch' &&
            <Form.Item label="索引名称" name="">
              <Input />
            </Form.Item>
          }
          {selectedType === 'ElasticSearch' &&
            <Form.Item label="版本" name="">
              <Select />
            </Form.Item>
          }
        </Form>
      </Drawer>
    </>
  )
}

export default DataSource
