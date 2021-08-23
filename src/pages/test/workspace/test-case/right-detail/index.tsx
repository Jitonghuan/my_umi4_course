import React, { useState, useEffect } from 'react';
import { Form, Table, Button, Popconfirm, Input, Select, message } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import { getCasePageList } from '../../service';
import { priorityEnum } from '../../constant';
import AddCaseDrawer from '../add-case-drawer';
import dayjs from 'dayjs';
import './index.less';

export default function RightDetail(props: any) {
  const { cateId, onAddCaseBtnClick, onEditCaseBtnClick, drawerVisible, setDrawerVisible } = props;

  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);
  const [total, setTotal] = useState<number>(0);

  const updateDatasource = async (keyword?: string, _pageIndex: number = pageIndex, _pageSize = pageSize) => {
    if (!cateId && cateId !== 0) return;
    void setLoading(true);
    const res = await getRequest(getCasePageList, {
      data: { categoryId: cateId, pageIndex: _pageIndex, pageSize: _pageSize, keyword },
    });
    void setLoading(false);
    const { dataSource, pageInfo } = res.data;
    const { total, pageIndex, pageSize } = pageInfo;
    void setDataSource(dataSource);
    void setPageIndex(pageIndex);
    void setPageSize(pageSize);
    void setTotal(total);
  };

  useEffect(() => {
    void updateDatasource();
  }, [pageIndex, pageSize, cateId]);

  const onConfirm = () => {
    console.log('delete');
  };

  const operateRender = () => (
    <Popconfirm title="确定要删除此用例吗？" onConfirm={onConfirm}>
      <Button type="link">删除</Button>
    </Popconfirm>
  );

  const handleSearch = (vals: any) => {};

  const handleReset = () => {};

  return (
    <div className="test-workspace-test-case-right-detail">
      <div className="searchHeader">
        <Form layout="inline" onFinish={handleSearch} onReset={handleReset}>
          <Form.Item label="用例标题:">
            <Input placeholder="输入标题" />
          </Form.Item>
          <Form.Item label="优先级:">
            <Select placeholder="选择优先级">
              {priorityEnum.map((item, index) => (
                <Select.Option value={index} key={index}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="reset">
              重制
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="detail-container">
        <div className="add-btn-wrapper">
          <Button className="add-case-btn" type="primary" onClick={onAddCaseBtnClick}>
            新增用例
          </Button>
        </div>
        <Table
          className="detail-table"
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
          <Table.Column width={60} title="ID" render={(_: any, __: any, index: number) => index + 1}></Table.Column>
          <Table.Column dataIndex="categoryName" title="所属"></Table.Column>
          <Table.Column dataIndex="title" title="用例名称"></Table.Column>
          <Table.Column dataIndex="priority" title="优先级"></Table.Column>
          <Table.Column dataIndex="createUser" title="创建人"></Table.Column>
          <Table.Column
            dataIndex="gmtModify"
            title="更新时间"
            render={(date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')}
          ></Table.Column>
          <Table.Column title="操作" render={operateRender}></Table.Column>
        </Table>
      </div>
      <AddCaseDrawer
        cateId={cateId}
        visible={drawerVisible}
        setVisible={setDrawerVisible}
        updateCaseTable={updateDatasource}
      />
    </div>
  );
}
