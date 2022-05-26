/**
 * @description: 基座管理-存储管理-存储大盘
 * @name {muxi.jth}
 * @date {2022/01/11 16:43}
 */

import React, { useState, useEffect } from 'react';
import { Form, Select, Table, Tag, Divider } from '@cffe/h2o-design';
import { getRequest } from '@/utils/request';
import { ContentCard } from '@/components/vc-page-content';
import DiskUsagePieChart from './dashboards/disk-usage-pieChart';
import DiskUsageLineChart from './dashboards/disk-usage-lineChart';
import VolumeChangeLineChart from './dashboards/volume-change-lineChart';
import BrickChangeLineChart from './dashboards/brick-change-lineChart';
import {
  useGlusterfsClusterInfo,
  useGlusterfsNodeList,
  useGlusterfsClusterMetrics,
  useDiskLineInfo,
  useBrickLineInfo,
  useVolumeLineInfo,
} from './hooks';
import { useGlusterfsList } from '../service';
import './index.less';

export default function Storage() {
  const { Option } = Select;
  const [clusterInfoData, clusterDataSource, clusterInfoloading, queryGlusterfsClusterInfo] = useGlusterfsClusterInfo(); //获取gfs大盘数据
  const [nodeListData, nodeListloading, queryNodeList] = useGlusterfsNodeList(); //获取节点数据
  const [diskUsedPieData, diskPieloading, queryGlusterfsMetrics] = useGlusterfsClusterMetrics(); //获取Disk饼图趋势数据
  const [diskUsedLineData, diskLineLoading, getDiskLineInfo] = useDiskLineInfo();
  const [brickNumLineData, brickLoading, getBrickLineInfo] = useBrickLineInfo();
  const [volumeNumLineData, volumeLoading, getVolumeLineInfo] = useVolumeLineInfo();

  const [currentClusterCode, setCurrentClusterCode] = useState<string>('');
  const [clusterCodeData, setClusterCodeData] = useState<any>([]); //获取集群Code
  const [loading, setLoading] = useState<boolean>(false);
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
          queryGlusterfsClusterInfo(dataSource[0]);
          queryNodeList(dataSource[0]);
          queryGlusterfsMetrics(dataSource[0]);
          getDiskLineInfo(dataSource[0]);
          getBrickLineInfo(dataSource[0]);
          getVolumeLineInfo(dataSource[0]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    queryGlusterfsClusterCode();
  }, []);
  const selectCluster = (value: string) => {
    setCurrentClusterCode(value);
    queryGlusterfsClusterInfo(value);
    queryNodeList(value);
    queryGlusterfsMetrics(value);
    getDiskLineInfo(value);
    getBrickLineInfo(value);
    getVolumeLineInfo(value);
  };
  return (
    <ContentCard>
      <div className="storage-body">
        <div className="storage-dashboard">
          <Form layout="inline">
            <Form.Item label="选择集群">
              <Select
                style={{ width: 140 }}
                options={clusterCodeData}
                onChange={selectCluster}
                value={currentClusterCode}
              ></Select>
            </Form.Item>
          </Form>
        </div>
        <div className="cluster-info">
          <div className="info-title">
            <div>
              <h3>集群概况</h3>
            </div>
          </div>
          <div className="volume-status">
            <span>
              {clusterInfoData?.clusterStatus === '健康' ? (
                <Tag color="green">状态:{clusterInfoData?.clusterStatus}</Tag>
              ) : clusterInfoData?.clusterStatus === '异常' ? (
                <Tag color="red">状态:{clusterInfoData?.clusterStatus}</Tag>
              ) : (
                <Tag>{clusterInfoData?.clusterStatus}</Tag>
              )}
            </span>
            <span>
              <Tag color="geekblue">集群类型：GLUSTERFS</Tag>
            </span>
            <span>
              {clusterInfoData?.clusterStatus === '健康' ? (
                <Tag color="green">HEKETI:{clusterInfoData?.heketiStatus}</Tag>
              ) : clusterInfoData?.clusterStatus === '异常' ? (
                <Tag color="red">HEKETI:{clusterInfoData?.heketiStatus}</Tag>
              ) : (
                <Tag>{clusterInfoData?.heketiStatus}</Tag>
              )}
            </span>
          </div>
          <div style={{ marginTop: 10 }}>
            <Table
              rowKey="type"
              bordered
              dataSource={clusterDataSource}
              loading={clusterInfoloading}
              pagination={false}
            >
              <Table.Column title="类型" dataIndex="type" width="25%" />
              <Table.Column title="数量" dataIndex="total" width="25%" />
              <Table.Column title="在线/已用" dataIndex="online" width="25%" />
              <Table.Column title="离线/未用" dataIndex="offline" width="25%" />
            </Table>
          </div>
        </div>

        <div className="disk-dashboard">
          <div className="disk-usage-pie">
            <DiskUsagePieChart data={diskUsedPieData} loading={diskPieloading} />
          </div>
          <div className="disk-usage-divider"></div>
          <div className="disk-usage-line">
            <DiskUsageLineChart
              data={diskUsedLineData}
              clusterCode={currentClusterCode}
              queryChartData={(clusterCode, diskViewDay) => getDiskLineInfo(clusterCode, diskViewDay)}
              loading={diskLineLoading}
            />
          </div>
        </div>
        <Divider style={{ height: 10, marginTop: 0, marginBottom: 0 }} />
        <div className="cluster-node-info">
          <div className="cluster-info">
            <div className="info-title">
              <div>
                <h3>集群节点</h3>
              </div>
            </div>
          </div>
          <Table rowKey="ip" bordered dataSource={nodeListData} loading={nodeListloading}>
            <Table.Column title="主机名" dataIndex="hostname" width="30%" />
            <Table.Column title="IP" dataIndex="ip" width="20%" ellipsis />
            <Table.Column title="brick数量" dataIndex="brickCount" width="8%" ellipsis />
            <Table.Column title="device数量" dataIndex="deviceCount" width="8%" ellipsis />
            <Table.Column title="可用空间" dataIndex="diskFree" width="8%" ellipsis />
            <Table.Column title="已用空间" dataIndex="diskUsed" width="8%" ellipsis />
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
          </Table>
        </div>
        <div className="volume-dashboard">
          <div className="volume-line-chart">
            <VolumeChangeLineChart
              data={volumeNumLineData}
              clusterCode={currentClusterCode}
              queryChartData={(clusterCode, volumeViewDay) => getVolumeLineInfo(clusterCode, volumeViewDay)}
              loading={volumeLoading}
            />
          </div>
          {/* <div className='volume-usage-divider'></div> */}
          <div className="brick-line-chart">
            <BrickChangeLineChart
              data={brickNumLineData}
              clusterCode={currentClusterCode}
              queryChartData={(clusterCode, brickViewDay) => getBrickLineInfo(clusterCode, brickViewDay)}
              loading={brickLoading}
            />
          </div>
        </div>
      </div>
    </ContentCard>
  );
}
