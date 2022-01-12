/**
 * @description: 基座管理-存储管理-节点管理
 * @name {muxi.jth}
 * @date {2022/01/12 10:43}
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, message, Tag, Divider, Switch } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { getRequest, delRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';

export default function Storage() {
  const { Option } = Select;
  //启用配置管理选择
  let useNacosData: number;
  const handleNacosChange = async (checked: any, record: any) => {
    if (checked === 0) {
      useNacosData = 1;
    } else {
      useNacosData = 0;
    }
  };
  return (
    <PageContainer>
      <ContentCard>
        <div>
          <Form layout="inline">
            <Form.Item label="选择集群">
              <Select style={{ width: 140 }}></Select>
            </Form.Item>
            <Divider />
          </Form>
        </div>
        <div style={{ marginTop: 20 }}>
          <Table rowKey="id" bordered>
            <Table.Column title="主机名" dataIndex="id" width="4%" />
            <Table.Column title="IP" dataIndex="templateName" width="20%" ellipsis />
            <Table.Column title="brick数量" dataIndex="languageCode" width="8%" ellipsis />
            <Table.Column title="device数量" dataIndex="templateType" width="8%" ellipsis />
            <Table.Column title="可用空间" dataIndex="appCategoryCode" width="8%" ellipsis />
            <Table.Column title="已用空间" dataIndex="appCategoryCode" width="8%" ellipsis />
            <Table.Column
              title="状态"
              dataIndex="tagName"
              width="8%"
              render={(current, record) => {
                return <Tag color="success">{current}</Tag>;
              }}
            />
            <Table.Column title="快照数量" dataIndex="remark" width={110} ellipsis />
            <Table.Column title="可用空间" dataIndex="remark" width={110} ellipsis />
            <Table.Column title="总空间" dataIndex="remark" width={110} ellipsis />
            <Table.Column
              title="操作"
              dataIndex="gmtModify"
              width="18%"
              key="action"
              render={(_, record: any, index) => (
                <Space size="small">
                  <a
                    onClick={() =>
                      history.push({
                        pathname: 'tmpl-detail',
                        query: {
                          type: 'info',
                          templateCode: record.templateCode,
                          languageCode: record?.languageCode,
                        },
                      })
                    }
                  >
                    详情
                  </a>
                  <Popconfirm
                    title="确定要停止吗？"
                    //  onConfirm={() => handleDelItem(record)}
                  >
                    <a style={{ color: 'red' }}>移除</a>
                  </Popconfirm>
                </Space>
              )}
            />
          </Table>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
