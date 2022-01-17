/**
 * @description: 基座管理-存储管理-卷管理-卷详情
 * @name {muxi.jth}
 * @date {2022/01/14 11:34}
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
import './index.less';

export default function VolumeDetail() {
  const { Option } = Select;
  const [createSnapshotVisiable, setCreateSnapshotVisiable] = useState<boolean>(false);
  const [createCureVisiable, setCreateCureVisiable] = useState<boolean>(false);
  const [viewCureVisiable, setViewCureVisiable] = useState<boolean>(false);
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
      <div className="volume-detail-body">
        <div>
          <Form layout="inline">
            <Form.Item label="选择集群">
              <Select style={{ width: 140 }}></Select>
            </Form.Item>
          </Form>
          <Divider />
          <div className="volume-detail-info">
            <div>卷详情</div>
            <div>当前卷：vol_d704540c56991ff39a6fd8f31f810838</div>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <div>概况：</div>
          <ul>
            <li className="tab-header">
              <span className="tab-left">卷名：</span>
              <span className="tab-right"></span>
            </li>
            <li className="tab-header">
              <span className="tab-left">卷类型：</span>
              <span className="tab-right"></span>
            </li>
            <li className="tab-header">
              <span className="tab-left">卷ID：</span>
              <span className="tab-right"></span>
            </li>
            <li className="tab-header">
              <span className="tab-left">状态：</span>
              <span className="tab-right"></span>
            </li>
            <li className="tab-header">
              <span className="tab-left">brick数量：</span>
              <span className="tab-right"></span>
            </li>
            <li className="tab-header">
              <span className="tab-left">传输协议：</span>
              <span className="tab-right"></span>
            </li>
            <li className="tab-header">
              <span className="tab-left">挂载点：</span>
              <span className="tab-right"></span>
            </li>
            <li className="tab-header">
              <span className="tab-left">备选挂载点：</span>
              <span className="tab-right"></span>
            </li>
            <li className="tab-header">
              <span className="tab-left">快照版本：</span>
              <span className="tab-right"></span>
            </li>
            <li className="tab-header">
              <span className="tab-left">k8s pv：</span>
              <span className="tab-right"></span>
            </li>
            <li className="tab-header">
              <span className="tab-left">k8s pvc：</span>
              <span className="tab-right"></span>
            </li>
            <li className="tab-header">
              <span className="tab-left">k8s 命名空间：</span>
              <span className="tab-right"></span>
            </li>
          </ul>
        </div>
        <div style={{ marginTop: 10 }}>
          <div>
            <div>bricks:</div>
            <Table rowKey="id" bordered>
              <Table.Column title="brick数量" dataIndex="templateType" width="70%" ellipsis />
              <Table.Column
                title="状态"
                dataIndex="tagName"
                width="15%"
                render={(current, record) => {
                  return <Tag color="success">{current}</Tag>;
                }}
              />
              <Table.Column
                title="操作"
                dataIndex="gmtModify"
                width="15%"
                key="action"
                render={(_, record: any, index) => (
                  <Space size="small">
                    <Popconfirm
                      title="确定要停止吗？"
                      //  onConfirm={() => handleDelItem(record)}
                    >
                      <a style={{ color: 'red' }}>驱逐</a>
                    </Popconfirm>
                  </Space>
                )}
              />
            </Table>
          </div>
          <div style={{ marginTop: 10 }}>
            <div>snapshots:</div>
            <Table rowKey="id" bordered>
              <Table.Column title="snapshots" dataIndex="templateType" width="30%" ellipsis />
              <Table.Column title="UUID" dataIndex="templateType" width="30%" ellipsis />
              <Table.Column title="创建时间" dataIndex="templateType" width="15%" ellipsis />
              <Table.Column
                title="状态"
                dataIndex="tagName"
                width="10%"
                render={(current, record) => {
                  return <Tag color="success">{current}</Tag>;
                }}
              />
              <Table.Column
                title="操作"
                dataIndex="gmtModify"
                width="25%"
                key="action"
                render={(_, record: any, index) => (
                  <Space size="small">
                    <a>恢复</a>
                    <a>active</a>
                    <a>克隆</a>
                    <Popconfirm
                      title="确定要删除吗？"
                      //  onConfirm={() => handleDelItem(record)}
                    >
                      <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                  </Space>
                )}
              />
            </Table>
          </div>
          <div className="footer-buttons">
            <div className="footer-buttons-item">
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    setCreateSnapshotVisiable(true);
                  }}
                >
                  创建快照
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setCreateCureVisiable(true);
                  }}
                >
                  治愈
                </Button>
                <Button danger>停止</Button>
                <Button danger>删除</Button>
              </Space>
            </div>
          </div>
        </div>
        <Modal
          title="创建快照"
          visible={createSnapshotVisiable}
          width="30%"
          onOk={() => {
            setCreateSnapshotVisiable(false);
          }}
          onCancel={() => {
            setCreateSnapshotVisiable(false);
          }}
        >
          <Form labelCol={{ flex: '120px' }}>
            <Form.Item label="快照名称">
              <Input style={{ width: 160 }}></Input>
            </Form.Item>
            <Form.Item label="使用时间戳">
              <Checkbox onChange={onChange}></Checkbox>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="治愈"
          visible={createCureVisiable}
          width="60%"
          okText="治愈"
          onOk={() => {
            setCreateCureVisiable(false);
          }}
          onCancel={() => {
            setCreateCureVisiable(false);
          }}
        >
          <div className="cure-info">
            <div>
              {' '}
              <span>
                <Tag>状态：脑裂</Tag>
              </span>
            </div>
            <div>
              <Button
                onClick={() => {
                  setCreateCureVisiable(false);
                }}
                type="primary"
              >
                关闭治愈
              </Button>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <Table rowKey="id" bordered>
              <Table.Column title="brick" dataIndex="templateType" width="60%" ellipsis />
              <Table.Column title="entity" dataIndex="templateType" width="10%" ellipsis />
              <Table.Column
                title="status"
                dataIndex="tagName"
                width="10%"
                render={(current, record) => {
                  return <Tag color="success">{current}</Tag>;
                }}
              />
              <Table.Column
                title="操作"
                dataIndex="gmtModify"
                width="20%"
                key="action"
                render={(_, record: any, index) => (
                  <Space size="small">
                    <a
                      onClick={() => {
                        setViewCureVisiable(true);
                      }}
                    >
                      点击查看
                    </a>
                  </Space>
                )}
              />
            </Table>
          </div>

          <div className="cure-form-ensure">
            <div>
              <Form labelCol={{ flex: '300px' }}>
                <Form.Item label="选择治愈方式">
                  <Select style={{ width: 160 }}></Select>
                </Form.Item>
                <Form.Item label="输入治愈实体">
                  <Input placeholder="输入brick或者文件" style={{ width: 160 }}></Input>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Modal>
      </div>
    </ContentCard>
  );
}
