// detail modal
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/11 15:58

import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import AceEditor, { AceDataType } from '../ace-editor';

export interface DetailModal {
  data: string;
  detailRender?: (data: string, dataType?: AceDataType) => React.ReactNode;
  titleRender?: (data: string) => React.ReactNode;
  limit?: number;
  dataType?: AceDataType;
}

const defaultTitleRender =
  (limit = 30) =>
  (data: string) => {
    return data?.length > limit ? `${data.substring(0, limit)}...` : data;
  };

const defaultDetailRender = (data: string, dataType?: AceDataType) => {
  return <AceEditor value={data} readOnly height={400} mode={dataType} />;
};

export default function DetailModal(props: DetailModal) {
  const { data, detailRender = defaultDetailRender, limit, dataType } = props;
  const titleRender = props.titleRender || defaultTitleRender(limit || 30);
  const [visible, setVisible] = useState(false);

  if (typeof data === 'boolean' || typeof data === 'number') return (data as any).toString();
  if (!data || data.length < 20) return data as any;

  return (
    <>
      <a onClick={() => setVisible(true)}>{titleRender(data)}</a>
      <Modal width={800} title="显示详情" visible={visible} onCancel={() => setVisible(false)} footer={false}>
        {detailRender(data, dataType)}
      </Modal>
    </>
  );
}
