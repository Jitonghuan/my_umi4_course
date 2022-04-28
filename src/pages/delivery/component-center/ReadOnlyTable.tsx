/*
 * @Author: your name
 * @Date: 2022-03-07 01:01:37
 * @LastEditTime: 2022-03-07 14:11:26
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fe-matrix/src/pages/delivery/version-detail/index.tsx
 */
import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import moment from 'moment';
import { Table, Tag, Space, Popconfirm } from 'antd';
import { useQueryComponentList, useDeleteComponent } from './hook';
export interface DetailProps {
  currentTab: string;
  dataSource: any;
  queryComponentList: (tabActiveKey: any) => any;
  tableLoading: boolean;
}
export default function VersionDetail(props: DetailProps) {
  const { currentTab, dataSource, queryComponentList, tableLoading } = props;
  // const [loading, dataSource, pageInfo, setPageInfo, queryComponentList] = useQueryComponentList();
  const [delLoading, deleteComponent] = useDeleteComponent();
  useEffect(() => {
    if (!currentTab) {
      return;
    }
    queryComponentList(currentTab);
  }, [currentTab]);
  const columns = [
    {
      title:
        currentTab === 'app' ? '应用组件名称' : currentTab === 'middleware' ? '中间件组件名称' : '基础数据组件名称',
      dataIndex: 'componentName',
      key: 'componentName',
    },
    {
      title:
        currentTab === 'app' ? '应用组件描述' : currentTab === 'middleware' ? '中间件组件描述' : '基础数据组件描述',

      dataIndex: 'componentDescription',
      key: 'componentDescription',
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      render: (value: any) => <span>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },

    {
      title: '操作',
      key: 'action',
      render: (text: string, record: any) => (
        <Space size="middle">
          <a
            onClick={() => {
              history.push({
                pathname: '/matrix/delivery/component-detail',
                state: {
                  initRecord: record,
                  type: 'componentCenter',
                  componentName: record.componentName,
                  componentVersion: record.componentVersion,
                  componentType: currentTab,
                  // componentId: record.id,
                  // componentDescription:record.componentDescription
                },
              });
            }}
          >
            详情
          </a>
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => {
              deleteComponent(record.id).then(() => {
                queryComponentList(currentTab);
              });
            }}
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} showHeader={true} dataSource={dataSource} loading={tableLoading} />
    </>
  );
}
