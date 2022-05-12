import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import moment from 'moment';
import { Table, Tag, Space, Popconfirm } from 'antd';
import { useQueryComponentList, useDeleteComponent } from './hook';
export interface DetailProps {
  currentTab: string;
  curProductLine: string;
  dataSource: any;
  queryComponentList: (tabActiveKey: any, curProductLine?: string) => any;
  tableLoading: boolean;
}
export default function VersionDetail(props: DetailProps) {
  const { currentTab, curProductLine, dataSource, queryComponentList, tableLoading } = props;
  // const [loading, dataSource, pageInfo, setPageInfo, queryComponentList] = useQueryComponentList();
  const [delLoading, deleteComponent] = useDeleteComponent();
  useEffect(() => {
    if (!currentTab) {
      return;
    }

    queryComponentList({ componentType: currentTab });
  }, [currentTab]);

  //   const column=()=>[
  //     {
  //       title: '产品线',
  //       dataIndex: 'productLine',
  //       width: 150,
  //       isShow:false
  //     },
  //     {
  // isShow:true
  //     }
  //   ]

  const getColumns = (isShow: boolean) => {
    return [
      {
        title: '名称',
        // currentTab === 'app' ? '应用组件名称' : currentTab === 'middleware' ? '中间件组件名称' : '基础数据组件名称',
        dataIndex: 'componentName',
        key: 'componentName',
        isShow: isShow,
      },

      {
        title: '产品线',
        dataIndex: 'productLine',
        width: 150,
        isShow: true,
      },
      {
        title: '描述',
        // currentTab === 'app' ? '应用组件描述' : currentTab === 'middleware' ? '中间件组件描述' : '基础数据组件描述',

        dataIndex: 'componentDescription',
        key: 'componentDescription',
        isShow: isShow,
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
        render: (value: any) => <span>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>,
        isShow: isShow,
      },

      {
        title: '操作',
        key: 'action',
        width: 160,
        isShow: isShow,
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
                    optType: 'componentCenter',
                    // componentId: record.id,
                    // componentDescription:record.componentDescription
                  },
                });
              }}
            >
              管理
            </a>
            <Popconfirm
              title="确定要删除吗？"
              onConfirm={() => {
                deleteComponent(record.id).then(() => {
                  queryComponentList({ componentType: currentTab, productLine: curProductLine });
                });
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </Space>
        ),
      },
    ];
  };
  // const columns = [

  // ];

  return (
    <>
      <Table
        columns={
          currentTab === 'app'
            ? getColumns(true).filter((item) => {
                return item.isShow == true;
              })
            : getColumns(false).filter((item) => {
                return item.isShow == false;
              })
        }
        showHeader={true}
        dataSource={dataSource}
        loading={tableLoading}
      />
    </>
  );
}
