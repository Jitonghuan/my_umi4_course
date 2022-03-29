// 产品描述页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/02/21 17:10

import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, Typography, Tag, Modal, Descriptions } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { addAPIPrefix } from '@/utils';
import { getRequest, delRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { useEditProductDescription, useCreateProductVersion } from './hooks';
import versionManageList from 'mock/versionManageList';

export interface Item {
  id: string;
  templateName: string;
  templateCode: string;
  appCode: string;
  appVsersion: string;
  envCode: string;
  status?: number;
}
export default function deliveryDescription() {
  const { Paragraph } = Typography;
  const descriptionInfoData: any = history.location.state;
  const [editableStr, setEditableStr] = useState('');
  const [editLoading, editProductDescription] = useEditProductDescription();
  const [creatLoading, createProductVersion] = useCreateProductVersion();
  const { Option } = Select;
  const [loading, setLoading] = useState(false);
  const [creatVersionVisiable, setCreatVersionVisiable] = useState<boolean>(false);
  const [versionListData, setVersionListData] = useState<any[]>([
    {
      key: '1',
      templateName: '8888',
      appName: '应用模版',
      templateCode: 'xuxu',
      appCategoryCode: 'xiniuyiliao',
      envCode: '天台',
      id: '1',
    },
  ]);
  useEffect(() => {
    versionList();
  }, []);

  const versionList = () => {
    getRequest(addAPIPrefix('/deliverManage/deliverDeploy/list')).then((result) => {
      const source = result?.data?.dataSource;
      setVersionListData(source);
    });
  };
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [formTmpl] = Form.useForm();
  const [pageTotal, setPageTotal] = useState<number>();
  const [createProductVisible, setCreateProductVisible] = useState<boolean>(false); //是否展示抽屉
  const pageSizeClick = () => {};
  //删除数据
  const handleDelItem = (record: any) => {
    let id = record.id;
  };

  const columns = [
    {
      title: '版本',
      dataIndex: 'id',
      width: '30%',
    },
    {
      title: '版本描述',
      dataIndex: 'templateName',
      width: '30%',
      ellipsis: true,
    },
    {
      title: '发布时间',
      dataIndex: 'time',
      width: '30%',
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: 150,
      render: (_: string, record: Item) => (
        <Space>
          <a>管理</a>
          <Popconfirm
            title="发布后编排不可修改，是否确认发布？"
            onConfirm={() => {}}
            // onCancel={cancel}
            okText="确认"
            cancelText="取消"
          >
            <a>发布</a>
          </Popconfirm>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => {}}
            // onCancel={cancel}
            okText="是"
            cancelText="否"
          >
            <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const handleSubmit = () => {
    setCreateProductVisible(false);
  };
  return (
    <PageContainer>
      <Modal
        title="创建版本"
        visible={creatVersionVisiable}
        onCancel={() => {
          setCreatVersionVisiable(false);
        }}
        onOk={() => {
          setCreatVersionVisiable(false);
        }}
      >
        <Form layout="vertical" style={{ paddingLeft: 30 }}>
          <Form.Item label="版本号:">
            <Input style={{ width: 420 }} placeholder="请输入版本号"></Input>
          </Form.Item>
          <Form.Item label="版本描述:">
            <Input style={{ width: 420 }} placeholder="请输入版本描述"></Input>
          </Form.Item>
        </Form>
      </Modal>
      <ContentCard>
        <div>
          <Descriptions title="基本信息" column={2} extra={<Button type="primary">编辑</Button>}>
            <Descriptions.Item label="产品名称">{descriptionInfoData.productName}</Descriptions.Item>
            <Descriptions.Item label="产品描述">
              <Paragraph editable={{ onChange: () => editProductDescription }}>
                {' '}
                {descriptionInfoData.productDescription}
              </Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>
              {descriptionInfoData.gmtCreate}
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div className="version-manage">
          <div className="table-caption">
            <div className="caption-left">
              <h3>版本管理</h3>
            </div>
            <div className="caption-right">
              <Button type="primary" onClick={() => setCreatVersionVisiable(true)}>
                创建版本
              </Button>
            </div>
          </div>
          <div>
            <Table
              rowKey="id"
              dataSource={versionListData}
              bordered
              columns={columns}
              loading={loading}
              pagination={{
                total: pageTotal,
                pageSize,
                current: pageIndex,
                showSizeChanger: true,
                onShowSizeChange: (_, size) => {
                  setPageSize(size);
                  setPageIndex(1);
                },
                showTotal: () => `总共 ${pageTotal} 条数据`,
              }}
              // pagination={{ showSizeChanger: true, showTotal: () => `总共 ${pageTotal} 条数据`  }}
              onChange={pageSizeClick}
            ></Table>
          </div>
        </div>

        <Modal
          title="创建版本"
          visible={createProductVisible}
          footer={
            <div className="drawer-footer">
              <Button type="primary" loading={loading} onClick={handleSubmit}>
                确定
              </Button>
              <Button type="default">取消</Button>
            </div>
          }
        >
          <Form layout="vertical">
            <Form.Item label="版本号:">
              <Input style={{ width: 470 }}></Input>
            </Form.Item>
            <Form.Item label="版本描述:">
              <Input style={{ width: 470 }}></Input>
            </Form.Item>
          </Form>
        </Modal>
      </ContentCard>
    </PageContainer>
  );
}
