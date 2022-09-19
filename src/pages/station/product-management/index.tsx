//制品管理
import { useState } from 'react';
import { history } from 'umi';
import PageContainer from '@/components/page-container';
import { Button, Table, Space, Popconfirm, Spin } from 'antd';
import CreateProductModal from './create-product';
import { ContentCard } from '@/components/vc-page-content';
import { useQueryIndentList, useDeleteIndent } from './hook';
import moment from 'moment';
export default function ProductList() {
  const [tableLoading, dataSource, pageInfo, setPageInfo, queryIndentList] = useQueryIndentList();
  const [delLoading, deleteIndent] = useDeleteIndent();
  //触发分页
  const pageSizeClick = (pagination: any) => {
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    setPageInfo({ pageIndex: obj.pageIndex });
    queryIndentList(obj);
  };

  const [createProductModalVisable, setCreateProductModalVisable] = useState<boolean>(false);
  return (
    <PageContainer>
      <CreateProductModal
        visable={createProductModalVisable}
        onClose={() => {
          setCreateProductModalVisable(false);
        }}
        onSave={() => {
          queryIndentList({ pageIndex: 1, pageSize: 20 });
          setCreateProductModalVisable(false);
        }}
      />
      <ContentCard>
        <div className="table-caption">
          <div className="caption-left">
            <h3>制品列表</h3>
          </div>
          <div className="caption-right">
            <Button
              type="primary"
              onClick={() => {
                setCreateProductModalVisable(true);
              }}
            >
              + 创建制品
            </Button>
          </div>
        </div>
        <div>
          <Table
            rowKey="id"
            dataSource={dataSource}
            bordered
            loading={tableLoading}
            pagination={{
              total: pageInfo.total,
              pageSize: pageInfo.pageSize,
              current: pageInfo.pageIndex,
              showSizeChanger: true,
              onShowSizeChange: (_, size) => {
                setPageInfo({
                  pageSize: size,
                  pageIndex: 1,
                });
              },
              showTotal: () => `总共 ${pageInfo.total} 条数据`,
            }}
            onChange={pageSizeClick}
          >
            <Table.Column title="制品名称" dataIndex="indentName" width="20%" />
            <Table.Column title="建站产品" dataIndex="productName" width="12%" />
            <Table.Column title="建站版本" dataIndex="productVersion" width="12%" />
            <Table.Column title="建站项目" dataIndex="deliveryProject" width="12%" />
            <Table.Column title="制品描述" dataIndex="indentDescription" width="12%" />
            <Table.Column
              title="创建时间"
              dataIndex="gmtCreate"
              width="18%"
              render={(time: any, record: any) => <span>{moment(time).format('YYYY-MM-DD HH:mm:ss')}</span>}
            />
            <Table.Column
              title="操作"
              width="10%"
              key="action"
              render={(_, record: any, index) => (
                <Space size="small">
                  <a
                    onClick={() => {
                      history.push({
                        pathname: '/matrix/station/product-config',
                      },{
                          id: record.id,
                          indentDescription: record.indentDescription,
                      
                      });
                    }}
                  >
                    管理
                  </a>

                  <Popconfirm
                    title="确定要删除该信息吗？"
                    onConfirm={() => {
                      deleteIndent(record.id).then(() => {
                        queryIndentList({ pageIndex: 1, pageSize: 20 });
                      });
                    }}
                  >
                    <Spin spinning={delLoading}>
                      <a>删除</a>
                    </Spin>
                  </Popconfirm>
                </Space>
              )}
            />
          </Table>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
