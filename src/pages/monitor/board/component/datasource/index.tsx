import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { FilterCard } from '@/components/vc-page-content';
import { ContentCard } from '@/components/vc-page-content';
import { Divider, Drawer, Popconfirm, Switch, Table } from '@cffe/h2o-design';
import { createGraphDatasouce, delGraphDatasouce, getCluster, getGraphGraphDatasouceList, updateGraphDatasouce } from '../../service';
import { PlusOutlined } from '@ant-design/icons';


const DataSource = (props: any) => {
  const [searchField] = Form.useForm();
  const [editForm] = Form.useForm();
  const [type, setType] = useState<string>('')
  const [dataSource, setDataSource] = useState<any[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [sourceDetail, setSourceDetail] = useState<any>({})
  const [drawerTitle, setDrawerTitle] = useState<any>('')

  const [clusterCode, setClusterCode] = useState<number | null>(null)
  const [clusterList, setClusterList] = useState<any>([])

  const [paging, setPaging] = useState<{
    pageSize: number;
    current: number;
  }>({
    current: 1,
    pageSize: 10
  })

  const handleReset = () => {
    searchField.resetFields();
    getDatasourceList({
      current: 1,
      // pageSize: 10
    });
  };

  // useEffect(() => {
  //   getDatasourceList(paging);
  // }, [clusterCode]);

  useEffect(() => {
    getDatasourceList({
      current: 1,
      pageSize: 20
    });
  }, [clusterCode])

  const handleSearch = (pagingParams?: any) => {
    getDatasourceList(pagingParams)
  }

  const getDatasourceList = async (pagingParams?: any) => {
    if (clusterCode) {
      const data = {
        clusterCode: clusterCode,
        // pageIndex: pagingParams ? pagingParams.current : paging.current,
        // pageSize: pagingParams ? pagingParams.pageSize : paging.pageSize,
        ...searchField.getFieldsValue()
      }
      if (pagingParams) {
        setPaging(pagingParams)
      }
      getGraphGraphDatasouceList(data).then((res) => {
        if (res && Array.isArray(res?.data?.dataSource)) {
          setDataSource(res.data.dataSource)
        }
      })
    }
  }

  const onTypeChange = (value: string) => {
    setType(value);
  }


  const handleEdit = (record: any) => {
    const { name, uuid, url, type, user, password, indexName, esVersion } = record;
    const formValue = {
      clusterCode: clusterCode,
      dsType: type,
      dsName: name,
      dsUrl: url,
      dsUuid: uuid,
      user,
      password,
      indexName,
      esVersion,
    }
    setDrawerTitle('编辑数据源')
    setType(type)
    setVisible(true);
    setSourceDetail(formValue);
    editForm.setFieldsValue(formValue);
  }

  const handleDelete = async (id: number) => {
    await delGraphDatasouce(id)
    getDatasourceList({
      pageIndex: 1,
      pageSize: paging.pageSize
    })
  }

  const handleSubmit = async () => {
    setSaveLoading(true)
    const value = await editForm.validateFields()
    try {
      if (sourceDetail?.dsUuid) {
        updateGraphDatasouce({ ...sourceDetail, ...value, }).then((res) => {
          if (res?.success) {
            message.success("更新成功")
            getDatasourceList({
              current: 1,
              // pageSize: paging.pageSize
            })
            handleClose()
          } else {
            message.error("更新失败")
          }
        })
      } else {
        createGraphDatasouce({ ...value, }).then((res) => {
          if (res?.success) {
            message.success("创建成功")
            getDatasourceList()
            handleClose()
          } else {
            message.error("创建失败")
          }
        })
      }
    } catch (e) {
      throw e
    }

    setSaveLoading(false)
  }

  const handleClose = () => {
    setVisible(false)
    setSourceDetail(null)
    editForm.resetFields()
  }

  const colums = [
    {
      title: 'ID',
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
              onConfirm={() => { handleDelete(record.uuid) }}
              okText='删除'
              cancelText='取消'
            >
              <Button type='link' style={{ color: 'rgb(255, 48, 3)' }}>删除</Button>
            </Popconfirm>
          </>
        )
      }
    },
  ]

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
            setClusterCode(null)
          }
        }
      }
    })
  }, [])

  const onClusterChange = (value: number) => {
    setClusterCode(value)
    const localstorageData = { clusterCode: value }
    localStorage.setItem('__monitor_board_cluster_selected', JSON.stringify(localstorageData))
  }

  return (
    <>
      <FilterCard>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Form
            layout="inline"
            // initialValues={searchParams}
            form={searchField}
            onFinish={() => {
              handleSearch({
                current: 1,
                // pageSize: paging.pageSize
              })
            }}
            onReset={handleReset}
          >
            <Form.Item label="集群选择">
              <Select
                clearIcon={false}
                style={{ width: '250px' }}
                options={clusterList}
                value={clusterCode}
                onChange={(value) => {
                  onClusterChange(value);
                  // history.replace({
                  //   pathname: 'detail',
                  //   search: `?currentClusterCode=${clusterCode}`
                  // })

                }}
              />
            </Form.Item>
            <Form.Item label="名称" name="name">
              <Input placeholder="请输入" style={{ width: 140 }} />
            </Form.Item>
            <Form.Item label="数据源类型" name="dsType">
              <Select
                options={[
                  { label: 'elasticsearch', value: 'elasticsearch' },
                  { label: 'prometheus', value: 'prometheus' },
                ]}
                placeholder="请选择"
                style={{ width: 150 }}
                allowClear
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}>
                查询
              </Button>
              <Button type="default" htmlType="reset" >
                重置
              </Button>
            </Form.Item>
          </Form>

          <Button type="primary" onClick={() => { setVisible(true); setSourceDetail(null); setDrawerTitle('新增数据源') }}>
            <PlusOutlined />
            新增数据源
          </Button>
        </div>
      </FilterCard>
      <ContentCard>
        <Table columns={colums} dataSource={dataSource} pagination={false}
        // pagination={
        //   {
        //     total: total,
        //     ...paging,
        //     onChange: (current, pageSize) => {
        //       handleSearch({
        //         current,
        //         pageSize
        //       })
        //     },
        //   }

        // }
        />
      </ContentCard>
      <Drawer
        visible={visible}
        title={drawerTitle}
        destroyOnClose
        onClose={handleClose}
        footer={
          <div className="drawer-footer">
            <Button type="primary" loading={saveLoading} onClick={handleSubmit}>
              保存
            </Button>
            <Button type="default" onClick={handleClose}>
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
          <Form.Item label="名称" name="dsName" rules={[{ required: true, message: '请输入名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="类型" name="dsType" rules={[{ required: true, message: '请选择类型!' }]}>
            <Select
              options={[
                { label: 'elasticsearch', value: 'elasticsearch' },
                { label: 'prometheus', value: 'prometheus' },
              ]}
              onChange={onTypeChange}
            />
          </Form.Item>
          <Form.Item label="集群选择" name="clusterCode" rules={[{ required: true, message: '请选择集群' }]}>
            <Select
              showSearch
              allowClear
              style={{ width: '250px' }}
              options={clusterList}
            />
          </Form.Item>
          <Form.Item label="URL" name="dsUrl" rules={[{ required: true, message: '请输入URL' }]}>
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
            <Input.Password placeholder="请输入密码" />
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
