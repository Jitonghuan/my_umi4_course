// test case detail
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 16:25

import React, { useState, useEffect, useContext, useRef } from 'react';
import { Button, Tag, Table, message, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type Emitter from 'events';
import FELayout from '@cffe/vc-layout';
import { ContentCard } from '@/components/vc-page-content';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from '../service';
import { TreeNode, CaseItemVO } from '../interfaces';
import './index.less';

interface RightDetailProps extends Record<string, any> {
  emitter: Emitter;
  current?: TreeNode;
}

export default function RightDetail(props: RightDetailProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [dataSource, setDataSource] = useState<CaseItemVO[]>([]);

  useEffect(() => {}, []);

  if (!props.current) {
    return (
      <ContentCard className="page-case-right-detail">
        <Empty
          description="请选择接口"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginTop: '40%' }}
        />
      </ContentCard>
    );
  }

  return (
    <ContentCard className="page-case-right-detail">
      <div className="case-detail-header">
        <h2>接口名称: {props.current.title || '--'}</h2>
        <Tag color="success">已生效</Tag>
      </div>
      <div className="case-detail-caption">
        <h3>用例列表</h3>
        <Button type="default">批量执行</Button>
        <Button
          onClick={() => props.emitter.emit('CASE::ADD_CASE')}
          type="primary"
          icon={<PlusOutlined />}
        >
          新增用例
        </Button>
      </div>
      <Table dataSource={dataSource}>
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
