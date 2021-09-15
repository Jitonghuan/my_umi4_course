import React, { useState, useMemo, useContext, useEffect } from 'react';
import { Col, Row, Tabs, Table, Input, Select, Tag, Button, Space, Modal, Checkbox, message } from 'antd';
import { getBugList } from '../../service';
import { getRequest, postRequest } from '@/utils/request';
import moment from 'moment';

moment.locale('zh-cn');

export default function UserCaseInfoExec(props: any) {
  const {
    setAssociationBugModalVisible,
    associationBugModalVisible,
    checkedBugs,
    setCheckedBugs,
    mergeCheckedBugs2AssociationBugs,
    associationBugs,
  } = props;
  const [bugList, setBugList] = useState<any[]>();
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>();
  const [load, setLoad] = useState<boolean>(false);
  const [associationBugIds, setAssociationBugIds] = useState<React.Key[]>([]);

  const updateBugList = (_pageIndex: number, _pageSize: number, _keyword: string | undefined = keyword) => {
    void setLoad(true);
    void getRequest(getBugList, {
      data: {
        pageIndex: _pageIndex,
        pageSize: _pageSize,
        name: _keyword,
      },
    }).then((res) => {
      void setLoad(false);
      void setBugList((res.data.dataSource || []).map((item: any) => ({ ...item, key: item.id, disable: true })));
      const { pageIndex, pageSize, total } = res.data.pageInfo;
      void setPageIndex(pageIndex);
      void setPageSize(pageSize);
      void setTotal(total);
      void setKeyword(_keyword);
      void setCheckedBugs([]);
    });
  };

  useEffect(() => {
    void updateBugList(pageIndex, pageSize);
  }, [pageIndex, pageSize, associationBugModalVisible]);

  useEffect(() => {
    const ids = associationBugs.map((item: any) => item.id);
    void setAssociationBugIds(ids);
  }, [associationBugs]);

  const handleSearch = (keyword: string) => {
    void updateBugList(pageIndex, pageSize, keyword);
  };

  return (
    <Modal
      title="Bug列表"
      visible={associationBugModalVisible}
      onCancel={() => {
        void setCheckedBugs([]);
        void setAssociationBugModalVisible(false);
      }}
      onOk={() => {
        void mergeCheckedBugs2AssociationBugs();
        void setAssociationBugModalVisible(false);
      }}
      maskClosable={false}
      width={800}
      className="test-workspace-plan-info-bug-list-modal"
    >
      <Input.Search className="test-workspace-plan-info-bug-list-search" onSearch={handleSearch} />

      <Table
        rowKey="id"
        className="test-workspace-plan-info-bug-list-table"
        loading={load}
        dataSource={bugList}
        rowSelection={{
          type: 'checkbox',
          onChange: (bugIds) => {
            setCheckedBugs(bugList?.filter((bug) => bugIds.includes(bug.id)));
          },
          selectedRowKeys: checkedBugs?.map((bug: any) => bug.id) || [],
          renderCell: (checked, record, index, originNode) => {
            if (associationBugIds.includes(record.id)) {
              return <Checkbox disabled checked />;
            }
            return originNode;
          },
        }}
        pagination={{
          current: pageIndex,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          onChange: setPageIndex,
          onShowSizeChange: (_, next) => {
            void setPageSize(next);
            void setPageIndex(1);
          },
        }}
      >
        <Table.Column title="ID" dataIndex="id" width={72} />
        <Table.Column title="标题" dataIndex="name" width={442} />
        <Table.Column title="优先级" dataIndex="priority" width={88} />
        <Table.Column title="创建人" dataIndex="createUser" width={96} />
      </Table>
    </Modal>
  );
}
