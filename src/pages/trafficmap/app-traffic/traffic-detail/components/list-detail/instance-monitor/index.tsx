
import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Card, Row, Col, Table, Tooltip } from 'antd';
import HulkTable, { usePaginated, ColumnProps } from '@cffe/vc-hulk-table';
import { QuestionCircleOutlined } from '@ant-design/icons'
import { tableSchema } from './schema';
import DetailContext from '../../../context';
import CpuUsage from './dashboards/cpu';
import MemroyUsage from './dashboards/memory';
import { queryTrafficList } from '../../../../hook';
import FsWritesChart from './dashboards/fs';
import NetWorkIOChart from './dashboards/network';
import { useQueryPodCpu, usequeryPodMem, useQueryFs, useQueryNetwork, queryItems } from './dashboards/hook';
import './index.less'

export default function InstanceMonitor() {
  const [nodeDataSource, setNodeDataSource] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const { appCode, envCode, startTime, currentTableData, hostIP, hostName, count, isClick, podIps, endTime, selectTimeType } = useContext(DetailContext);
  const [podCpuData, podCpuLoading, queryPodCpu, setQueryPodCpuData] = useQueryPodCpu();
  const [podMemData, podMemLoading, queryPodMem, setQueryPodMemData] = usequeryPodMem();
  const [fsData, fsLoading, queryFs, setQueryPodNetworkData] = useQueryFs();
  const [networkIOData, networkIOLoading, queryNetworkIO, setQueryPodDiskData] = useQueryNetwork();
  useEffect(() => {

    if (podIps && podIps?.length < 1) {
      setQueryPodNetworkData([])
      setQueryPodCpuData([])
      setQueryPodMemData([])
      setQueryPodDiskData([])
    }
  }, [podIps])
  useEffect(() => {

    if (appCode && envCode && startTime && hostIP && hostName) {
      const now = new Date().getTime();
      let start = 0, end = 0;
      if (selectTimeType === 'lastTime') {
        start = Number((now - startTime) / 1000);
        end = Number((now ) / 1000);
      } else {
        start = startTime;
        end = Number(endTime);
      }
      console.log(new Date(Number(start) * 1000).toLocaleString(), '-', new Date(Number(end) * 1000).toLocaleString(), '实例监控')

      getChartsDataSource({
        hostName: hostName,
        envCode: envCode,
        start: start,
        end: end,
        appCode: appCode,
        ip: hostIP,
      })
    }
  }, [envCode, appCode, hostIP, hostName, startTime, count, endTime, selectTimeType])
  useEffect(() => {
    if (isClick && isClick === appCode) {
      getDataSource({
        keyWord: appCode,
        envCode: envCode || ""
      })
    }
  }, [appCode, isClick, envCode, startTime, count, endTime, selectTimeType])
  useEffect(() => {
    if (isClick !== appCode && Object.keys(currentTableData || {})?.length > 0) {
      getNodeDataSource()
    } else if (isClick !== appCode && Object.keys(currentTableData || {})?.length < 1) {
      setNodeDataSource([])
    }
  }, [currentTableData, appCode, isClick])


  const getChartsDataSource = (params: queryItems) => {
    queryPodCpu(params)
    queryPodMem(params)
    queryFs(params)
    queryNetworkIO(params)
  }


  const getDataSource = useCallback((params: { envCode: string, keyWord?: string }) => {
    setLoading(true)
    const now = new Date().getTime();
    let start = 0, end = 0;
    if (selectTimeType === 'lastTime') {
      start = Number((now - startTime) / 1000);
      end = Number((now ) / 1000);
    } else {
      start = startTime;
      end = Number(endTime);
    }
    let data: any = []
    queryTrafficList({
      envCode: params?.envCode,
      keyWord: params?.keyWord,
      start: start + '',
      end: end + "",
      isPreciseApp:true,
    }).then((resp) => {
      queryTrafficList({
        envCode: params?.envCode,
        keyWord: params?.keyWord,
        start: start + "",
        end: end + "",
        needMetric: true,
        isPreciseApp:true,
      }).then((res) => {
        let result = res[0]
        data.push({
          resourceName: "资源配额",
          cpu: result?.svcCpuQuota,
          wss: result?.svcWssQuota,
          rss: result?.svcRssQuota,
          disk: "--"
        },
          {
            resourceName: "已使用量",
            cpu: Number(result?.svcCpuUsage).toFixed(2),
            wss: Number(result?.svcWssUsage).toFixed(2),
            rss: Number(result?.svcRssUsage).toFixed(2),
            disk: `--`
          },
          {
            resourceName: "使用百分比",
            cpu: `${result?.svcCpuRate}%`,
            wss: `${result?.svcWssRate}% `,
            rss: `${Number(result?.svcRssRate).toFixed(2)}%`,
            disk: `--`
          }
        )
        setNodeDataSource(data)
      }).finally(() => {
        setLoading(false)
      })
    })
  }, [startTime, endTime, selectTimeType])
  const getNodeDataSource = useCallback(() => {
    let data = []
    data.push({
      resourceName: "资源配额",
      cpu: currentTableData?.cpuLimit,
      wss: getDiviNumber(getMultiNumber(currentTableData?.memLimit, currentTableData?.WSS) || "", currentTableData?.WSS),
      rss: getDiviNumber(getMultiNumber(currentTableData?.memLimit, currentTableData?.RSS) || "", currentTableData?.RSS),
      disk: currentTableData?.diskLimit || "--"
    },
      {
        resourceName: "已使用量",
        cpu: parseInt(getMultiNumber(currentTableData?.cpuLimit, (Number(currentTableData?.cpu) * 0.01).toString())),
        wss: getMultiNumber(currentTableData?.memLimit, (Number(currentTableData?.WSS) * 0.01).toString()),
        rss: getMultiNumber(currentTableData?.memLimit, (Number(currentTableData?.RSS) * 0.01).toString()),
        disk: `${parseInt(currentTableData?.disk)}MB`
      },
      {
        resourceName: "使用百分比",
        cpu: `${currentTableData?.cpu}%`,
        wss: `${currentTableData?.WSS}% `,
        rss: `${currentTableData?.RSS}%`,
        disk: `${getDiviNumber(currentTableData?.disk, currentTableData?.diskLimit)}`
      }
    )
    setNodeDataSource(data)
  }, [currentTableData])
  const getDiviNumber = (first: string, second: string) => {
    if (!first || !second) {
      return "--"
    }
    let number = ""
    number = (Number(first) / Number(second)).toFixed(2)
    return number

  }
  const getMultiNumber = (first: string, second: string) => {
    if (!first || !second) {
      return "--"
    }
    let number = ""
    number = (Number(first) * Number(second)).toFixed(2)
    return number

  }
  return (
    <>
      <Card className="monitor-app-body">
        <h3 className="monitor-tabs-content-title">
          资源使用
          </h3>
        <Table rowKey="ip" bordered dataSource={nodeDataSource} scroll={{ x: '100%' }} loading={loading} columns={tableSchema as ColumnProps[]} pagination={false} />
        <h3 className="monitor-tabs-content-title">
          监控图表&nbsp;<Tooltip title={"当前实例的资源使用情况"}><QuestionCircleOutlined style={{ fontSize: 18, color: "#1E90FF" }} /></Tooltip>
        </h3>
        <Row gutter={[16, 24]}>
          <Col span={12}>
            <div className="base-monitor-charts">
              <MemroyUsage data={podMemData} loading={false} />
            </div>
          </Col>
          <Col span={12}>
            <div className="base-monitor-charts">
              <CpuUsage data={podCpuData} loading={false} />
            </div>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div className="base-monitor-charts">
              <NetWorkIOChart data={networkIOData} loading={false} />
            </div>
          </Col>
          <Col span={12}>
            <div className="base-monitor-charts">
              <FsWritesChart data={fsData} loading={false} />
            </div>
          </Col>
        </Row>
      </Card>
    </>
  )
}