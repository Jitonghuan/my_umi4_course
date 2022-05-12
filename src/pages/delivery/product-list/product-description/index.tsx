// 产品描述页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/02/21 17:10

import { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Table,
  Space,
  Popconfirm,
  Typography,
  Tag,
  Modal,
  Descriptions,
  Tooltip,
} from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import moment from 'moment';
import { ContentCard } from '@/components/vc-page-content';
import {
  useEditProductDescription,
  useCreateProductVersion,
  useDeleteProductVersion,
  useQueryProductList,
  usePublishProductVersion,
} from './hooks';
import './index.less';

export interface Item {
  id: number;
  versionName: string;
  versionDescription: string;
  releaseTime: number;
  gmtCreate: any;
  releaseStatus: number;
}
type releaseStatus = {
  text: string;
  type: any;
  disabled: boolean;
};
export const STATUS_TYPE: Record<number, releaseStatus> = {
  0: { text: '发布', type: 'primary', disabled: false },
  1: { text: '已发布', type: 'default', disabled: true },
};

export default function deliveryDescription() {
  const { Paragraph } = Typography;
  const [createVersionForm] = Form.useForm();
  const { Option } = Select;
  const descriptionInfoData: any = history.location.state;
  const [editableStr, setEditableStr] = useState(descriptionInfoData.productDescription);
  const [editLoading, editProductDescription] = useEditProductDescription();
  const [creatLoading, createProductVersion] = useCreateProductVersion();
  const [delLoading, deleteProductVersion] = useDeleteProductVersion();
  const [publishLoading, publishProductVersion] = usePublishProductVersion();
  const [tableLoading, dataSource, pageInfo, setPageInfo, queryProductVersionList] = useQueryProductList();
  const [creatVersionVisiable, setCreatVersionVisiable] = useState<boolean>(false);

  useEffect(() => {
    if (!descriptionInfoData.id) {
      return;
    }
    queryProductVersionList(descriptionInfoData.id);
  }, []);

  const pageSizeClick = (pagination: any) => {
    setPageInfo({ pageIndex: pagination.current });
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    queryProductVersionList(descriptionInfoData.id, obj.pageIndex, obj.pageSize);
  };

  const columns = [
    {
      title: '版本',
      dataIndex: 'versionName',
      width: '30%',
    },
    {
      title: '发布状态',
      dataIndex: 'releaseStatus',
      width: '10%',
      render: (status: any, record: Item) => (
        <span>
          <Tag color={status === 0 ? 'default' : 'success'}> {status === 0 ? '未发布' : '已发布'}</Tag>
        </span>
      ),
    },
    {
      title: '版本描述',
      dataIndex: 'versionDescription',
      width: '20%',
      render: (value: string) => (
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'gmtCreate',
      width: '30%',
      render: (value: any, record: Item) => <span>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: 240,
      render: (_: string, record: Item) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              history.push({
                pathname: '/matrix/delivery/version-detail',
                state: {
                  productId: descriptionInfoData.id,
                  versionId: record.id,
                  versionName: record.versionName,
                  versionDescription: record.versionDescription,
                  versionGmtCreate: record.gmtCreate,
                  productName: descriptionInfoData.productName,
                  productDescription: descriptionInfoData.productDescription,
                  productGmtCreate: descriptionInfoData.gmtCreate,
                  releaseStatus: record.releaseStatus,
                },
              });
            }}
          >
            管理
          </Button>
          <Popconfirm
            disabled={STATUS_TYPE[record.releaseStatus].disabled}
            title="发布后编排不可修改，是否确认发布？"
            onConfirm={() => {
              publishProductVersion(record.id).then(() => {
                queryProductVersionList(descriptionInfoData.id);
              });
            }}
            // onCancel={cancel}
            okText="确认"
            cancelText="取消"
          >
            <Button
              size="small"
              type={STATUS_TYPE[record.releaseStatus].type || 'default'}
              disabled={STATUS_TYPE[record.releaseStatus].disabled}
              loading={publishLoading}
            >
              {STATUS_TYPE[record.releaseStatus].text}
            </Button>
          </Popconfirm>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => {
              deleteProductVersion(record.id).then(() => {
                queryProductVersionList(descriptionInfoData.id);
              });
            }}
            // onCancel={cancel}
            okText="是"
            cancelText="否"
          >
            <Button danger size="small" loading={delLoading}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const handleSubmit = () => {
    let params = createVersionForm.getFieldsValue();
    createProductVersion(descriptionInfoData.id, params.version_name, params.version_description).then(() => {
      setCreatVersionVisiable(false);
      queryProductVersionList(descriptionInfoData.id);
    });
  };
  return (
    <PageContainer className="product-description">
      <ContentCard>
        <div>
          <Descriptions title="基本信息" column={2} className="basic-info-description" bordered={true}>
            <Descriptions.Item label="产品名称">{descriptionInfoData.productName}</Descriptions.Item>
            <Descriptions.Item label="产品描述">
              <Paragraph
                editable={{
                  onChange: (productDescription: string) => {
                    editProductDescription(descriptionInfoData.id, productDescription).then(() => {
                      setEditableStr(productDescription);
                    });
                  },
                }}
              >
                {editableStr}
              </Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>
              {moment(descriptionInfoData.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div className="version-manage">
          <div className="table-caption">
            <div className="caption-left">
              <h3>版本管理</h3>
            </div>
            <div className="caption-right">
              <Button
                type="primary"
                onClick={() => {
                  setCreatVersionVisiable(true);
                  createVersionForm.resetFields();
                }}
              >
                创建版本
              </Button>
            </div>
          </div>
          <div>
            <Table
              rowKey="id"
              dataSource={dataSource}
              bordered
              columns={columns}
              loading={tableLoading}
              pagination={{
                total: pageInfo.total,
                pageSize: pageInfo.pageSize,
                current: pageInfo.pageIndex,
                showSizeChanger: true,
                onShowSizeChange: (_, size) => {
                  setPageInfo({
                    pageIndex: 1,
                    pageSize: size,
                  });
                },
                showTotal: () => `总共 ${pageInfo.total} 条数据`,
              }}
              // pagination={{ showSizeChanger: true, showTotal: () => `总共 ${pageTotal} 条数据`  }}
              onChange={pageSizeClick}
            ></Table>
          </div>
        </div>

        <Modal
          title="创建版本"
          visible={creatVersionVisiable}
          onCancel={() => {
            setCreatVersionVisiable(false);
          }}
          footer={
            <div className="drawer-footer">
              <Button type="primary" loading={creatLoading} onClick={handleSubmit}>
                确定
              </Button>
              <Button
                type="default"
                onClick={() => {
                  setCreatVersionVisiable(false);
                }}
              >
                取消
              </Button>
            </div>
          }
        >
          <Form layout="vertical" form={createVersionForm} style={{ paddingLeft: 30 }}>
            <Form.Item label="版本名称:" name="version_name" rules={[{ required: true, message: '请输入版本号' }]}>
              <Input style={{ width: 400 }} placeholder="请输入版本号"></Input>
            </Form.Item>
            <Form.Item label="版本描述:" name="version_description">
              <Input style={{ width: 400 }} placeholder="请输入版本描述"></Input>
            </Form.Item>
          </Form>
        </Modal>
      </ContentCard>
    </PageContainer>
  );
}
