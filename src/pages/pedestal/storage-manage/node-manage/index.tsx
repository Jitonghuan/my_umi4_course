/**
 * @description: 基座管理-存储管理-节点管理
 * @name {muxi.jth}
 * @date {2022/01/12 10:43}
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Form, Select, Button, Table, Space, Popconfirm, Tag, Divider, Modal, Checkbox } from 'antd';
import { history } from 'umi';
import { getRequest, delRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import NodeDetail from './node-detail';
import { useGlusterfsList } from '../service';
import { useGlusterfsNodeList } from '../storage-dashboard/hooks';
import { useGlusterfsNodeDetail, useNonNodeList, useDeviceNameList, useAddNode, useDeleteNode } from './hook';
import './index.less';

export default function Storage() {
  const { Option } = Select;
  const [addNodeForm] = Form.useForm();
  const [addNodeVisiable, setAddNodeVisiable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [clusterCodeData, setClusterCodeData] = useState<any>([]); //获取集群Code
  const [currentClusterCode, setCurrentClusterCode] = useState<string>('');
  const [nodeListData, nodeListloading, queryNodeList] = useGlusterfsNodeList(); //获取节点数据
  const [devicesTableData, brickssTableData, nodeDetailLoading, queryNodeDetail] = useGlusterfsNodeDetail();
  const [glusterfsNonNode, glusterfsNonNodeloading, queryGlusterfsNonNodeList] = useNonNodeList();
  const [deviceName, queryDeviceName] = useDeviceNameList();
  const [addNode] = useAddNode();
  const [detailVisable, setDetailVisable] = useState<boolean>(false);
  const [hostName, setHostName] = useState<string>('');
  const [nodeId, setNodeId] = useState<string>('');
  const [isNewDevice, setIsNewDevice] = useState<boolean>(false);
  const [isWipe, setIsWipe] = useState<boolean>(false);
  const [deleteNode] = useDeleteNode();
  //启用配置管理选择
  let useNacosData: number;
  const handleNacosChange = async (checked: any, record: any) => {
    if (checked === 0) {
      useNacosData = 1;
    } else {
      useNacosData = 0;
    }
  };
  const onIsWipeChange = (e: any) => {
    setIsWipe(e.target.checked);
  };
  const onIsNewDeviceChange = (e: any) => {
    setIsNewDevice(e.target.checked);
  };
  useEffect(() => {
    queryGlusterfsClusterCode();
  }, []);
  const queryGlusterfsClusterCode = () => {
    setLoading(true);
    getRequest(useGlusterfsList)
      .then((res) => {
        if (res?.success) {
          let dataSource = res?.data;
          const source = (dataSource || []).map((n: any) => ({
            label: n,
            value: n,
          }));
          setClusterCodeData(source);
          setCurrentClusterCode(dataSource[0]);
          queryNodeList(dataSource[0]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const selectCluster = (value: string) => {
    setCurrentClusterCode(value);
    queryNodeList(value);
  };

  return (
    <ContentCard>
      <div className="node-mange-body">
        <div>
          <Form layout="inline">
            <Form.Item label="选择集群">
              <Select
                style={{ width: 140 }}
                options={clusterCodeData}
                onChange={selectCluster}
                value={currentClusterCode}
              ></Select>
            </Form.Item>
            <Divider style={{ height: 4, marginTop: 8, marginBottom: 0 }} />
          </Form>
        </div>
        <div style={{ marginTop: 20 }}>
          <Table rowKey="id" bordered dataSource={nodeListData} loading={nodeListloading}>
            <Table.Column title="主机名" dataIndex="hostname" width="8%" />
            <Table.Column title="IP" dataIndex="ip" width="20%" ellipsis />
            <Table.Column title="brick数量" dataIndex="brickCount" width="10%" ellipsis />
            <Table.Column title="device数量" dataIndex="deviceCount" width="12%" ellipsis />
            <Table.Column title="可用空间" dataIndex="diskFree" width="16%" ellipsis />
            <Table.Column title="已用空间" dataIndex="diskUsed" width="16%" ellipsis />
            <Table.Column
              title="状态"
              dataIndex="status"
              width="8%"
              render={(current, record) => {
                return current === 'online' ? (
                  <Tag color="success">在线</Tag>
                ) : current === 'offline' ? (
                  <Tag color="red">离线</Tag>
                ) : (
                  <Tag>{current}</Tag>
                );
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
                    onClick={() => {
                      setDetailVisable(true);
                      setHostName(record?.hostname);
                      setNodeId(record?.nodeId);
                      queryNodeDetail(currentClusterCode, record?.nodeId);
                    }}
                  >
                    详情
                  </a>
                  <Popconfirm
                    title="确定要移除吗？"
                    onConfirm={() => {
                      deleteNode(currentClusterCode, record?.hostname);
                    }}
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
                queryGlusterfsNonNodeList(currentClusterCode);
                queryDeviceName();
                addNodeForm.resetFields();
              }}
            >
              新增节点
            </Button>
          </div>
        </div>

        <div>
          {detailVisable && (
            <NodeDetail
              hostName={hostName}
              clusterCode={currentClusterCode}
              nodeId={nodeId}
              loading={nodeDetailLoading}
              devicesData={devicesTableData}
              bricksData={brickssTableData}
              queryNodeDetail={(currentClusterCode, nodeId) => {
                queryNodeDetail(currentClusterCode, nodeId);
              }}
            />
          )}
        </div>
        <div>
          <Modal
            title="新增节点"
            visible={addNodeVisiable}
            width="30%"
            onOk={() => {
              setAddNodeVisiable(false);
              let params = addNodeForm.getFieldsValue();
              addNode(currentClusterCode, params?.nodename, isNewDevice, params?.diskName, isWipe).then(() => {
                queryNodeList(currentClusterCode);
              });
            }}
            onCancel={() => {
              setAddNodeVisiable(false);
            }}
          >
            <Form labelCol={{ flex: '120px' }} form={addNodeForm}>
              <Form.Item label="选择主机" name="nodename">
                <Select style={{ width: 160 }} options={glusterfsNonNode} loading={glusterfsNonNodeloading}></Select>
              </Form.Item>
              <Form.Item label="新增设备" name="isNewDevice">
                <Checkbox onChange={onIsNewDeviceChange}></Checkbox>
              </Form.Item>
              <Form.Item label="选择磁盘" name="diskName">
                <Select style={{ width: 160 }} options={deviceName}></Select>
              </Form.Item>
              <Form.Item label="擦除格式" name="isWipe">
                <Checkbox onChange={onIsWipeChange}></Checkbox>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </ContentCard>
  );
}
