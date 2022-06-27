// 详情页-基本信息
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/24 17:10

import { useEffect } from 'react';
import { Button, Table, Space, Tag, Descriptions } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import moment from 'moment';
import { ContentCard } from '@/components/vc-page-content';
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

export default function deliveryDescription() {
  useEffect(() => {
    // queryProductVersionList(descriptionInfoData.id);
  }, []);

  const pageSizeClick = (pagination: any) => {
    // setPageInfo({ pageIndex: pagination.current });
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    // queryProductVersionList(descriptionInfoData.id, obj.pageIndex, obj.pageSize);
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'versionName',
      width: '30%',
    },
    {
      title: '类型',
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
          <Button
            type="primary"
            size="small"
            onClick={() => {
              history.push({
                pathname: '/matrix/station/version-detail',
              });
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
          <Descriptions.Item label="名称"></Descriptions.Item>
          <Descriptions.Item label="命名空间"></Descriptions.Item>
          <Descriptions.Item label="版本"></Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {/* {moment(descriptionInfoData.gmtCreate).format('YYYY-MM-DD HH:mm:ss')} */}
          </Descriptions.Item>
          <Descriptions.Item label="状态" span={2}></Descriptions.Item>
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
            onChange={pageSizeClick}
          ></Table>
        </div>
      </div>
    </>
  );
}
