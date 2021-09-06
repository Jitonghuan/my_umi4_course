import React, { useState, useEffect, useContext } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';
import { Input, Button, Table, Popconfirm, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getRequest, postRequest } from '@/utils/request';
import { createCaseCategory, deleteCaseCategory, updateCaseCategory, getCaseCategoryPageList } from '../service';
import FELayout from '@cffe/vc-layout';
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
  const [editCaseCategoryName, setEditCaseCategoryName] = useState('');
  const [editCaseCategoryModalVisible, setEditCaseCategoryModalVisible] = useState(false);
  const [curEditCaseCategory, setCurEditCaseCategory] = useState<any>();
  const userInfo = useContext(FELayout.SSOUserInfoContext);

  const updateDatasource = async (keyword?: string, _pageIndex: number = pageIndex, _pageSize = pageSize) => {
    void setLoading(true);
    const res = await getRequest(getCaseCategoryPageList, {
      data: { pageIndex: _pageIndex, pageSize: _pageSize, keyword },
    });
    void setLoading(false);
    const { dataSource, pageInfo } = res.data;
    const { total, pageIndex, pageSize } = pageInfo;
    void setDataSource(dataSource);
    void setPageIndex(pageIndex);
    void setPageSize(pageSize);
    void setTotal(total);
  };

  const init = async () => {
    void updateDatasource();
  };

  // 初始化
  useEffect(() => {
    void init();
  }, []);

  useEffect(() => {
    void updateDatasource();
  }, [pageIndex, pageSize]);

  const handleSearch = async () => {
    void updateDatasource(keyword, 1);
  };

  const handleAddClick = () => {
    void setAddCaseCategoryName('');
    void setAddCaseCategoryModalVisible(true);
  };

  const confirmDelItem = async (record: any, index: number) => {
    const load = message.loading('正在删除测试用例库');
    await postRequest(deleteCaseCategory + '/' + record.id, {
      data: {},
    });
    void load();
    void message.success('成功删除测试用例库！');
    void updateDatasource();
  };

  const handleEdit = (record: any, index: number) => {
    void setCurEditCaseCategory(record);
    void setEditCaseCategoryModalVisible(true);
    void setEditCaseCategoryName(record.name);
  };

  const numberRender = (_: any, __: any, index: number) => {
    return <span>{(pageIndex - 1) * pageSize + index + 1}</span>;
  };

  const nameRender = (name: string, record: any) => {
    return (
      <Button
        type="link"
        onClick={() => {
          props.history.push(`/matrix/test/workspace/test-case?testCaseId=${record.id}`);
        }}
      >
        {name}
      </Button>
    );
  };

  const addCaseCategory = async () => {
    const load = message.loading('正在添加测试用例库');
    await postRequest(createCaseCategory, {
      data: {
        name: addCaseCategoryName,
        parentId: 0,
        currentUser: userInfo.userName,
      },
    });
    void load();
    void message.success('成功添加测试用例库！');
    void setAddCaseCategoryModalVisible(false);
    void updateDatasource();
  };

  const editCaseCategory = async () => {
    const load = message.loading('正在更新测试用例库');
    await postRequest(updateCaseCategory + '/' + curEditCaseCategory.id, {
      data: {
        name: editCaseCategoryName,
        parentId: 0,
        currentUser: userInfo.userName,
      },
    });
    void load();
    void message.success('成功更新测试用例库！');
    void setEditCaseCategoryModalVisible(false);
    void updateDatasource();
  };

  return (
    <PageContainer className="test-workspace">
      <HeaderTabs activeKey="test-case-library" history={props.history} />
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
          <Table.Column title="用例库名称" dataIndex="name" render={nameRender} ellipsis />
          <Table.Column title="用例数" width={80} dataIndex="caseCount" ellipsis />
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
          onOk={addCaseCategory}
        >
          <label className="inline-item">
            <span> 用例库名称：</span>
            <Input value={addCaseCategoryName} onChange={(e) => setAddCaseCategoryName(e.target.value)} />
          </label>
        </Modal>

        {/* 别骂我 */}
        <Modal
          title="编辑用例库"
          visible={editCaseCategoryModalVisible}
          onCancel={() => setEditCaseCategoryModalVisible(false)}
          onOk={editCaseCategory}
        >
          <label className="inline-item">
            <span> 用例库名称：</span>
            <Input value={editCaseCategoryName} onChange={(e) => setEditCaseCategoryName(e.target.value)} />
          </label>
        </Modal>
      </ContentCard>
    </PageContainer>
  );
}
