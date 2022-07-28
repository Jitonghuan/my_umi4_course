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
  const [dataSource, setDataSource] = useState<any[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [sourceDetail, setSourceDetail] = useState<any>({})
  const [total, setTotal] = useState<number>(0)


  const handleReset = useCallback(() => {
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
    if (cluster) {
      const data = {
        clusterCode: cluster,
        ...formValue,
      }
      const res = await getGraphGraphDatasouceList(data)
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
    setChecked(!checked)
  }

  const handleEdit = (record: any) => {
    console.log(record)
    const { name, uuid, url, type, user, password, indexName, esVersion } = record;
    const formValue = {
      clusterCode: cluster,
      dsType: type,
      dsName: name,
      dsUrl: url,
      dsUuid: uuid,
      user,
      password,
      indexName,
      esVersion,
    }
    setType(type)
    setVisible(true);
    setSourceDetail(formValue);
    editForm.setFieldsValue(formValue);
  }

  const handleDelete = async (id: number) => {
    console.log(id)
    await delGraphDatasouce(cluster, id)
  }

  const handleSubmit = async () => {
    setSaveLoading(true)
    const value = editForm.getFieldsValue()
    if (sourceDetail?.dsUuid) {
      await updateGraphDatasouce({ ...sourceDetail, ...value, clusterCode: cluster })
    } else {
      await createGraphDatasouce({ ...value, clusterCode: cluster })
    }
    setSaveLoading(false)
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
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
        </div>
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
          {/* <Form.Item label="认证">
            <Switch checked={checked} onChange={onSwitchChange} />
          </Form.Item> */}
          <Form.Item label="用户名" name="user">
            <Input />
          </Form.Item>
          <Form.Item label="密码" name="password">
            <Input type='password' />
          </Form.Item>
          {type === 'elasticsearch' &&
            <Form.Item label="索引名称" name="indexName">
              <Input />
            </Form.Item>
          }
          {type === 'elasticsearch' &&
            <Form.Item label="版本" name="esVersion">
              <Select options={[
                { label: '6.0+', value: '60' },
                { label: '7.0+', value: '70' },
              ]} />
            </Form.Item>
          }
        </Form>
      </Drawer>
    </>
  )
}

export default DataSource
