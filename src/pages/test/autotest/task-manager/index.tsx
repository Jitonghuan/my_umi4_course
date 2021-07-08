// 上下布局页面
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React, { useState, useEffect, useCallback } from 'react';
import { Input, Button, Table, Tag } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import HeaderTabs from '../components/header-tabs';
import * as APIS from '../service';
import { TaskItemVO } from '../interfaces';
import { useTaskList } from './hooks';
import './index.less';

export default function TaskManager(props: any) {
  const [searchValue, setSearchValue] = useState('');
  const [keyword, setKeyword] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableSource, total, loading, reloadData] = useTaskList(keyword, pageIndex, pageSize);

  const handleSearch = () => {
    setKeyword(searchValue);
    // 如果什么参数都没变且是第 1 页，则手动刷新，否则将页数置为 1 触发刷新
    searchValue === keyword && pageIndex === 1 ? reloadData() : setPageIndex(1);
  };

  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="tasks" history={props.history} />
      <ContentCard className="page-task-manager">
        <div className="header-caption">
          <Input.Search
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            enterButton
            style={{ width: 320 }}
            placeholder="输入关键词搜索"
          />
          <s className="flex-air"></s>
          <Button type="primary">+ 新增任务</Button>
        </div>
        <Table
          dataSource={tableSource}
          loading={loading}
          pagination={{
            pageSize,
            total,
            current: pageIndex,
            onChange: (next) => setPageIndex(next),
            showSizeChanger: true,
            onShowSizeChange: (_, size) => {
              setPageSize(size);
              setPageIndex(1);
            },
          }}
        >
          <Table.Column title="任务编号" dataIndex="id" width={80} />
          <Table.Column title="任务名称" dataIndex="name" />
          <Table.Column title="用例数" dataIndex="testSuite" render={(value: number[]) => value?.length || 0} />
          <Table.Column
            title="执行机制"
            dataIndex="cron"
            render={(value: string) => (value ? '定时触发' : '手动执行')}
          />
          <Table.Column
            title="状态"
            dataIndex="status"
            render={(value: number) =>
              value === 1 ? <Tag color="processing">执行中</Tag> : value === 0 ? <Tag color="default">待执行</Tag> : ''
            }
            width={120}
          />
          <Table.Column title="更新人" dataIndex="modifyUser" />
          <Table.Column title="更新时间" dataIndex="gmtCreate" width={180} />
          <Table.Column
            title="操作"
            render={(_, record: TaskItemVO, index) => {
              return (
                <div className="action-cell">
                  {/* 状态为执行中时无法执行 */}
                  <a data-disabled={record.status === 1}>执行</a>
                  <a>编辑</a>
                  <a style={{ color: 'red' }}>删除</a>
                  <a>查看报告</a>
                </div>
              );
            }}
            width={200}
          />
        </Table>
      </ContentCard>
    </MatrixPageContent>
  );
}
