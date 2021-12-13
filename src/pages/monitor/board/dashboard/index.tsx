import React, { useEffect } from 'react';
import { Button, Modal } from 'antd';
import './index.less';

export interface minitorDashboardProps {
  ipDetailVisiable?: boolean;
  onOk?: () => any;
  onCancel?: () => any;
}
export default function DashboardsModal(props: minitorDashboardProps) {
  const { ipDetailVisiable, onOk, onCancel } = props;
  useEffect(() => {}, []);

  return (
    <Modal
      className="minitor-dashboards"
      visible={ipDetailVisiable}
      onOk={onOk}
      onCancel={onCancel}
      title="图表"
      width={'90%'}
      bodyStyle={{ height: '80%' }}
    >
      <div className="section-group">
        11111
        {/* <ABHistorgram data={histogramData} loading={loading} /> */}
        {/* <ClusterTable tableData={clusterTableData} loading={loadingTable} /> */}
      </div>
      <div className="section-group">
        2222
        {/* <ClusterAChart data={clusterAData} loading={clusterALoading} /> */}
        {/* <ClusterBChart data={clusterBData} loading={clusterBLoading} /> */}
      </div>
    </Modal>
  );
}
