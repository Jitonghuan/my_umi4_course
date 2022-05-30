import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import moment from 'moment';
import './index.less';
const displayTag = {
  serviceCode: '服务',
  serviceInstanceName: '实例',
  endpointName: '端点',
  type: '跨度类型',
  component: '组件',
  peer: 'Peer',
  isError: '错误',
} as any;
export default function DetailModal(props: any) {
  const { visible, handleCancel, detailData } = props;
  const [tagList, setTagList] = useState<any>([]);
  useEffect(() => {
    if (detailData?.tags && detailData?.tags?.length !== 0) {
      setTagList(detailData.tags);
    }
  }, [detailData]);
  const Tag = ({ label, value }: any) => (
    <div className="detail-item">
      <span style={{ color: '#a7aebb', width: '33.333%' }}>{label}</span>
      <span style={{ color: '#1c1f24', width: '66.666%' }}>{value}</span>
    </div>
  );

  const Log = ({ time, data }: any) => (
    <div>
      <div className="log-item">
        <div className="log-item-label">时间</div>
        <div className="log-item-value">{moment(time).format('YYYY-MM-DD HH:mm:ss')}</div>
      </div>
      {data.map((item: any) => (
        <div className="log-item">
          <div className="log-item-label">{item.key}</div>
          <div className="log-item-value">{item.value}</div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Modal visible={visible} onCancel={handleCancel} footer={null} width="60%">
        <div className="detail-wrapper">
          <div>
            <span className="title">标记</span>
            {Object.keys(displayTag).map((k) => {
              return k === 'endpointName' ? (
                <Tag
                  label="端点"
                  value={k in detailData ? detailData[k].toString() || '' : detailData?.oriLabel || ''}
                />
              ) : (
                <Tag label={displayTag[k] || k} value={k in detailData ? detailData[k].toString() : ''} />
              );
            })}
            {tagList.map((item: any) => (
              <Tag label={item.key} value={item.value} />
            ))}
          </div>
          {detailData.logs && detailData.logs.length !== 0 && (
            <div>
              <span className="title">日志</span>
              {detailData.logs.map((log: any) => (
                <Log {...log} />
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
