/**
 * @description: 基座管理-存储管理-卷管理-卷详情
 * @name {muxi.jth}
 * @date {2022/01/14 11:34}
 */

import React, { useState } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, message, Tag, Divider, Modal, Checkbox } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { history,useLocation } from 'umi';
import { parse } from 'query-string';
import { ContentCard } from '@/components/vc-page-content';
import { CopyOutlined } from '@ant-design/icons';
import './index.less';
import {
  useGetBrickInfo,
  useGetSnapshotList,
  useCreateSnapshot,
  useStopVolume,
  useDeleteVolume,
  useCureVolume,
  usereStoreSnapshot,
  useActivateSnapshot,
  useCloneSnapshot,
  useDeleteSnapshot,
  useDeviceNameList,
  useEvictBrick,
  useDeactivateSnapshot,
} from './hook';

type statusTypeItem = {
  tagText: string;
  buttonText: string;
  color: string;
  status: string;
  disabled: boolean;
};

const STATUS_TYPE: Record<string, statusTypeItem> = {
  Stopped: { tagText: 'Stopped', buttonText: 'active', color: 'green', status: 'Stopped', disabled: true },
  Started: { tagText: 'Started', buttonText: 'unactive', color: 'default', status: 'Started', disabled: false },
};

export default function VolumeDetail() {
  let location:any = useLocation();
  const query = parse(location.search);
  if (!location.state) {
    history.push('/matrix/pedestal/volume-manage');
    return null;
  }
  const [createSnapshotForm] = Form.useForm();
  const [cureForm] = Form.useForm();
  const [brickTableData, brickLoading, getBrickInfo] = useGetBrickInfo();
  const [snapshotData, snapshotLoading, getSnapshotList] = useGetSnapshotList();
  const volumeInfo: any = location.state;
  const {
    volumeName,
    volumeType,
    volumeId,
    brickCount,
    transportType,
    enableNfs,
    snapshotCount,
    status,
    volumeCapacity,
    volumeAvailable,
    mountPoint,
    mountOptions,
    pvName,
    namespace,
    pvcName,
  } = volumeInfo.recordInfo;
  const { Option } = Select;
  const [createSnapshotVisiable, setCreateSnapshotVisiable] = useState<boolean>(false);
  const [createCureVisiable, setCreateCureVisiable] = useState<boolean>(false);
  const [viewCureVisiable, setViewCureVisiable] = useState<boolean>(false);
  const [loadBrickVisiable, setLoadBrickVisiable] = useState<boolean>(false);
  const [loadSnapVisiable, setLoadSnapVisiable] = useState<boolean>(false);
  const [useTimestamp, setUseTimestamp] = useState<boolean>(false);
  const [files, setFiles] = useState<any>([]);
  const [createSnapshot] = useCreateSnapshot();
  const [stopVolume] = useStopVolume();
  const [deleteVolume] = useDeleteVolume();
  const [storeSnapshot] = usereStoreSnapshot();
  const [activateSnapshot] = useActivateSnapshot();
  const [cloneSnapshot] = useCloneSnapshot();
  const [deleteSnapshot] = useDeleteSnapshot();
  const [healMethodOption, queryHealMethod] = useDeviceNameList();
  const [cureVolume] = useCureVolume();
  const [evictBrick] = useEvictBrick();
  const [deactivateSnapshot] = useDeactivateSnapshot();

  const onChange = (e: any) => {
  
    setUseTimestamp(e.target.checked);
  };

  return (
    <ContentCard>
      <div className="volume-detail-body">
        <div>
          <div style={{ float: 'right' }}>
            <Button
              type="primary"
              onClick={() =>
                history.push({
                  pathname: `/matrix/pedestal/storage-manage/volume-manage`,
                  search:`info=volumeManage`
                  // query: {
                  //   info: 'volumeManage',
                  // },
                })
              }
            >
              返回卷管理
            </Button>
          </div>
          <Divider />
          <div className="volume-detail-info">
            <div>卷详情</div>
            <div>当前卷：{volumeName}</div>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <div>概况：</div>
          <ul>
            <li className="tab-header">
              <span className="tab-left">卷名：</span>
              <span className="tab-right">{volumeName}</span>
            </li>
            <li className="tab-header">
              <span className="tab-left">卷类型：</span>
              <span className="tab-right">{volumeType}</span>
            </li>
            <li className="tab-header">
              <span className="tab-left">卷ID：</span>
              <span className="tab-right">{volumeId}</span>
            </li>
            <li className="tab-header">
              <span className="tab-left">状态：</span>
              <span className="tab-right">{status}</span>
            </li>
            <li className="tab-header">
              <span className="tab-left">brick数量：</span>
              <span className="tab-right">{brickCount}</span>
            </li>
            <li className="tab-header">
              <span className="tab-left">传输协议：</span>
              <span className="tab-right">{transportType}</span>
            </li>
            <li className="tab-header">
              <span className="tab-left">挂载点：</span>
              <span className="tab-right">{mountPoint}</span>
            </li>
            <li className="tab-header">
              <span className="tab-left">挂载选项：</span>
              <span className="tab-right">{mountOptions}</span>
            </li>
            <li className="tab-header">
              <span className="tab-left">快照数：</span>
              <span className="tab-right">{snapshotCount}</span>
            </li>
            <li className="tab-header">
              <span className="tab-left">k8s pv：</span>
              <span className="tab-right">{pvName}</span>
            </li>
            <li className="tab-header">
              <span className="tab-left">k8s pvc：</span>
              <span className="tab-right">{pvcName}</span>
            </li>
            <li className="tab-header">
              <span className="tab-left">k8s 命名空间：</span>
              <span className="tab-right">{namespace}</span>
            </li>
          </ul>
        </div>

        <div style={{ marginTop: 10 }}>
          <Button
            type="primary"
            onClick={() => {
              if (volumeInfo.status !== 'Stopped') {
                getBrickInfo(volumeInfo.clusterCode, volumeInfo.volumeName);
                getSnapshotList(volumeInfo.clusterCode, volumeInfo.volumeName);
                setLoadBrickVisiable(true);
                setLoadSnapVisiable(true);
              } else if (volumeInfo.status === 'Stopped') {
                message.info('当前卷不可查看bricks详情');
                getSnapshotList(volumeInfo.clusterCode, volumeInfo.volumeName);
                setLoadSnapVisiable(true);
              }
            }}
          >
            查看更多
          </Button>
          {loadBrickVisiable && (
            <div>
              <div>bricks:</div>
              <Table rowKey="brickName" bordered dataSource={brickTableData} loading={brickLoading}>
                <Table.Column title="brick" dataIndex="brickName" width="70%" ellipsis />
                <Table.Column
                  title="状态"
                  dataIndex="status"
                  width="15%"
                  render={(current, record) => {
                    return current === 'Disconnected' ? (
                      <Tag color="red">离线</Tag>
                    ) : current === 'Connected' ? (
                      <Tag color="success">在线</Tag>
                    ) : (
                      <Tag>{current}</Tag>
                    );
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
                        title="确定要驱逐吗？"
                        onConfirm={() => {
                          evictBrick(volumeInfo.clusterCode, record.brickId).then(() => {
                            getBrickInfo(volumeInfo.clusterCode, volumeInfo.volumeName);
                          });
                        }}
                      >
                        <a style={{ color: 'red' }}>驱逐</a>
                      </Popconfirm>
                    </Space>
                  )}
                />
              </Table>
            </div>
          )}
          {loadSnapVisiable && (
            <div style={{ marginTop: 10 }}>
              <div>snapshots:</div>
              <Table rowKey="id" bordered dataSource={snapshotData} loading={snapshotLoading}>
                <Table.Column title="snapshots" dataIndex="snapshotName" width="28%" ellipsis />
                <Table.Column title="UUID" dataIndex="uuid" width="32%" ellipsis />
                <Table.Column title="创建时间" dataIndex="createTime" width="18%" ellipsis />
                <Table.Column
                  title="状态"
                  dataIndex="snapVolStatus"
                  width="10%"
                  render={(current, record) => {
                    return current === 'Started' ? (
                      <Tag color="success">{current}</Tag>
                    ) : current === 'Stopped' ? (
                      <Tag color="red">{current}</Tag>
                    ) : (
                      <Tag>{current}</Tag>
                    );
                  }}
                />
                <Table.Column
                  title="操作"
                  width="22%"
                  key="action"
                  render={(text, record: any, index) => (
                    <Space size="small">
                      <Button
                        type="primary"
                        disabled={STATUS_TYPE[record?.snapVolStatus]?.disabled}
                        onClick={() => {
                          storeSnapshot(volumeInfo.clusterCode, record?.snapshotName).then(() => {
                            getSnapshotList(volumeInfo.clusterCode, volumeInfo.volumeName);
                          });
                        }}
                      >
                        恢复
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => {
                          if (record.status === 'Started') {
                            deactivateSnapshot(volumeInfo.clusterCode, record?.snapshotName).then(() => {
                              getSnapshotList(volumeInfo.clusterCode, volumeInfo.volumeName);
                            });
                          } else {
                            activateSnapshot(volumeInfo.clusterCode, record?.snapshotName).then(() => {
                              getSnapshotList(volumeInfo.clusterCode, volumeInfo.volumeName);
                            });
                          }
                        }}
                      >
                        {STATUS_TYPE[record?.snapVolStatus]?.buttonText}
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => {
                          cloneSnapshot(volumeInfo.clusterCode, record?.snapshotName).then(() => {
                            getSnapshotList(volumeInfo.clusterCode, volumeInfo.volumeName);
                          });
                        }}
                      >
                        克隆
                      </Button>
                      <Popconfirm
                        title="确定要删除快照吗？"
                        onConfirm={() => {
                          deleteSnapshot(volumeInfo.clusterCode, record?.snapshotName).then(() => {
                            getSnapshotList(volumeInfo.clusterCode, volumeInfo.volumeName);
                          });
                        }}
                      >
                        <Button danger>删除</Button>
                      </Popconfirm>
                    </Space>
                  )}
                />
              </Table>
            </div>
          )}
          {(loadSnapVisiable || loadBrickVisiable) && (
            <div className="footer-buttons">
              <div className="footer-buttons-item">
                <Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      setCreateSnapshotVisiable(true);
                      createSnapshotForm.resetFields();
                    }}
                  >
                    创建快照
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      queryHealMethod();
                      setCreateCureVisiable(true);
                    }}
                  >
                    治愈
                  </Button>
                  <Button
                    danger
                    onClick={() => {
                      stopVolume(volumeInfo.clusterCode, volumeInfo.volumeName);
                    }}
                  >
                    停止
                  </Button>
                  <Button
                    danger
                    onClick={() => {
                      deleteVolume(volumeInfo.clusterCode, volumeInfo.volumeName);
                    }}
                  >
                    删除
                  </Button>
                </Space>
              </div>
            </div>
          )}
          <Modal
            title="创建快照"
            visible={createSnapshotVisiable}
            width="30%"
            onOk={() => {
              let params = createSnapshotForm.getFieldsValue();
              createSnapshot(volumeInfo.clusterCode, volumeInfo.volumeName, params.snapshotName, useTimestamp)
                .then(() => {
                  getSnapshotList(volumeInfo.clusterCode, volumeInfo.volumeName);
                })
                .finally(() => {
                  setCreateSnapshotVisiable(false);
                });
            }}
            onCancel={() => {
              setCreateSnapshotVisiable(false);
            }}
          >
            <Form labelCol={{ flex: '120px' }} form={createSnapshotForm}>
              <Form.Item label="快照名称" name="snapshotName">
                <Input style={{ width: 240 }}></Input>
              </Form.Item>
              <Form.Item label="使用时间戳" name="useTimestamp">
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
              let params = cureForm.getFieldsValue();
              cureVolume(volumeInfo.clusterCode, volumeInfo.volumeName, params.healMethod, params.object).then(() => {
                getBrickInfo(volumeInfo.clusterCode, volumeInfo.volumeName);
              });
            }}
            onCancel={() => {
              setCreateCureVisiable(false);
            }}
          >
            <div className="cure-info">
              <div>
                <span>
                  {status === 'Started' ? (
                    <Tag color="success">状态：{status}</Tag>
                  ) : status === 'Stopped' ? (
                    <Tag color="red">状态：{status}</Tag>
                  ) : (
                    <Tag>状态：{status}</Tag>
                  )}
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
              <Table rowKey="id" bordered dataSource={brickTableData}>
                <Table.Column title="brick" dataIndex="brickName" width="60%" ellipsis />
                <Table.Column title="entriesNum" dataIndex="entriesNum" width="14%" ellipsis />
                <Table.Column
                  title="status"
                  dataIndex="status"
                  width="10%"
                  render={(current, record) => {
                    return current === 'Disconnected' ? (
                      <Tag color="red">离线</Tag>
                    ) : current === 'Connected' ? (
                      <Tag color="success">在线</Tag>
                    ) : (
                      <Tag>{current}</Tag>
                    );
                  }}
                />
                <Table.Column
                  title="files"
                  dataIndex="files"
                  width="16%"
                  key="action"
                  render={(_, record: any, index) => (
                    <Space size="small">
                      <a
                        onClick={() => {
                          if (record.entriesNum !== '0') {
                            setViewCureVisiable(true);
                            setFiles(record?.files);
                          }
                        }}
                      >
                        {record.entriesNum !== '0' ? '点击查看' : null}
                      </a>
                    </Space>
                  )}
                />
              </Table>
            </div>

            <div className="cure-form-ensure">
              <div>
                <Form labelCol={{ flex: '300px' }} form={cureForm}>
                  <Form.Item label="选择治愈方式" name="healMethod">
                    <Select style={{ width: 220 }} options={healMethodOption}></Select>
                  </Form.Item>
                  <Form.Item label="输入治愈实体" name="object">
                    <Input placeholder="输入brick或者文件" style={{ width: 220 }}></Input>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </Modal>
          <Modal
            title="files"
            visible={viewCureVisiable}
            width="40%"
            onOk={() => {
              setViewCureVisiable(false);
            }}
            onCancel={() => {
              setViewCureVisiable(false);
            }}
          >
            <div>
              {files?.map((item: any) => {
                return (
                  <div>
                    <CopyToClipboard text={item} onCopy={() => message.success('复制成功！')}>
                      <p>
                        <span>{item}</span>
                        <span style={{ marginLeft: 8, color: '#3591ff' }}>
                          <CopyOutlined />
                        </span>
                      </p>
                    </CopyToClipboard>
                  </div>
                );
              })}
            </div>
          </Modal>
        </div>
      </div>
    </ContentCard>
  );
}
