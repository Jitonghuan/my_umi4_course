import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { Form, Table, Button, Popconfirm, Input, Select, Space, message, Typography, Tooltip } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import { getCasePageList, caseDelete } from '../../service';
import { priorityEnum } from '../../constant';
import AddCaseDrawer from '../add-case-drawer';
import OprateCaseDrawer from '../oprate-case-modal';
import './index.less';

export default function RightDetail(props: any) {
  const {
    cateId,
    caseReadOnly,
    onAddCaseBtnClick,
    onEditCaseBtnClick,
    onSeeCaseBtnClick,
    drawerVisible,
    setDrawerVisible,
    caseCateTreeData,
    curCase,
  } = props;

  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [checkedCaseIds, setCheckedCaseIds] = useState<React.Key[]>([]);
  const [oprateCaseModalVisible, setOprateCaseModalVisible] = useState<boolean>(false);
  const [oprationType, setOprationType] = useState<string>();
  const [cateIdCache, setCateIdCache] = useState<any>(cateId);
  const [formData, setFormData] = useState<any>({});
  const [form] = Form.useForm();

  const updateDatasource = async (_pageIndex: number = pageIndex, _pageSize = pageSize, _formData = formData) => {
    const { keyword, priority } = _formData;

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
  }, [pageIndex, pageSize]);

  useEffect(() => {
    if (cateIdCache == cateId) return;
    if (pageIndex !== 1) void setPageIndex(1);
    else void updateDatasource();
  }, [cateId]);

  const onDeleteConfirm = (id: number) => {
    // const loadEnd = message.loading('正在删除');
    postRequest(caseDelete, { data: { ids: [id] } }).then((res) => {
      // void loadEnd();
      void message.success('删除成功');
      void updateDatasource();
    });
  };

  const operateRender = (record: any) => (
    <>
      <Button type="link" onClick={() => onEditCaseBtnClick(record)}>
        编辑
      </Button>
      <Popconfirm title="确定要删除此用例吗？" onConfirm={() => onDeleteConfirm(record.id)}>
        <Button type="link">删除</Button>
      </Popconfirm>
    </>
  );

  const handleSearch = (formData: any) => {
    void setFormData(formData);
    void updateDatasource(1, pageSize, formData);
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
        <Form layout="inline" onFinish={handleSearch} onReset={handleSearch} form={form}>
          <Form.Item label="用例标题:" name="keyword">
            <Input placeholder="输入标题" />
          </Form.Item>
          <Form.Item label="优先级:" name="priority">
            <Select placeholder="选择优先级" allowClear style={{ width: '106px' }}>
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
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="detail-container">
        <div className="add-btn-wrapper">
          <Space>
            <Button type="primary" ghost disabled={!checkedCaseIds.length} onClick={handleCopyCases}>
              复制
            </Button>
            <Button type="primary" ghost disabled={!checkedCaseIds.length} onClick={handleMoveCases}>
              移动
            </Button>
          </Space>
          <Button className="add-case-btn" type="primary" onClick={onAddCaseBtnClick}>
            新增用例
          </Button>
        </div>
        <Table
          rowKey="id"
          className="detail-table"
          dataSource={useMemo(() => dataSource.map((item) => ({ ...item, key: item.id })), [dataSource])}
          loading={loading}
          pagination={{
            current: pageIndex,
            total,
            pageSize,
            showSizeChanger: true,
            onChange: (next) => setPageIndex(next),
            onShowSizeChange: (_, next) => setPageSize(next),
          }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: checkedCaseIds,
            onChange: setCheckedCaseIds,
          }}
          scroll={{ x: '1000px' }}
        >
          <Table.Column width={60} title="ID" dataIndex="id"></Table.Column>
          <Table.Column
            dataIndex="categoryName"
            title="所属"
            render={(title) => (
              <Tooltip title={title}>
                <Typography.Text style={{ maxWidth: '160px' }} ellipsis={{ suffix: '' }}>
                  {title}
                </Typography.Text>
              </Tooltip>
            )}
          ></Table.Column>
          <Table.Column
            dataIndex="title"
            title="用例名称"
            render={(title, record) => (
              <Tooltip title={title}>
                <Typography.Text
                  style={{ maxWidth: '160px', color: '#033980', cursor: 'pointer' }}
                  ellipsis={{ suffix: '' }}
                  onClick={() => onSeeCaseBtnClick(record)}
                >
                  {title}
                </Typography.Text>
              </Tooltip>
            )}
          ></Table.Column>
          <Table.Column dataIndex="priority" title="优先级" width={60}></Table.Column>
          <Table.Column dataIndex="createUser" title="创建人"></Table.Column>
          <Table.Column
            dataIndex="gmtModify"
            title="更新时间"
            render={(date) => moment(date).format('YYYY-MM-DD HH:mm:ss')}
            width={166}
          ></Table.Column>
          <Table.Column title="操作" render={operateRender} width={120} fixed="right"></Table.Column>
        </Table>
      </div>
      <AddCaseDrawer
        readOnly={caseReadOnly}
        caseId={curCase?.id}
        cateId={cateId}
        visible={drawerVisible}
        setVisible={setDrawerVisible}
        onSuccess={() => updateDatasource()}
        caseCateTreeData={caseCateTreeData}
      />

      <OprateCaseDrawer
        visible={oprateCaseModalVisible}
        setVisible={setOprateCaseModalVisible}
        oprationType={oprationType as 'copy' | 'move'}
        checkedCaseIds={checkedCaseIds}
        setCheckedCaseIds={setCheckedCaseIds}
        caseCateTreeData={caseCateTreeData}
        updateDatasource={updateDatasource}
      />
    </div>
  );
}
