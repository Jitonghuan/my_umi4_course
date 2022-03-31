// 分支管理
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/27 12:41

import React, { useState, useContext, useEffect, useCallback } from 'react';
import moment from 'moment';
import { Button, message, Form, Input, Table, Popconfirm, Tooltip, Divider } from 'antd';
import { PlusOutlined, CopyOutlined } from '@ant-design/icons';
import { ContentCard } from '@/components/vc-page-content';
import { usePaginated } from '@cffe/vc-hulk-table';
import { datetimeCellRender } from '@/utils';
import BranchEditor from './branch-editor';
import DetailContext from '../../context';
import { queryBranchListUrl, queryMasterBranchListUrl, deleteBranch } from '@/pages/application/service';
import { createReview } from '@/pages/application/service';
import { postRequest, getRequest } from '@/utils/request';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './index.less';
import { values } from 'lodash';

export default function BranchManage() {
  const { appData } = useContext(DetailContext);
  const { appCode } = appData || {};
  const [searchForm] = Form.useForm();
  const [masterTableData, setMasterTableData] = useState([]); //主干分支表格数据源
  const [tableData, setTableData] = useState([]); //子分支表格数据
  const [masterPage, setMasterPage] = useState<any>({ total: 0, size: 20, pageIndex: 1, currentPage: 1 }); //主干分页信息
  const [page, setPage] = useState<any>({ total: 0, size: 20, pageIndex: 1, currentPage: 1 });
  const [branchEditMode, setBranchEditMode] = useState<EditorMode>('HIDE');
  const [pending, setPending] = useState(false);
  const [reviewId, setReviewId] = useState<string>('');
  // 查询主分支数据
  const { run: queryMasterBranchList, tableProps: tableProps1 } = usePaginated({
    requestUrl: queryBranchListUrl,
    requestMethod: 'GET',
    showRequestError: true,
    pagination: {
      showSizeChanger: true,
      showTotal: (total: any) => `总共 ${total} 条数据`,
    },
  });
  // 查询子分支数据
  const { run: queryBranchList, tableProps } = usePaginated({
    requestUrl: queryBranchListUrl,
    requestMethod: 'GET',
    showRequestError: true,
    pagination: {
      showSizeChanger: true,
      showTotal: (total: any) => `总共 ${total} 条数据`,
    },
  });

  useEffect(() => {
    if (!appCode) return;
    queryBranchList({ appCode, env: 'feature' });
  }, [appCode]);

  // 搜索
  const handleSearch = useCallback(() => {
    const values = searchForm.getFieldsValue();
    queryBranchList({
      pageIndex: 1,
      ...values,
    });
  }, [searchForm]);

  // 获取主干分支列表
  const queryMaterBranch = () => {
    getRequest(queryMasterBranchListUrl, { data: { appCode } }).then((res) => {
      if (res.success) {
        let data = res?.data.dataSource[0];
        setMasterTableData(data);
      }
    });
  };
  // 获取子分支
  const queryBranch = () => {
    getRequest(queryBranchListUrl, { data: { appCode } }).then((res) => {
      if (res.success) {
        let data = res?.data.dataSource[0];
        setTableData(data);
      }
    });
  };

  // 删除分支
  const handleDelBranch = useCallback(async (record: any) => {
    try {
      setPending(true);
      await deleteBranch({ id: record.id });
      message.success('操作成功！');
      queryBranchList();
    } finally {
      setPending(false);
    }
  }, []);
  //创建Review
  const creatReviewUrl = async (record: any) => {
    await postRequest(createReview, { data: { appCode: record.appCode, branch: record.branchName } }).then((reslut) => {
      if (reslut.success) {
        message.success('创建Review成功！');
        queryBranchList();
      } else {
        message.error(reslut.errorMsg);
        queryBranchList();
      }
    });
  };

  const reviewUrl = (reviewId: string, record: any) => {
    return (
      <a href={'http://upsource.cfuture.shop/' + appCode + '/review/' + reviewId} target="_blank">
        {reviewId}
      </a>
    );
  };
  // 点击主干分支列表分页
  const masterPageSizeClick = (pagination: any) => {
    setMasterPage((value: any) => ({ ...value, currentPage: pagination.current }));
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    // loadMasterList(obj);
  };

  const pageClick = () => {};

  const columns: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'name',
      width: 80,
    },
    {
      title: '分支名',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 400,
    },
    {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
      render: (value: any) => (
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'reviewID',
      dataIndex: 'reviewId',
      key: 'reviewId',
      width: 100,
    },
    {
      title: '主干分支',
      dataIndex: 'masterBranch',
      key: 'masterBranch',
      width: 100,
    },
    {
      title: '关联流水线',
      dataIndex: 'relationPipeline',
      key: 'relationPipeline',
      width: 100,
    },
    {
      title: '已部署环境',
      dataIndex: 'deployedEnv',
      key: 'deployedEnv',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      width: 160,
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      key: 'createUser',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'desc',
      key: 'desc',
      fixed: 'right',
      width: 200,
      render: (_: any, record: any) => (
        <div className="action-cell">
          <Button type="primary" size="small" onClick={() => creatReviewUrl(record)}>
            创建Review
          </Button>
          <Popconfirm title="确定要作废该项吗？" onConfirm={() => handleDelBranch(record)}>
            <Button type="primary" danger size="small">
              作废
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  return (
    <ContentCard className="branch-manage-page" style={{ height: '100%' }}>
      <div className="branch-section">
        <div className={`branch-section_title`}>主干分支</div>
        <div className="table-caption">
          <Form layout="inline" form={searchForm}>
            <Form.Item label="分支名" name="branchName">
              <Input.Search placeholder="搜索主干分支名" enterButton onSearch={handleSearch} style={{ width: 320 }} />
            </Form.Item>
          </Form>
          <Button type="primary" onClick={() => setBranchEditMode('ADD')}>
            <PlusOutlined />
            新建主干分支
          </Button>
        </div>
        <Table
          rowKey="id"
          bordered
          dataSource={tableProps.dataSource}
          columns={columns}
          // pagination={tableProps.pagination}
          pagination={{
            total: masterPage.total,
            pageSize: masterPage.pageSize,
            current: masterPage.pageCurrent,
            // showSizeChanger: true,
            // onShowSizeChange: (_, size) => {
            //   setPageSize(size);
            //   setPageIndex(1);
            // },
            showTotal: () => `总共 ${masterPage.total} 条数据`,
          }}
          onChange={masterPageSizeClick}
          loading={tableProps.loading || pending}
          scroll={{ y: window.innerHeight - 330, x: '100%' }}
        ></Table>
      </div>

      <Divider />

      <div className="branch-section">
        <div className={`branch-section_title`}>子分支</div>
        <div className="table-caption">
          <Form layout="inline" form={searchForm}>
            <Form.Item label="分支名" name="branchName">
              <Input.Search placeholder="搜索分支名" enterButton onSearch={handleSearch} style={{ width: 320 }} />
            </Form.Item>
          </Form>
          <Button type="primary" onClick={() => setBranchEditMode('ADD')}>
            <PlusOutlined />
            新建分支
          </Button>
        </div>
        <Table
          rowKey="id"
          bordered
          dataSource={tableProps.dataSource}
          columns={columns}
          // pagination={tableProps.pagination}
          loading={tableProps.loading || pending}
          pagination={{
            total: page.total,
            pageSize: page.pageSize,
            current: page.pageCurrent,
            // showSizeChanger: true,
            // onShowSizeChange: (_, size) => {
            //   setPageSize(size);
            //   setPageIndex(1);
            // },
            showTotal: () => `总共 ${page.total} 条数据`,
          }}
          onChange={pageClick}
          scroll={{ y: window.innerHeight - 330, x: '100%' }}
        ></Table>
      </div>

      <BranchEditor
        appCode={appCode!}
        mode={branchEditMode}
        onSubmit={() => {
          setBranchEditMode('HIDE');
          queryBranchList({
            pageIndex: 1,
          });
        }}
        onClose={() => setBranchEditMode('HIDE')}
      />
    </ContentCard>
  );
}
