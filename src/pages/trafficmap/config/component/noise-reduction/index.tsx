import React, { useState, useEffect, useRef } from 'react';
import { Form, Select, Input, Button, Table, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import appConfig from '@/app.config';
import { delRequest } from '@/utils/request';
import './index.less';
import AddNoise from './add-noise';

export default function NoiseReduction() {
  const [noiseList, setNoiseList] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [noiseDrawer, setNoiseDrawer] = useState<EditorMode>('HIDE');
  const [initData, setInitData] = useState([])

  // 启用-禁用
  const handleOperate = (record: any) => {

  }
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
      dataIndex: 'noiseReductionComponents',
      key: 'noiseReductionComponents',
    },
    {
      title: '降噪措施',
      dataIndex: 'noiseReductionComponents',
      key: 'noiseReductionComponents',
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
                handleDeleteNoise(record.id);
              }}
            >
              <Button type="link" >
                {record.isEnable ? '禁用' : '启用'}
              </Button>
            </Popconfirm>
            <Button type="link">
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
  const onSearch = () => { };

  const handleDeleteNoise = async (id: number) => {
    await delRequest(`${appConfig.apiPrefix}/trafficMap/tracing/noiseReduction/delete/${id}`);
    // loadListData({
    //   pageIndex: 1,
    //   pageSize: 20,
    // });
  };
  //   启用禁用
  const handleConfig = (data: any) => { };
  return (
    <div className="noise-reduciton">
      <AddNoise
        mode={noiseDrawer}
        initData={initData}
        onSave={() => {
          setNoiseDrawer('HIDE');

        }}
        onClose={() => {
          setNoiseDrawer('HIDE');
        }}></AddNoise>
      <Form
        layout="inline"
        onFinish={onSearch}
      // onReset={() => {
      //   requestRegionList();
      // }}
      >
        <Form.Item label="降噪名称" name="regionName">
          <Input />
        </Form.Item>
        <Form.Item label="降噪code" name="regionCode">
          <Input />
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
          }}
        >
          <PlusOutlined />
          新增降噪
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
      />
      {/* </ContentCard> */}
      {/* <CreateRegionDrawer ref={createRegionRef} requestRegionList={requestRegionList} envOptions={envOptions} /> */}
    </div>
  );
}
