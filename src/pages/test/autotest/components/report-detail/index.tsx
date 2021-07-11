// report detail
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/11 14:20

import React, { useEffect, useCallback } from 'react';
import { Modal, Collapse, Table, Tree } from 'antd';
import { TaskItemVO, TaskReportItemVO } from '../../interfaces';
import { useReportTreeData, useReportDetailData } from './hooks';
import './index.less';

export interface ReportDetailProps {
  task?: TaskItemVO;
  report?: TaskReportItemVO;
  onClose?: () => any;
}

export default function ReportDetail(props: ReportDetailProps) {
  const [treeData, treeLoading] = useReportTreeData(props.report?.id!);
  // const [detailData, detailLoading] = useReportDetailData();

  return (
    <Modal
      width={1200}
      title="查看报告"
      visible={!!props.report}
      maskClosable={false}
      footer={false}
      onCancel={props.onClose}
    >
      <h3>{props.task?.name}</h3>
    </Modal>
  );
}
