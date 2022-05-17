import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import './index.less';

export default function DetailModal(props: any) {
  const { visible, handleCancel, detailData } = props;
  const list = [
    { key: 'service', label: '服务：' },
    { key: 'serviceInstanceName', label: '实例：' },
    { key: 'endpointName', label: '端点：' },
    { key: 'type', label: '跨度类型：' },
    { key: 'component', label: '组件：' },
    { key: 'peer', label: 'Peer：' },
    { key: 'isError', label: '错误：' },
    { key: 'endpointName', label: 'http.method：' },
    { key: 'service', label: 'url：' },
  ];
  return (
    <>
      <Modal visible={visible} onCancel={handleCancel} footer={null} width="60%">
        <div className="detail-wrapper">
          {list.map((item: any) => {
            return (
              <div className="detail-item">
                <span style={{ color: '#a7aebb', width: '33.333%' }}>{item.label}</span>
                <span style={{ color: '#1c1f24', width: '66.666%' }}>
                  {detailData[item.key] ? detailData[item.key] : ''}
                </span>
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
