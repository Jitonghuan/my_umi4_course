import { useEffect } from 'react';
import { history } from 'umi';
import moment from 'moment';
import { Table, Space, Popconfirm } from 'antd';
import { useDeleteComponent } from './hook';
export interface DetailProps {
  currentTab: string;
  curProductLine: string;
  dataSource: any;
  identification: string;
  onDelClick: any;
  queryComponentList: (tabActiveKey: any, curProductLine?: string, pageIndex?: number, pageSize?: number) => any;
  tableLoading: boolean;
  pageInfo: any;
  setPageInfo: (pageIndex: number, pageSize?: number) => any;
}
export default function VersionDetail(props: DetailProps) {
  const {
    currentTab,
    curProductLine,
    dataSource,
    identification,
    onDelClick,
    tableLoading,
    pageInfo,
    setPageInfo,
    queryComponentList,
  } = props;
  const [delLoading, deleteComponent] = useDeleteComponent();
  useEffect(() => {
    if (!currentTab) {
      return;
    }
  }, [currentTab]);

  const getColumns = (isShow: boolean) => {
    return [
      {
        title: '名称',
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
                  pathname: '/matrix/station/component-detail',
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
                  onDelClick();
                });
              }}
            >
              <a style={{ color: 'rgb(255, 48, 3)' }}>删除</a>
            </Popconfirm>
          </Space>
        ),
      },
    ];
  };

  //触发分页
  const pageSizeClick = (pagination: any) => {
    setPageInfo(pagination.current);
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    queryComponentList({
      componentType: currentTab,
      productLine: curProductLine,
      pageIndex: obj.pageIndex,
      pageSize: obj.pageSize,
    });
  };

  return (
    <>
      <Table
        bordered
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
        pagination={{
          total: pageInfo.total,
          pageSize: pageInfo.pageSize,
          current: pageInfo.pageIndex,
          showSizeChanger: true,
          onShowSizeChange: (_, size) => {
            setPageInfo(1, size);
          },
          showTotal: () => `总共 ${pageInfo.total} 条数据`,
        }}
        // pagination={{ showSizeChanger: true, showTotal: () => `总共 ${pageTotal} 条数据`  }}
        onChange={pageSizeClick}
      />
    </>
  );
}