/**
 * @description: 基座管理-存储管理-节点管理
 * @name {muxi.jth}
 * @date {2022/01/12 10:43}
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Table,
  Space,
  Popconfirm,
  message,
  Tag,
  Divider,
  Switch,
  Modal,
  Checkbox,
} from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { getRequest, delRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import NodeDetail from './node-detail';
import './index.less';

export default function Storage() {
  const { Option } = Select;
  const [addNodeVisiable, setAddNodeVisiable] = useState<boolean>(false);
  //启用配置管理选择
  let useNacosData: number;
  const handleNacosChange = async (checked: any, record: any) => {
    if (checked === 0) {
      useNacosData = 1;
    } else {
      useNacosData = 0;
    }
  };
  const onChange = (e: any) => {
    console.log(`checked = ${e.target.checked}`);
  };

  return (
    <ContentCard>
      <div className="node-mange-body">
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
            <Table.Column title="主机名" dataIndex="id" width="8%" />
            <Table.Column title="IP" dataIndex="templateName" width="20%" ellipsis />
            <Table.Column title="brick数量" dataIndex="languageCode" width="10%" ellipsis />
            <Table.Column title="device数量" dataIndex="templateType" width="12%" ellipsis />
            <Table.Column title="可用空间" dataIndex="appCategoryCode" width="16%" ellipsis />
            <Table.Column title="已用空间" dataIndex="appCategoryCode" width="16%" ellipsis />
            <Table.Column
              title="状态"
              dataIndex="tagName"
              width="8%"
              render={(current, record) => {
                return <Tag color="success">{current}</Tag>;
              }}
            />
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
          <div className="add-node">
            <Button
              type="primary"
              onClick={() => {
                setAddNodeVisiable(true);
              }}
            >
              新增节点
            </Button>
          </div>
        </div>

        <div>
          <NodeDetail />
        </div>
        <div>
          <Modal
            title="新增节点"
            visible={addNodeVisiable}
            width="30%"
            onOk={() => {
              setAddNodeVisiable(false);
            }}
            onCancel={() => {
              setAddNodeVisiable(false);
            }}
          >
            <Form labelCol={{ flex: '120px' }}>
              <Form.Item label="选择主机">
                <Select style={{ width: 160 }}></Select>
              </Form.Item>
              <Form.Item label="新增设备">
                <Checkbox onChange={onChange}></Checkbox>
              </Form.Item>
              <Form.Item label="选择磁盘">
                <Select style={{ width: 160 }}></Select>
              </Form.Item>
              <Form.Item label="擦除格式">
                <Checkbox onChange={onChange}></Checkbox>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </ContentCard>
  );
}
