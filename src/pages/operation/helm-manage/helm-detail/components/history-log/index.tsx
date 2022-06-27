// 详情页-基本信息
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/24 17:10

import { useEffect } from 'react';
import { Button, Table, Space, Tag, Modal } from 'antd';
import PageContainer from '@/components/page-container';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { history } from 'umi';
import AceEditor from '@/components/ace-editor';
import { ContentCard } from '@/components/vc-page-content';

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

export default function deliveryDescription() {
  useEffect(() => {
    // queryProductVersionList(descriptionInfoData.id);
  }, []);
  const confirm = () => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'xxx应用回滚到版本【1】，请确认！ ',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {},
    });
  };
  const columns = [
    {
      title: '发布名称',
      dataIndex: 'versionName',
      width: '30%',
    },
    {
      title: '命名空间',
      dataIndex: 'releaseStatus',
      width: '10%',
      render: (status: any, record: Item) => (
        <span>
          <Tag color={status === 0 ? 'default' : 'success'}> {status === 0 ? '未发布' : '已发布'}</Tag>
        </span>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'releaseStatus',
      width: '10%',
      render: (status: any, record: Item) => (
        <span>
          <Tag color={status === 0 ? 'default' : 'success'}> {status === 0 ? '未发布' : '已发布'}</Tag>
        </span>
      ),
    },
    {
      title: ' 版本',
      dataIndex: 'releaseStatus',
      width: '10%',
      render: (status: any, record: Item) => (
        <span>
          <Tag color={status === 0 ? 'default' : 'success'}> {status === 0 ? '未发布' : '已发布'}</Tag>
        </span>
      ),
    },

    {
      title: '操作',
      dataIndex: 'option',
      width: 240,
      render: (_: string, record: Item) => (
        <Space>
          <a
            onClick={() => {
              history.push({
                pathname: '/matrix/station/version-detail',
              });
            }}
          >
            详情
          </a>
          <a onClick={confirm}>回滚</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        rowKey="id"
        //   dataSource={dataSource}
        bordered
        columns={columns}
        //   loading={tableLoading}
        //   pagination={{
        //     total: pageInfo.total,
        //     pageSize: pageInfo.pageSize,
        //     current: pageInfo.pageIndex,
        //     showSizeChanger: true,
        //     onShowSizeChange: (_, size) => {
        //       setPageInfo({
        //         pageIndex: 1,
        //         pageSize: size,
        //       });
        //     },
        //     showTotal: () => `总共 ${pageInfo.total} 条数据`,
        //   }}
        // pagination={{ showSizeChanger: true, showTotal: () => `总共 ${pageTotal} 条数据`  }}
        //   onChange={pageSizeClick}
      ></Table>
    </div>
  );
}
