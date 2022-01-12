/**
 * @description: 基座管理-存储管理
 * @name {muxi.jth}
 * @date {2022/01/11 16:43}
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
          <Form layout="inline">
            <Form.Item label="卷名" name="appCategoryCode">
              <Input style={{ width: 140 }} />
            </Form.Item>
            <Form.Item label="卷类型" name="envCode">
              <Select allowClear showSearch style={{ width: 140 }} />
            </Form.Item>
            <Form.Item label="PV" name="templateType">
              <Input placeholder="请输入K8s pv name" style={{ width: 140 }} />
            </Form.Item>
            <Form.Item label="PVC" name="templateName">
              <Input placeholder="请输入模版名称"></Input>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="ghost" htmlType="reset">
                重置
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div style={{ marginTop: 20 }}>
          <Table rowKey="id" bordered>
            <Table.Column title="ID" dataIndex="id" width="4%" />
            <Table.Column title="卷名" dataIndex="templateName" width="20%" ellipsis />
            <Table.Column title="类型" dataIndex="languageCode" width="8%" ellipsis />
            <Table.Column title="brick数量" dataIndex="templateType" width="8%" ellipsis />
            <Table.Column title="传输协议" dataIndex="appCategoryCode" width="8%" ellipsis />
            <Table.Column
              title="开启NFS"
              dataIndex="useNacos"
              width={110}
              render={(value, record, index) => (
                <Switch
                  className="useNacos"
                  onChange={() => handleNacosChange(value, record)}
                  checked={value === 1 ? true : false}
                />
              )}
            />
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
                    详细状态
                  </a>
                  <Popconfirm
                    title="确定要停止吗？"
                    //  onConfirm={() => handleDelItem(record)}
                  >
                    <a style={{ color: 'red' }}>停止</a>
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
