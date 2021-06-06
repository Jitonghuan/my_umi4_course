// test case detail
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 16:25

import React, { useState, useEffect, useContext, useRef } from 'react';
import { Button, Tag, Table, message, Empty, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type Emitter from 'events';
import FELayout from '@cffe/vc-layout';
import { ContentCard } from '@/components/vc-page-content';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from '../service';
import { TreeNode, CaseItemVO } from '../interfaces';
import { useApiDetail, useCaseList } from '../hooks';
import './index.less';

interface RightDetailProps extends Record<string, any> {
  emitter: Emitter;
  /** 当前选中的接口 */
  current?: TreeNode;
}

export default function RightDetail(props: RightDetailProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [apiDetail, apiLoading] = useApiDetail(props.current?.key as number);
  const [pageIndex, setPageIndex] = useState(1);
  const [caseList, caseTotal, caseLoading, reloadCase] = useCaseList(
    props.current?.key as number,
    pageIndex,
  );

  useEffect(() => {
    props.emitter.on('CASE::RELOAD_CASE', () => {
      setPageIndex(1);
      reloadCase(1);
    });
  }, []);

  if (!props.current) {
    return (
      <ContentCard className="page-case-right-detail">
        <Empty
          description="请选择接口"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginTop: '100px' }}
        />
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
        <h2>接口名称: {props.current.title || '--'}</h2>
        {apiDetail.status === 1 ? <Tag color="success">已生效</Tag> : null}
        {apiDetail.status === 0 ? <Tag color="warning">未生效</Tag> : null}
      </div>
      <div className="case-detail-caption">
        <h3>用例列表</h3>
        {/* <Button type="default">批量执行</Button> */}
        <Button
          onClick={() => props.emitter.emit('CASE::ADD_CASE')}
          type="primary"
          icon={<PlusOutlined />}
        >
          新增用例
        </Button>
      </div>
      <Table
        dataSource={caseList}
        pagination={{ pageSize: 20, current: pageIndex, total: caseTotal }}
      >
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column dataIndex="module" title="模块" />
        <Table.Column dataIndex="api" title="接口" />
        <Table.Column dataIndex="name" title="用例名称" />
        <Table.Column dataIndex="creator" title="创建人" />
        <Table.Column dataIndex="gmtModify" title="修改时间" />
        <Table.Column
          title="操作"
          render={(_, record: CaseItemVO, index: number) => (
            <div className="action-cell">
              <a>编辑</a>
              <a>删除</a>
              <a>执行</a>
            </div>
          )}
        />
      </Table>
    </ContentCard>
  );
}
