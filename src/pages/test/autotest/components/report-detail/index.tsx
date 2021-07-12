// report detail
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/11 14:20

import React, { useEffect, useCallback } from 'react';
import { Modal, Collapse, Table, Tree, Spin } from 'antd';
import moment from 'moment';
import { TaskItemVO, TaskReportItemVO } from '../../interfaces';
import { useReportTreeData, useReportDetailData } from './hooks';
import './index.less';

export interface ReportDetailProps {
  task?: TaskItemVO;
  report?: TaskReportItemVO;
  onClose?: () => any;
}

export default function ReportDetail(props: ReportDetailProps) {
  const { task, report, onClose } = props;
  const [treeData, treeLoading] = useReportTreeData(report?.id!);
  // const [detailData, detailLoading] = useReportDetailData();

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

  const { platform, report_tree, stat, success, time } = treeData;
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
                {stat ? `${Math.round((testcases?.success / testcases?.total) * 10000) / 100}%` : '--'}
              </b>
              <p>执行机制：{report?.triggered === 1 ? '自动' : report?.triggered === 0 ? '手动' : '--'}</p>
              <p>开始时间：{report?.startTime ? moment(report?.startTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</p>
              <p>结束时间：{report?.endTime ? moment(report?.endTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</p>
            </div>
            <div className="summary-chart"></div>
          </div>
          <div className="task-report-tree-wrapper">
            <div className="task-report-tree-caption">
              <h4>项目列表</h4>
              <span>通过</span>
              <span>失败</span>
              <span>错误</span>
            </div>
            <div className="task-report-tree"></div>
          </div>
        </div>
        <div className="task-report-right"></div>
      </div>
    </Modal>
  );
}
