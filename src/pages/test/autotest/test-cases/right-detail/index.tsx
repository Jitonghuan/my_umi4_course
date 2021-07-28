// test case detail
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 16:25

import React, { useState, useEffect } from 'react';
import { Button, Tag, Table, message, Empty, Spin, Form, Input, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type Emitter from 'events';
import { ContentCard } from '@/components/vc-page-content';
import { postRequest } from '@/utils/request';
import * as APIS from '../../service';
import { TreeNode, CaseItemVO } from '../../interfaces';
import { useApiDetail, useCaseList } from '../hooks';
import CaseExec from '../../components/case-exec';
import './index.less';

interface RightDetailProps extends Record<string, any> {
  emitter: Emitter;
  /** 当前选中的节点 */
  current?: TreeNode;
}

export default function RightDetail(props: RightDetailProps) {
  const [apiDetail, apiLoading] = useApiDetail(props.current?.bizId!, props.current?.level!);
  const [searchParams, setSearchParams] = useState<any>();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [caseList, caseTotal, caseLoading, reloadCase] = useCaseList(
    props.current?.bizId!,
    pageIndex,
    pageSize,
    searchParams,
    props.current?.level!,
  );
  const [execCases, setExecCases] = useState<CaseItemVO[]>([]);
  const [searchField] = Form.useForm();

  useEffect(() => {
    const listener = () => {
      setPageIndex(1);
      reloadCase(1);
    };
    props.emitter.on('CASE::RELOAD_CASE', listener);

    return () => {
      props.emitter.off('CASE::RELOAD_CASE', listener);
    };
  }, []);

  const handleDelCaseItem = async (record: CaseItemVO, index: number) => {
    await postRequest(APIS.deleteCaseById, {
      data: { id: record.id },
    });
    message.success('用例已删除');
    reloadCase();
  };

  const handleExecCaseItem = (record: CaseItemVO) => {
    setExecCases([record]);
  };

  const handleEditCaseItem = (record: CaseItemVO) => {
    props.emitter.emit('CASE::EDIT_CASE', record);
  };

  const handleDetailCaseItem = (record: CaseItemVO) => {
    props.emitter.emit('CASE::DETAIL', record);
  };

  const handleSearch = () => {
    setPageIndex(1);
    setSearchParams(searchField.getFieldsValue());
  };

  if (!props.current) {
    return (
      <ContentCard className="page-case-right-detail">
        <Empty description="请选择节点" image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: '100px' }} />
      </ContentCard>
    );
  }

  if (apiLoading) {
    return (
      <ContentCard className="page-case-right-detail">
        <Spin />
      </ContentCard>
    );
  }

  return (
    <ContentCard className="page-case-right-detail">
      <div className="case-detail-header">
        <h2>
          {['', '项目', '模块', '接口'][props.current.level || 0]}名称: {props.current.title || '--'}
        </h2>
        {apiDetail.status === 1 ? <Tag color="success">已生效</Tag> : null}
        {apiDetail.status === 0 ? <Tag color="warning">未生效</Tag> : null}
      </div>
      <div className="case-detail-caption">
        <h3>用例列表</h3>
        {/* <Button type="default">批量执行</Button> */}
        <Form layout="inline" form={searchField}>
          <Form.Item name="keyword">
            <Input.Search placeholder="输入关键字，回车搜索" onSearch={handleSearch} style={{ width: 320 }} />
          </Form.Item>
          {props.current.level === 3 ? (
            <Button
              onClick={() => props.emitter.emit('CASE::ADD_CASE', apiDetail)}
              type="primary"
              icon={<PlusOutlined />}
            >
              新增用例
            </Button>
          ) : null}
        </Form>
      </div>
      <Table
        dataSource={caseList}
        pagination={{
          pageSize,
          current: pageIndex,
          total: caseTotal,
          onChange: (next) => setPageIndex(next),
          showSizeChanger: true,
          onShowSizeChange: (_, next) => {
            setPageIndex(1);
            setPageSize(next);
          },
        }}
        loading={caseLoading}
      >
        <Table.Column
          dataIndex="id"
          title="ID"
          render={(value, record: CaseItemVO) => <a onClick={() => handleDetailCaseItem(record)}>{value}</a>}
        />
        <Table.Column dataIndex="moduleName" title="模块" />
        <Table.Column dataIndex="apiName" title="接口" />
        <Table.Column dataIndex="name" title="用例名称" />
        <Table.Column dataIndex="createUser" title="创建人" />
        <Table.Column dataIndex="gmtModify" title="修改时间" width={160} />
        <Table.Column
          width={160}
          title="操作"
          render={(_, record: CaseItemVO, index: number) => (
            <div className="action-cell">
              <a onClick={() => handleEditCaseItem(record)}>编辑</a>
              <Popconfirm title="确定要删除该用例吗？" onConfirm={() => handleDelCaseItem(record, index)}>
                <a>删除</a>
              </Popconfirm>
              <a onClick={() => handleExecCaseItem(record)}>执行</a>
            </div>
          )}
        />
      </Table>
      <CaseExec visible={!!execCases.length} caseList={execCases} onClose={() => setExecCases([])} />
    </ContentCard>
  );
}
