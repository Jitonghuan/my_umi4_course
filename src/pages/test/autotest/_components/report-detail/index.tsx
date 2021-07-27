// report detail
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/11 14:20

import React, { useState, useEffect } from 'react';
import { Modal, Collapse, Table, Tree, Spin, Empty } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled } from '@ant-design/icons';
import moment from 'moment';
import DetailModal from '@/components/detail-modal';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
import { TaskItemVO, TaskReportItemVO, TreeNode } from '../../interfaces';
import { useReportTreeData, useReportDetailData } from './hooks';
import { formatNum, createKVList, getChartOptions } from './formatter';
import './index.less';

export interface ReportDetailProps {
  task?: TaskItemVO;
  report?: TaskReportItemVO;
  onClose?: () => any;
}

const { ColorContainer } = colorUtil.context;

export default function ReportDetail(props: ReportDetailProps) {
  const { task, report, onClose } = props;
  const [treeData, treeNodes, treeLoading] = useReportTreeData(report?.id!);
  const [selectedNode, setSelectedNode] = useState<TreeNode>();
  const [detailData, detailLoading] = useReportDetailData(report?.id, selectedNode);

  // 选择一个节点
  const handleNodeSelect = (nextKeys: React.Key[], info: any) => {
    if (!nextKeys.length) return; // 禁止反选

    const item: TreeNode = info.selectedNodes[0];
    if (item === selectedNode) return; // 防止重复点击

    console.log('>> selected', item);
    setSelectedNode(item);
  };

  useEffect(() => {
    if (!report) setSelectedNode(undefined);
  }, [report]);

  if (treeLoading) {
    return (
      <Modal
        width={1200}
        title="查看报告"
        visible={!!report}
        maskClosable={false}
        footer={false}
        onCancel={onClose}
        bodyStyle={{ backgroundColor: '#f7f8fa' }}
      >
        <h3>{task?.name}</h3>
        <div className="task-report-row report-loading">
          <Spin tip="数据加载中" />
        </div>
      </Modal>
    );
  }

  const { stat, success } = treeData;
  const { testcases, teststeps } = stat || {};

  return (
    <Modal
      width={1200}
      title="查看报告"
      visible={!!report}
      maskClosable={false}
      footer={false}
      onCancel={onClose}
      bodyStyle={{ backgroundColor: '#f7f8fa' }}
    >
      <h3>{task?.name}</h3>
      <div className="task-report-row">
        <div className="task-report-left">
          <div className="task-report-summary">
            <div className="summary-info">
              <h4>用例通过率</h4>
              <b style={{ color: success ? '#0a0' : '#f00' }}>
                {report ? `${Math.round(report.passRate! * 10000) / 100}%` : '--'}
              </b>
              <p>执行机制：{report?.triggered === 1 ? '自动' : report?.triggered === 0 ? '手动' : '--'}</p>
              <p>开始时间：{report?.startTime ? moment(report?.startTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</p>
              <p>结束时间：{report?.endTime ? moment(report?.endTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</p>
            </div>
            <div className="summary-chart">
              {report ? (
                <ColorContainer roleKeys={['color']}>
                  <EchartsReact option={getChartOptions(report)} />
                </ColorContainer>
              ) : null}
            </div>
          </div>
          <div className="task-report-tree-wrapper">
            <div className="task-report-tree-caption">
              <h4>项目列表</h4>
              <span>通过</span>
              <span>失败</span>
              <span>错误</span>
            </div>
            <div className="task-report-tree">
              {!treeNodes.length ? <Empty style={{ marginTop: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} /> : null}
              <Tree
                className="custom-tree"
                blockNode
                treeData={treeNodes}
                defaultExpandedKeys={treeNodes[0] ? [treeNodes[0].key] : []}
                selectedKeys={selectedNode ? [selectedNode.key] : []}
                onSelect={handleNodeSelect}
                showIcon={false}
                titleRender={
                  ((nodeData: TreeNode) => (
                    <div className="custom-tree-node">
                      <b>
                        {nodeData.level === 4 && nodeData.info?.success === 'success' && (
                          <CheckCircleFilled title="通过" style={{ color: 'green' }} />
                        )}
                        {nodeData.level === 4 && nodeData.info?.success === 'failure' && (
                          <CloseCircleFilled title="失败" style={{ color: 'orange' }} />
                        )}
                        {nodeData.level === 4 && nodeData.info?.success === 'error' && (
                          <ExclamationCircleFilled title="错误" style={{ color: 'red' }} />
                        )}
                        {nodeData.title}
                      </b>
                      {nodeData.level! < 4 && (
                        <span style={{ color: 'green' }}>{formatNum(nodeData.info?.successTotal)}</span>
                      )}
                      {nodeData.level! < 4 && (
                        <span style={{ color: 'orange' }}>{formatNum(nodeData.info?.failTotal)}</span>
                      )}
                      {nodeData.level! < 4 && (
                        <span style={{ color: 'red' }}>{formatNum(nodeData.info?.errorTotal)}</span>
                      )}
                    </div>
                  )) as any
                }
              />
            </div>
          </div>
        </div>
        <div className="task-report-right">
          {detailLoading ? (
            <div className="detail-loading">
              <Spin tip="数据加载中" />
            </div>
          ) : null}
          {!detailLoading && !selectedNode ? (
            <Empty style={{ marginTop: 100 }} description="请选择用例" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : null}
          {!detailLoading && selectedNode && !detailData.length ? (
            <Empty style={{ marginTop: 100 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : null}
          <Collapse defaultActiveKey={0}>
            {detailData.map((group: any, index) => (
              <Collapse.Panel key={index} header={group.name}>
                <h4>请求：</h4>
                <Table
                  pagination={false}
                  bordered
                  showHeader={false}
                  dataSource={createKVList(group.meta_datas?.data?.[0]?.request)}
                >
                  <Table.Column dataIndex="key" width={120} />
                  <Table.Column dataIndex="value" render={(value: string) => <DetailModal limit={60} data={value} />} />
                </Table>
                <h4>响应：</h4>
                <Table
                  pagination={false}
                  bordered
                  showHeader={false}
                  dataSource={createKVList(group.meta_datas?.data?.[0]?.response)}
                >
                  <Table.Column dataIndex="key" width={120} />
                  <Table.Column dataIndex="value" render={(value: string) => <DetailModal limit={60} data={value} />} />
                </Table>
                <h4>断言：</h4>
                <Table pagination={false} bordered dataSource={group.meta_datas?.validators?.validate_extractor || []}>
                  <Table.Column
                    title="check"
                    dataIndex="check"
                    render={(value: string) => <DetailModal data={value} />}
                  />
                  <Table.Column title="comparator" dataIndex="comparator" />
                  <Table.Column title="expect value" dataIndex="expect_value" />
                  <Table.Column title="check value" dataIndex="check_value" />
                  <Table.Column title="check result" dataIndex="check_result" />
                </Table>
                {group.attachment ? (
                  <>
                    <h4>附件信息：</h4>
                    <pre>{group.attachment}</pre>
                  </>
                ) : null}
              </Collapse.Panel>
            ))}
          </Collapse>
        </div>
      </div>
    </Modal>
  );
}
