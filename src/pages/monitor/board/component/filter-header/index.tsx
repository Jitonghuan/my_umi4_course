// 筛选 header
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/23 15:36

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { getCluster } from '../../service';

const { Item: FormItem } = Form;

export interface FilterHeaderProps {
  onSearch?: (values: any) => any;
  trggerSearchOnInit?: boolean;
  searchParams?: any;
}

export default function FilterHeader(props: FilterHeaderProps) {

  const [clusterList, setClusterList] = useState<any>([])
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

  useEffect(() => {
    getCluster().then((res) => {
      if (res.success) {
        const data = res.data.map((item: any) => {
          return {
            label: item.clusterName,
            value: item.id
          }
        })
        setClusterList(data);
        const localstorageData = JSON.parse(localStorage.getItem('__monitor_board_cluster_selected') || '{}')
        if (localstorageData?.clusterCode) {
          onClusterChange(localstorageData.clusterCode)
        } else {
          if (data?.[0]?.value) {
            onClusterChange(data?.[0]?.value)
          } else {
            searchField.setFieldValue('clusterCode', null)
          }
        }
      }
    })
  }, [])

  const onClusterChange = (value: number) => {
    // setCurCluster(value)
    searchField.setFieldValue('clusterCode', value)
    const localstorageData = { clusterCode: value }
    localStorage.setItem('__monitor_board_cluster_selected', JSON.stringify(localstorageData))
  }

  return (
    <Form
      layout="inline"
      form={searchField}
      onFinish={handleSearch}
      onReset={handleReset}
    >
      {/* <FormItem label="集群选择" name="clusterCode">
        <Select
          clearIcon={false}
          style={{ width: '150px' }}
          options={clusterList}
        />
      </FormItem> */}
      <FormItem label="名称" name="keyword">
        <Input placeholder="请输入" style={{ width: 140 }} />
      </FormItem>
      {/* <FormItem label="分类" name="graphType">
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
          style={{ width: 150 }}
          allowClear
        />
      </FormItem> */}
      <FormItem>
        <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}>
          查询
        </Button>
        <Button type="default" htmlType="reset" >
          重置
        </Button>
      </FormItem>
    </Form>
  );
}
