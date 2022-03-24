//制品管理
import React, { useState } from 'react';
import { history } from 'umi';
import PageContainer from '@/components/page-container';
import { Form, Input, Select, Button, Table, Space, Popconfirm, message, Tag } from 'antd';
import CreateProductModal from './create-product';
import { ContentCard } from '@/components/vc-page-content';
export default function ProductList() {
  const dataSource = [
    {
      templateName: 'mingcheng',
      languageCode: 'miaoshu',
    },
  ];
  const [createProductModalVisable, setCreateProductModalVisable] = useState<boolean>(false);
  return (
    <PageContainer>
      <CreateProductModal visable={createProductModalVisable} />
      <ContentCard>
        <div className="table-caption">
          <div className="caption-left">
            <h3>模版列表</h3>
          </div>
          <div className="caption-right">
            <Button
              type="primary"
              onClick={() => {
                setCreateProductModalVisable(true);
              }}
            >
              创建制品
            </Button>
          </div>
        </div>
        <div>
          <Table
            rowKey="id"
            dataSource={dataSource}
            bordered
            // loading={loading}
            // pagination={{
            //   total: pageTotal,
            //   pageSize,
            //   current: pageIndex,
            //   showSizeChanger: true,
            //   onShowSizeChange: (_, size) => {
            //     setPageSize(size);
            //     setPageIndex(1);
            //   },
            //   showTotal: () => `总共 ${pageTotal} 条数据`,
            // }}
            // pagination={{ showSizeChanger: true, showTotal: () => `总共 ${pageTotal} 条数据`  }}
            // onChange={pageSizeClick}
          >
            <Table.Column title="制品名称" dataIndex="templateName" width="20%" ellipsis />
            <Table.Column title="制品描述" dataIndex="languageCode" width="8%" ellipsis />
            <Table.Column title="交付产品" dataIndex="templateType" width="8%" ellipsis />
            <Table.Column title="交付版本" dataIndex="appCategoryCode" width="8%" ellipsis />
            <Table.Column title="交付项目" dataIndex="appCategoryCode" width="8%" ellipsis />
            <Table.Column title="创建时间" dataIndex="remark" width="18%" ellipsis />
            <Table.Column
              title="操作"
              dataIndex="gmtModify"
              width="18%"
              key="action"
              render={(_, record: any, index) => (
                <Space size="small">
                  <a
                    onClick={() => {
                      history.push({
                        pathname: '/matrix/delivery/product-config',
                      });
                    }}
                  >
                    管理
                  </a>

                  <Popconfirm title="确定要删除该信息吗？" onConfirm={() => {}}>
                    <a style={{ color: 'red' }}>删除</a>
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
