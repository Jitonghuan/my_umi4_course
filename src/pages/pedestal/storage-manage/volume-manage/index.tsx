/**
 * @description: 基座管理-存储管理-节点管理
 * @name {muxi.jth}
 * @date {2022/01/12 11:00}
 */

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, Tag, Divider, Switch } from '@cffe/h2o-design';
import { history } from 'umi';
import { getRequest } from '@/utils/request';
import { ContentCard } from '@/components/vc-page-content';
import { useGlusterfsList } from '../service';
import { useVolumeList, useVolumeTypeList, useEnableNfs } from './hook';
import { useStopVolume, useStartVolume } from '../volume-detail/hook';
import './index.less';
type statusTypeItem = {
  tagText: string;
  buttonText: string;
  color: string;
  status: string;
  disabled: boolean;
};

const STATUS_TYPE: Record<string, statusTypeItem> = {
  Stopped: { tagText: 'Stopped', buttonText: '启用', color: 'green', status: 'Stopped', disabled: true },
  Started: { tagText: 'Started', buttonText: '停止', color: 'red', status: 'Started', disabled: false },
};

export default function Storage() {
  const { Option } = Select;
  const [searhForm] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [clusterCodeData, setClusterCodeData] = useState<any>([]); //获取集群Code
  const [currentClusterCode, setCurrentClusterCode] = useState<string>('');
  const [volumeTableData, tableLoading, queryVolumeList] = useVolumeList();
  const [volumeTypeOption, queryDeviceName] = useVolumeTypeList();
  const [enableNfs] = useEnableNfs();
  const [stopVolume] = useStopVolume();
  const [startVolume] = useStartVolume();

  useEffect(() => {
    queryGlusterfsClusterCode();
  }, []);
  useEffect(() => {
    queryDeviceName();
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
          queryVolumeList(dataSource[0]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //启用NFS选择
  let useNFS: string;

  const handleNFSChange = async (checked: any, record: any) => {
    let value = searhForm.getFieldsValue();
    if (checked === 'on') {
      useNFS = 'off';

      enableNfs(currentClusterCode, record?.volumeName, useNFS).then(() => {
        queryVolumeList(currentClusterCode, value?.volumeName, value?.volumeType, value?.pvName, value?.pvcName);
      });
    } else {
      useNFS = 'on';
      enableNfs(currentClusterCode, record?.volumeName, useNFS).then(() => {
        queryVolumeList(currentClusterCode, value?.volumeName, value?.volumeType, value?.pvName, value?.pvcName);
      });
    }
  };
  const selectCluster = (value: string) => {
    setCurrentClusterCode(value);
    queryVolumeList(value);
  };
  const searchVolumeList = (value: any) => {
    queryVolumeList(currentClusterCode, value?.volumeName, value?.volumeType, value?.pvName, value?.pvcName);
  };

  return (
    <ContentCard className="volume-manage">
      <div>
        <Form layout="inline">
          <Form.Item label="选择集群">
            <Select
              style={{ width: 180 }}
              options={clusterCodeData}
              onChange={selectCluster}
              value={currentClusterCode}
            ></Select>
          </Form.Item>
          <Divider />
        </Form>
        <Form layout="inline" form={searhForm} onFinish={searchVolumeList}>
          <Form.Item label="卷名" name="volumeName">
            <Input style={{ width: 190 }} />
          </Form.Item>
          <Form.Item label="卷类型" name="volumeType">
            <Select allowClear showSearch style={{ width: 180 }} options={volumeTypeOption} />
          </Form.Item>
          <Form.Item label="PV" name="pvName">
            <Input placeholder="请输入pv名称" style={{ width: 180 }} />
          </Form.Item>
          <Form.Item label="PVC" name="pvcName">
            <Input placeholder="请输入pvc名称"></Input>
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
        <Table
          rowKey="volumeId"
          className="volume"
          bordered
          dataSource={volumeTableData}
          loading={tableLoading}
          pagination={false}
          scroll={{ x: '100%', y: window.innerHeight - 380 }}
        >
          {/* <Table.Column title="ID" dataIndex="volumeId" width="16%" /> */}
          <Table.Column title="卷名" dataIndex="volumeName" width="26%" />
          <Table.Column title="类型" dataIndex="volumeType" width="16%" />
          <Table.Column title="pv" dataIndex="pvName" width="18%" />
          <Table.Column title="pvc" dataIndex="pvcName" width="18%" />
          <Table.Column title="命名空间" dataIndex="namespace" width="16%" />
          {/* <Table.Column title="快照数量" dataIndex="snapshotCount" width={90} ellipsis /> */}
          <Table.Column title="可用空间" dataIndex="volumeAvailable" width={100} ellipsis />
          <Table.Column title="总空间" dataIndex="volumeCapacity" width={100} ellipsis />
          <Table.Column
            title="开启NFS"
            dataIndex="enableNfs"
            width="12%"
            render={(value, record, index) => (
              <Switch
                className="enableNfs"
                onChange={() => handleNFSChange(value, record)}
                checked={value === 'on' ? true : false}
              />
            )}
          />
          <Table.Column
            title="状态"
            dataIndex="status"
            width={120}
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
            width={120}
            key="action"
            render={(_, record: any, index) => (
              <Space size="middle">
                <a
                  onClick={() =>
                    history.push({
                      pathname: '/matrix/pedestal/volume-detail',
                      state: {
                        clusterCode: `${currentClusterCode}`,
                        volumeName: `${record.volumeName}`,
                        recordInfo: record,
                        status: `${record.status}`,
                      },
                    })
                  }
                >
                  详细状态
                </a>
                <Popconfirm
                  title={`确定要${STATUS_TYPE[record?.status].buttonText}吗？`}
                  onConfirm={() => {
                    if (record?.status === 'Stopped') {
                      startVolume(currentClusterCode, record.volumeName).then(() => {
                        queryVolumeList(currentClusterCode);
                      });
                    }
                    if (record?.status === 'Started') {
                      stopVolume(currentClusterCode, record.volumeName).then(() => {
                        queryVolumeList(currentClusterCode);
                      });
                    }
                  }}
                >
                  <a style={{ color: `${STATUS_TYPE[record?.status].color}` }}>
                    {STATUS_TYPE[record?.status].buttonText}
                  </a>
                </Popconfirm>
              </Space>
            )}
          />
        </Table>
      </div>
    </ContentCard>
  );
}
