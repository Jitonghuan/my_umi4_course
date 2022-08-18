import React, { useState, useEffect, useRef } from 'react';
import { Form, Select, Input, Button, Table, Popconfirm, Tag } from 'antd';
import appConfig from '@/app.config';
import { delRequest } from '@/utils/request';
import './index.less';
import AddNoise from './add-noise';
import { getNoiseList, updataNoise } from '../../../service';

export default function NoiseReduction() {
  const [noiseList, setNoiseList] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState<number>(20);
  const [form] = Form.useForm();
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [noiseDrawer, setNoiseDrawer] = useState<EditorMode>('HIDE');
  const [initData, setInitData] = useState<any>({})

  useEffect(() => {
    queryNoiseList({ pageIndex, pageSize });
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '配置名',
      dataIndex: 'noiseReductionName',
      key: 'noiseReductionName',
    },
    {
      title: '降噪组件',
      dataIndex: 'noiseReductionComponent',
      key: 'noiseReductionComponent',
    },
    {
      title: '降噪措施',
      dataIndex: 'noiseReductionMeasure',
      key: 'noiseReductionMeasure',
    },
    {
      title: '状态',
      dataIndex: 'isEnable',
      key: 'isEnable',
      render: (text: string, record: any) => {
        return record?.isEnable ? <Tag color="green">已启用</Tag> : <Tag color="red">已禁用</Tag>
      }
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'action',
      render: (text: string, record: any) => {
        return (
          <>
            <Popconfirm
              title={`确定${record.isEnable ? '禁用' : '启用'}吗？`}
              okText="是"
              cancelText="否"
              onConfirm={() => {
                handleUpdateNoise(record);
              }}
            >
              <Button type="link" >
                {record.isEnable ? '禁用' : '启用'}
              </Button>
            </Popconfirm>
            <Button type="link" onClick={() => { setInitData(record); setNoiseDrawer('EDIT') }}>
              编辑
            </Button>
            <Popconfirm
              title="确认删除"
              okText="是"
              cancelText="否"
              onConfirm={() => {
                handleDeleteNoise(record.id);
              }}
            >
              <Button type="link">删除</Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  // 获取列表数据
  const queryNoiseList = (params: any) => {
    const value = form.getFieldsValue();
    setLoading(true)
    try {
      getNoiseList({ ...params, ...value }).then((res) => {
        if (res) {
          setNoiseList(res?.data?.dataSource)
          setTotal(res?.data?.pageInfo?.total)
        }
      })
    } catch (error) {
      setNoiseList([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const pageSizeClick = (pagination: any) => {
    setPageIndex(pagination.current);
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    queryNoiseList(obj);
  }

  const handleUpdateNoise = async (record: any) => {
    const params = Object.assign(record, { isEnable: !record.isEnable })
    const res = await updataNoise({ ...params });
    if (res && res.success) {
      queryNoiseList({ pageIndex: 1, pageSize })
    }
  }

  const handleDeleteNoise = async (id: number) => {
    const res = await delRequest(`${appConfig.apiPrefix}/trafficMap/tracing/noiseReduction/delete/${id}`);
    if (res?.success) {
      queryNoiseList({ pageIndex: 1, pageSize })
    }
  };
  return (
    <div className="noise-reduciton">
      <AddNoise
        mode={noiseDrawer}
        initData={initData}
        onSave={() => {
          setNoiseDrawer('HIDE');
          queryNoiseList({ pageIndex, pageSize })
        }}
        onClose={() => {
          setNoiseDrawer('HIDE');
        }}></AddNoise>
      <Form
        layout="inline"
        onFinish={() => { queryNoiseList({ pageIndex: 1, pageSize }) }}
        form={form}
        onReset={() => {
          form.resetFields();
          queryNoiseList({ pageIndex: 1, pageSize: 20 })
        }}
      >
        <Form.Item label="降噪配置名称：" name="noiseReductionName">
          <Input style={{ width: 160 }} placeholder="请输入降噪名称" ></Input>
        </Form.Item>
        <Form.Item label="降噪组件：" name="noiseReductionComponent">
          <Input style={{ width: 160 }} placeholder="请输入降噪组件" ></Input>
        </Form.Item>
        <Form.Item label="降噪措施：" name="noiseReductionMeasure">
          <Select style={{ width: 120 }} allowClear>
            <Select.Option value='merge'>merge</Select.Option>
            <Select.Option value='ignore'>ignore</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="是否启用：" name="isEnable" >
          <Select allowClear style={{ width: '100px' }}>
            <Select.Option value={true}>已启用</Select.Option>
            <Select.Option value={false}>已禁用</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="ghost" htmlType="reset">
            重置
          </Button>
        </Form.Item>
      </Form>
      {/* </FilterCard> */}
      {/* <ContentCard style={{ backgroundColor: '#F7F8FA' }}> */}
      <div className="noise-table-header">
        {/* <h3>配置域列表</h3> */}
        <Button
          type="primary"
          ghost

          onClick={() => {
            setNoiseDrawer('ADD')
            setInitData(undefined);
          }}
        >

          + 新增降噪
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={noiseList}
        loading={loading}
        pagination={{
          current: pageIndex,
          total,
          pageSize,
          showSizeChanger: true,
          onShowSizeChange: (_, size) => {
            setPageSize(size);
            setPageIndex(1); //
          },
          showTotal: () => `总共 ${total} 条数据`,
        }}
        onChange={pageSizeClick}
      />

    </div>
  );
}
