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
import { Table, Tag, Space, Popconfirm } from 'antd';
import { useQueryComponentList, useDeleteComponent } from './hook';
export interface DetailProps {
  currentTab: string;
}
export default function VersionDetail(props: DetailProps) {
  const { currentTab } = props;
  const [loading, dataSource, pageInfo, setPageInfo, queryComponentList] = useQueryComponentList();
  const [delLoading, deleteComponent] = useDeleteComponent();
  useEffect(() => {
    if (!currentTab) {
      return;
    }
    queryComponentList(currentTab);
  }, [currentTab]);
  const columns = [
    {
      title: '组件名称',
      dataIndex: 'componentName',
      key: 'componentName',
    },
    {
      title: '组件描述',
      dataIndex: 'componentDescription',
      key: 'componentDescription',
    },
    {
      title: '更新时间',
      dataIndex: 'gmtModify',
      key: 'gmtModify',
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
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
                  // componentName: record.componentName,
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
  const data = [
    {
      id: 1,
      componentName: '名字',
      componentDescription: 'John B',
      updateTime: 32,
      creatTime: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      id: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      id: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];

  return (
    <>
      <Table columns={columns} showHeader={true} dataSource={dataSource} loading={loading} />
    </>
  );
}
