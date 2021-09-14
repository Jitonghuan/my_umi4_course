// 函数管理
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React, { useState, useEffect, useCallback } from 'react';
import { Input, Table, Button, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ContentCard } from '@/components/vc-page-content';
import * as APIS from './service';
import { getRequest, postRequest } from '@/utils/request';
import { datetimeCellRender } from '@/utils';
import FuncEditor from './func-editor';

export default function FunctionManager() {
  const [keyword, setKeyword] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);
  const [total, setTotal] = useState<number>(0);

  const [editorMode, setEditorMode] = useState<EditorMode>('HIDE');
  const [editData, setEditData] = useState<Record<string, any>>();

  const handleSearch = () => {
    pageIndex === 1 ? queryData() : setPageIndex(1);
  };

  const queryData = async () => {
    setLoading(true);

    try {
      const result = await getRequest(APIS.funcList, {
        data: { keyword, pageIndex, pageSize },
      });

      const { dataSource, pageInfo } = result.data || {};

      setDataSource(dataSource || []);
      setTotal(pageInfo?.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queryData();
  }, [pageIndex, pageSize]);

  const handleModify = (record: Record<string, any>) => {
    setEditData(record);
    setEditorMode('EDIT');
  };

  const confirmDelItem = useCallback(
    async (record: Record<string, any>, index: number) => {
      await postRequest(APIS.delFunc, {
        data: { id: record.id },
      });
      message.success('删除成功！');
      queryData();
    },
    [dataSource],
  );

  return (
    <ContentCard className="page-test-functions">
      <div className="table-caption">
        <Input.Search
          placeholder="输入关键字搜索"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={() => handleSearch()}
          onSearch={() => handleSearch()}
          style={{ width: 320 }}
        />
        <Button type="primary" onClick={() => setEditorMode('ADD')}>
          <PlusOutlined /> 新增函数
        </Button>
      </div>
      <Table
        rowKey="id"
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
        <Table.Column title="序号" dataIndex="id" width={60} />
        <Table.Column title="函数名" dataIndex="name" ellipsis />
        <Table.Column title="描述" dataIndex="desc" ellipsis />
        <Table.Column title="创建人" dataIndex="createUser" width={140} />
        <Table.Column title="操作时间" dataIndex="gmtModify" width={180} render={datetimeCellRender} />
        <Table.Column
          title="操作"
          width={120}
          render={(_, record: Record<string, any>, index) => (
            <div className="action-cell">
              <a onClick={(e) => handleModify(record)}>修改</a>
              <Popconfirm title="确定要删除该函数吗？" onConfirm={() => confirmDelItem(record, index)}>
                <a>删除</a>
              </Popconfirm>
            </div>
          )}
        />
      </Table>

      <FuncEditor
        mode={editorMode}
        initData={editData}
        onClose={() => setEditorMode('HIDE')}
        onSave={() => {
          queryData();
          setEditorMode('HIDE');
        }}
      />
    </ContentCard>
  );
}
