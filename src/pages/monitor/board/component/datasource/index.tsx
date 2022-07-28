import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { FilterCard } from '@/components/vc-page-content';
import { ContentCard } from '@/components/vc-page-content';
import { Divider, Drawer, Popconfirm, Switch, Table } from '@cffe/h2o-design';
import { createGraphDatasouce, delGraphDatasouce, getGraphGraphDatasouceList, updateGraphDatasouce } from '../../service';
import { PlusOutlined } from '@ant-design/icons';
import { Detail } from '@cffe/internal-icon';


const DataSource = (props: any) => {
  const { onSearch, searchParams = {}, cluster } = props;
  const [searchField] = Form.useForm();
  const [editForm] = Form.useForm();
  const [type, setType] = useState<string>('')
  const [categoryCode, setCategoryCode] = useState<string>();
  const [checked, setChecked] = useState<boolean>(false)
  const [selectedType, setSelectedType] = useState<String>('')
  const [dataSource, setDataSource] = useState<any[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [sourceDetail, setSourceDetail] = useState<any>({})
  const [total, setTotal] = useState<number>(0)


  const handleReset = useCallback(() => {
    setCategoryCode(undefined);
    searchField.setFieldsValue({
      appType: '',
      appCategoryCode: '',
      appGroupCode: '',
      appName: '',
      appCode: '',
    });
  }, [searchField]);

  const handleAppCategoryChange = useCallback(
    (next: string) => {
      searchField.setFieldsValue({
        appGroupCode: '',
      });
      setCategoryCode(next);
    },
    [searchField],
  );

  useEffect(() => {
    getDatasourceList();
  }, []);

  const handleSearch = (formValue: any) => {
    getDatasourceList(formValue)
  }

  const getDatasourceList = async (formValue: any = {}) => {
    const { dsType, keyword } = formValue
    console.log('111', cluster)
    if (cluster) {
      console.log('cluster', cluster);
      const res = await getGraphGraphDatasouceList(cluster, dsType, keyword)
      if (res && Array.isArray(res?.data?.dataSource)) {
        setDataSource(res.data.dataSource)
        setTotal(res?.data?.pageInfo?.total || 0)
      }
    }
  }

  const onTypeChange = (value: string) => {
    setType(value);
  }

  const onSwitchChange = () => {

  }

  const handleEdit = (record: any) => {
    setVisible(true);
    setSourceDetail(record);
    editForm.setFieldsValue(record);
  }

  const handleDelete = async (id: number) => {
    console.log(id)
    await delGraphDatasouce(cluster, id)
  }

  const handleSubmit = async () => {
    setSaveLoading(true)
    const value = editForm.getFieldsValue()
    if (sourceDetail?.id) {
      await updateGraphDatasouce({ ...sourceDetail, ...value })
    } else {
      await createGraphDatasouce(value)
    }
  }

  const colums = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '数据源名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '数据源类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url'
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text: string, record: any) => {
        return (
          <>
            <Button type='link' onClick={() => { handleEdit(record) }}>编辑</Button>
            <Popconfirm
              title='确定要删除吗？'
              onConfirm={() => { handleDelete(record.id) }}
              okText='删除'
              cancelText='取消'
            >
              <Button type='link'>删除</Button>
            </Popconfirm>
          </>
        )
      }
    },
  ]

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
          <Form.Item label="名称" name="keyword">
            <Input placeholder="请输入数据源名称" style={{ width: 140 }} />
          </Form.Item>
          <Form.Item label="数据源类型" name="dsType">
            <Select
              options={[
                { label: 'elasticsearch', value: 'elasticsearch' },
                { label: 'prometheus', value: 'prometheus' },
              ]}
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

        <Button type="primary" onClick={() => { setVisible(true); setSourceDetail(null) }}>
          <PlusOutlined />
          新增应用
        </Button>
      </FilterCard>
      <ContentCard>
        <Table columns={colums} dataSource={dataSource} />
      </ContentCard>
      <Drawer
        visible={visible}
        destroyOnClose
        onClose={() => { setVisible(false) }}
        footer={
          <div className="drawer-footer">
            <Button type="primary" loading={saveLoading} onClick={handleSubmit}>
              保存
            </Button>
            <Button type="default" onClick={props.onClose}>
              取消
            </Button>
          </div>
        }
      >
        <Form
          form={editForm}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item label="名称" name="dsName">
            <Input />
          </Form.Item>
          <Form.Item label="类型" name="dsType">
            <Select
              options={[
                { label: 'elasticsearch', value: 'elasticsearch' },
                { label: 'prometheus', value: 'prometheus' },
              ]}
              onChange={onTypeChange}
            />
          </Form.Item>
          <Form.Item label="URL" name="dsUrl">
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
          {selectedType === 'elasticsearch' &&
            <Form.Item label="索引名称" name="">
              <Input />
            </Form.Item>
          }
          {selectedType === 'elasticsearch' &&
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
