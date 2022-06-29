// 详情页-基本信息
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/24 17:10

import { useEffect, useState } from 'react';
import AceEditor from '@/components/ace-editor';
import { Button, Table, Space, Tag, Descriptions, Modal, Form } from 'antd';
import { history } from 'umi';
import { queryReleaseInfo } from '../../hook';
import moment from 'moment';
import './index.less';

export interface PorpsItem {
  record: any;
  curClusterName: string;
}
type releaseStatus = {
  text: string;
  type: any;
  disabled: boolean;
};

export default function deliveryDescription(props: PorpsItem) {
  const { record, curClusterName } = props;
  const [mode, setMode] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [releaseData, setReleaseData] = useState<any>([]);
  useEffect(() => {
    if (curClusterName) {
      getReleaseInfo();
    }
  }, []);
  const getReleaseInfo = () => {
    setLoading(true);
    queryReleaseInfo({ releaseName: record?.releaseName, namespace: record?.namespace, clusterName: curClusterName })
      .then((res) => {
        setReleaseData(res || []);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'releaseName',
    },
    {
      title: '类型',
      dataIndex: 'sourceType',
      width: 240,
      // render: (status: any, record: any) => (
      //   <span>
      //     <Tag color={status === 0 ? 'default' : 'success'}> {status === 0 ? '未发布' : '已发布'}</Tag>
      //   </span>
      // ),
    },

    {
      title: '操作',
      dataIndex: 'option',
      width: 140,
      render: (_: string, record: any) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setMode(true);
              // setValues(record?.values)
              form.setFieldsValue({ values: record?.values || '' });
            }}
          >
            查看yaml
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Modal
        visible={mode}
        width="60%"
        footer={null}
        onCancel={() => {
          setMode(false);
        }}
      >
        <Form form={form}>
          <Form.Item name="values">
            <AceEditor mode="yaml" height={500} readOnly />
          </Form.Item>
        </Form>
      </Modal>
      <div>
        <Descriptions
          title="基本信息"
          column={2}
          className="basic-info-description"
          bordered={true}
          extra={
            <Button
              type="primary"
              size="small"
              onClick={() => {
                history.push('/matrix/operation/helm-manage/helm-list');
              }}
            >
              返回
            </Button>
          }
        >
          <Descriptions.Item label="名称">{record?.releaseName || '--'}</Descriptions.Item>
          <Descriptions.Item label="命名空间">{record?.namespace || '--'}</Descriptions.Item>
          <Descriptions.Item label="版本">{record?.chartName || '--'}</Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {moment(record.updateTime).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="状态" span={2}>
            {record?.status || '--'}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div className="version-manage">
        <div className="table-caption">
          <div className="caption-left">
            <h3>资源</h3>
          </div>
        </div>
        <div>
          <Table
            rowKey="id"
            dataSource={releaseData || []}
            bordered
            columns={columns}
            loading={loading}
            pagination={{
              total: releaseData?.length,
              pageSize: 20,
              showSizeChanger: false,
              showTotal: () => `总共 ${releaseData?.length} 条数据`,
            }}
          ></Table>
        </div>
      </div>
    </>
  );
}
