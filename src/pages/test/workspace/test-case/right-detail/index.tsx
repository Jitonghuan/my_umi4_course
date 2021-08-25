import React, { useState, useEffect, useMemo } from 'react';
import { Form, Table, Button, Popconfirm, Input, Select, Space, message } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import { getCasePageList, caseDelete } from '../../service';
import { priorityEnum } from '../../constant';
import AddCaseDrawer from '../add-case-drawer';
import OprateCaseDrawer from '../oprate-case-modal';
import dayjs from 'dayjs';
import './index.less';

export default function RightDetail(props: any) {
  const { cateId, onAddCaseBtnClick, onEditCaseBtnClick, drawerVisible, setDrawerVisible, caseCateTreeData } = props;

  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [checkedCaseIds, setCheckedCaseIds] = useState<React.Key[]>([]);
  const [oprateCaseModalVisible, setOprateCaseModalVisible] = useState<boolean>(false);
  const [oprationType, setOprationType] = useState<string>();
  const [form] = Form.useForm();

  const updateDatasource = async (_pageIndex: number = pageIndex, _pageSize = pageSize) => {
    const { keyword, priority } = form.getFieldsValue();

    if (!cateId && cateId !== 0) return;
    void setLoading(true);
    const res = await getRequest(getCasePageList, {
      data: { categoryId: cateId, pageIndex: _pageIndex, pageSize: _pageSize, keyword, priority },
    });
    void setLoading(false);
    const { dataSource, pageInfo } = res.data;
    const { total, pageIndex, pageSize } = pageInfo;
    void setDataSource(dataSource);
    void setPageIndex(pageIndex);
    void setPageSize(pageSize);
    void setTotal(total);
    void setCheckedCaseIds([]);
  };

  useEffect(() => {
    void updateDatasource();
  }, [pageIndex, pageSize, cateId]);

  const onDeleteConfirm = (id: number) => {
    const loadEnd = message.loading('正在删除');
    postRequest(caseDelete, { data: { ids: [id] } }).then((res) => {
      void loadEnd();
      void message.success('删除成功');
      void updateDatasource();
    });
  };

  const operateRender = (record: any) => (
    <Popconfirm title="确定要删除此用例吗？" onConfirm={() => onDeleteConfirm(record.id)}>
      <Button type="link">删除</Button>
    </Popconfirm>
  );

  const handleSearch = () => {
    void updateDatasource(1);
  };

  const handleCopyCases = () => {
    void setOprationType('copy');
    void setOprateCaseModalVisible(true);
  };

  const handleMoveCases = () => {
    void setOprationType('move');
    void setOprateCaseModalVisible(true);
  };

  return (
    <div className="test-workspace-test-case-right-detail">
      <div className="searchHeader">
        <Form layout="inline" onFinish={handleSearch} form={form}>
          <Form.Item label="用例标题:" name="keyword">
            <Input placeholder="输入标题" />
          </Form.Item>
          <Form.Item label="优先级:" name="priority">
            <Select placeholder="选择优先级" allowClear>
              {priorityEnum.map((item) => (
                <Select.Option value={item.value} key={item.value}>
                  {item.label}
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
          <Space>
            <Button type="primary" ghost onClick={handleCopyCases}>
              复制
            </Button>
            <Button type="primary" ghost onClick={handleMoveCases}>
              移动
            </Button>
          </Space>
          <Button className="add-case-btn" type="primary" onClick={onAddCaseBtnClick}>
            新增用例
          </Button>
        </div>
        <Table
          className="detail-table"
          dataSource={useMemo(() => dataSource.map((item) => ({ ...item, key: item.id })), [dataSource])}
          loading={loading}
          pagination={{
            current: pageIndex,
            total,
            pageSize,
            showSizeChanger: true,
            onChange: (next) => updateDatasource(next),
            onShowSizeChange: (_, next) => updateDatasource(1, next),
          }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: checkedCaseIds,
            onChange: setCheckedCaseIds,
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
        caseCateTreeData={caseCateTreeData}
      />

      <OprateCaseDrawer
        visible={oprateCaseModalVisible}
        setVisible={setOprateCaseModalVisible}
        oprationType={oprationType as 'copy' | 'move'}
        checkedCaseIds={checkedCaseIds}
        setCheckedCaseIds={setCheckedCaseIds}
      />
    </div>
  );
}
