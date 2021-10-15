// 分支管理
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/27 12:41

import React, { useState, useContext, useEffect, useCallback } from 'react';
import moment from 'moment';
import { Button, message, Form, Input, Table, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ContentCard } from '@/components/vc-page-content';
import { usePaginated } from '@cffe/vc-hulk-table';
import { datetimeCellRender } from '@/utils';
import BranchEditor from './branch-editor';
import DetailContext from '../../context';
import { queryBranchListUrl, deleteBranch } from '@/pages/application/service';
import { createReview } from '@/pages/application/service';
import { postRequest } from '@/utils/request';

export default function BranchManage() {
  const { appData } = useContext(DetailContext);
  const { appCode } = appData || {};
  const [searchForm] = Form.useForm();
  const [branchEditMode, setBranchEditMode] = useState<EditorMode>('HIDE');
  const [pending, setPending] = useState(false);
  const [reviewId, setReviewId] = useState<string>('');

  // 查询数据
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
      }
    });
  };

  const reviewUrl = (reviewId: string, record: any) => {
    return (
      <a href={'http://upsource.cfuture.shop/workflow-runtime/review/' + reviewId} target="_blank">
        {reviewId}
      </a>
    );
  };
  return (
    <ContentCard>
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
        dataSource={tableProps.dataSource}
        pagination={tableProps.pagination}
        loading={tableProps.loading || pending}
        scroll={{ y: window.innerHeight - 330 }}
      >
        <Table.Column title="ID" dataIndex="id" width={80} />
        <Table.Column title="应用code" dataIndex="appCode" width={100} />
        <Table.Column title="分支名" dataIndex="branchName" width={400} />
        <Table.Column title="描述" dataIndex="desc" width={200} />
        <Table.Column title="reviewID" dataIndex="reviewId" width={200} render={reviewUrl} />
        <Table.Column title="创建时间" dataIndex="gmtCreate" width={160} render={datetimeCellRender} />
        <Table.Column title="已部署环境" dataIndex="deployedEnv" width={120} />
        <Table.Column title="创建人" dataIndex="createUser" width={100} />
        <Table.Column
          title="操作"
          width={200}
          render={(_, record: any, index) => (
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
          )}
        />
      </Table>

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
