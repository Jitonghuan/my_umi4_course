/**
 * @description: 患者操作员纬度
 * @name {muxi.jth}
 * @time {2021/11/30 10:47}
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Form, Radio, Button, Modal, Card, Select, Input, Table } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { ContentCard } from '@/components/vc-page-content';
import * as APIS from '../service';
import { postRequest } from '@/utils/request';
import './index.less';

export default function OperatorScheduling() {
  const [form] = Form.useForm();
  const clusterA_patientColumns = [
    {
      title: '患者',
      dataIndex: 'a_patientUserId',
      key: 'userId',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => <a>删除</a>,
    },
  ];
  const clusterB_patientColumns = [
    {
      title: '患者',
      dataIndex: 'b_patientUserId',
      key: 'userId',
    },

    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => <a>删除</a>,
    },
  ];

  const clusterA_operatorColumns = [
    {
      title: '操作员',
      dataIndex: 'a_patientUserId',
      key: 'userId',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => <a>删除</a>,
    },
  ];
  const clusterB_operatorColumns = [
    {
      title: '操作员',
      dataIndex: 'b_patientUserId',
      key: 'userId',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => <a>删除</a>,
    },
  ];

  const data = [
    {
      key: '1',
      userId: '99999',
    },
  ];
  return (
    <ContentCard className="page-scheduling">
      <div className="site-card-border-less-wrapper">
        <div className="content-Card">
          <div className="leftCard">
            <Card title="操作" bordered={false} style={{ width: 420, height: 400 }}>
              <Form form={form} labelCol={{ flex: '100px' }}>
                <Form.Item label="集群选择" name="branchName" rules={[{ required: true, message: '请输入分支名' }]}>
                  <Select style={{ width: 180 }}></Select>
                </Form.Item>

                <Form.Item label="人员选择" name="desc" style={{ marginTop: 30 }}>
                  <Select style={{ width: 180 }}></Select>
                </Form.Item>

                <Form.Item label="ID" name="desc" style={{ marginTop: 30 }}>
                  <Input style={{ width: 180 }}></Input>
                </Form.Item>

                <Form.Item style={{ marginTop: 30 }}>
                  <Button type="primary" style={{ float: 'right' }}>
                    添加
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
          <div className="RightCard">
            <Card title="A集群" bordered={false}>
              <div className="clusterAFlex">
                <div>
                  {' '}
                  <Table
                    columns={clusterA_patientColumns}
                    dataSource={data}
                    pagination={false}
                    style={{ width: 300 }}
                  />
                </div>
                <div>
                  <Table
                    columns={clusterA_operatorColumns}
                    dataSource={data}
                    pagination={false}
                    style={{ width: 300 }}
                  />
                </div>
              </div>
            </Card>
            <Card title="B集群" bordered={false}>
              <div className="clusterBFlex">
                <Table columns={clusterB_patientColumns} dataSource={data} pagination={false} style={{ width: 300 }} />
              </div>
              <div>
                <Table columns={clusterB_operatorColumns} dataSource={data} pagination={false} style={{ width: 300 }} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ContentCard>
  );
}
