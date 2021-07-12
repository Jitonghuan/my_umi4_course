// detail modal
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/11 15:58

import React, { useState } from 'react';
import { Modal, Input } from 'antd';

export interface DetailModal {
  data: string;
  detailRender?: (data: string) => React.ReactNode;
  titleRender?: (data: string) => React.ReactNode;
}

const defaultTitleRender = (data: string) => {
  return data?.length > 30 ? `${data.substring(0, 30)}...` : data;
};

const defaultDetailRender = (data: string) => {
  return <Input.TextArea value={data} readOnly rows={20} />;
};

export default function DetailModal(props: DetailModal) {
  const { data, detailRender = defaultDetailRender, titleRender = defaultTitleRender } = props;
  const [visible, setVisible] = useState(false);

  if (!data || data.length < 20) return data as any;

  return (
    <>
      <a onClick={() => setVisible(true)}>{titleRender(data)}</a>
      <Modal width={800} title="显示详情" visible={visible} onCancel={() => setVisible(false)} footer={false}>
        {detailRender(data)}
      </Modal>
    </>
  );
}
