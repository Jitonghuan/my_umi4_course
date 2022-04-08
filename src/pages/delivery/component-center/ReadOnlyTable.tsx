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
import { Table, Tag, Space } from 'antd';
import { useQueryComponentList } from './hook';
export interface DetailProps {
  currentTab: string;
}
export default function VersionDetail(props: DetailProps) {
  const { currentTab } = props;
  const [loading, dataSource, pageInfo, setPageInfo, queryComponentList] = useQueryComponentList();
  useEffect(() => {
    if (!currentTab) {
      return;
    }
    queryComponentList(currentTab);
  }, []);
  const columns = [
    {
      title: '组件名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '组件描述',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '更新时间',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '创建时间',
      dataIndex: 'address',
      key: 'address',
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
              });
            }}
          >
            详情
          </a>
          <a>删除</a>
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John B',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
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
