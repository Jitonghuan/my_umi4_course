import React, { useState } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import MatrixPageContent from '@/components/matrix-page-content';
import HeaderTabs from './_components/header-tabs';
import { Input, Button, Table, Popconfirm, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { number } from 'yargs';
import './index.less';

export default function Workspace(props: any) {
  const [keyword, setKeyword] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [addCaseCategoryName, setAddCaseCategoryName] = useState('');
  const [addCaseCategoryModalVisible, setAddCaseCategoryModalVisible] = useState(false);

  const handleSearch = () => {};

  const handleAddClick = () => {
    setAddCaseCategoryModalVisible(true);
  };

  const handleModify = () => {};

  const confirmDelItem = (record: any, index: number) => {};

  const handleEdit = (record: any, index: number) => {};

  const numberRender = (_: any, index: number) => index;

  return (
    <MatrixPageContent className="test-workspace">
      <HeaderTabs activeKey="test-case" history={props.history} />
      <ContentCard>
        <div className="test-page-header">
          <Input.Search
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={() => handleSearch()}
            onSearch={() => handleSearch()}
            style={{ width: 320 }}
          />
          <Button type="primary" onClick={handleAddClick}>
            <PlusOutlined /> 新增用例库
          </Button>
        </div>
        <Table
          dataSource={dataSource}
          loading={loading}
          pagination={{
            current: pageIndex,
            total,
            pageSize,
            showSizeChanger: true,
            onChange: (next) => setPageIndex(next),
            onShowSizeChange: (_, next) => setPageSize(next),
          }}
        >
          <Table.Column title="序号" width={60} render={numberRender} />
          <Table.Column title="用例库名称" dataIndex="name" ellipsis />
          <Table.Column title="用例数" dataIndex="desc" ellipsis />
          <Table.Column
            title="操作"
            width={120}
            render={(_, record: Record<string, any>, index) => (
              <div className="action-cell">
                <a onClick={(e) => handleEdit(record, index)}>编辑</a>
                <Popconfirm title="确定要删除该用例库吗？" onConfirm={() => confirmDelItem(record, index)}>
                  <a>删除</a>
                </Popconfirm>
              </div>
            )}
          />
        </Table>

        <Modal
          title="新增用例库"
          visible={addCaseCategoryModalVisible}
          onCancel={() => setAddCaseCategoryModalVisible(false)}
        >
          <label className="inline-item">
            <span> 用例库名称：</span>
            <Input value={addCaseCategoryName} onChange={(e) => setAddCaseCategoryName(e.target.value)} />
          </label>
        </Modal>
      </ContentCard>
    </MatrixPageContent>
  );
}
