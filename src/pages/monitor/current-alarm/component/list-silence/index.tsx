import React, { useEffect, useState } from 'react';
import { Modal, message, Table, Tooltip } from 'antd';
import { delSilence, getSilence } from '../../service';
import { datetimeCellRender } from '@/utils';

interface IProps {
  visible: boolean;
  onClose: () => void;
  param?: any;
}

const ListSilence = (props: IProps) => {
  const { visible, onClose, param } = props;
  const [dataList, setDataList] = useState([]);

  async function onDel(record: any) {
    const res = await delSilence({
      ...param,
      silenceId: record.id,
    });
    if (res?.success) {
      message.success('解除成功');
      void onSearch();
    }
  }

  async function onSearch() {
    const res = await getSilence({
      ...(param || {}),
    });
    setDataList(res?.data || []);
  }

  useEffect(() => {
    if (visible) {
      void onSearch();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      title="静默列表"
      width={1100}
      maskClosable={false}
      onCancel={onClose}
      onOk={onClose}
      footer={null}
    >
      <Table
        bordered
        dataSource={dataList}
        rowKey="id"
        scroll={{ x: '100%' }}
        pagination={false}
        columns={[
          {
            title: '静默原因',
            dataIndex: 'comment',
            width: 300,
            ellipsis: true,
            render: (text) => <Tooltip title={text}>{text}</Tooltip>,
          },
          {
            title: '静默创建人',
            dataIndex: 'createdBy',
            width: 120,
          },
          {
            title: '创建时间',
            dataIndex: 'startsAt',
            width: 200,
            render: (value) => <span>{datetimeCellRender(value)}</span>,
          },
          {
            title: '结束时间',
            dataIndex: 'endsAt',
            width: 200,
            render: (value) => <span>{datetimeCellRender(value)}</span>,
          },
          {
            title: '静默告警标签匹配',
            dataIndex: 'matchers',
            width: 300,
            ellipsis: true,
            render: (text) => (
              <Tooltip
                title={
                  <div>
                    {(text || []).map((item: any) => (
                      <div>{`${item.name}: ${item.value};`}</div>
                    ))}
                  </div>
                }
              >
                {(text || []).map((item: any) => `${item.name}: ${item.value}`)}
              </Tooltip>
            ),
          },
          {
            width: 120,
            title: '操作',
            fixed: 'right',
            dataIndex: 'operate',
            align: 'center',
            render: (_: any, record: any, index: number) => (
              <div className="action-cell">
                <a onClick={() => onDel(record)}>解除静默</a>
              </div>
            ),
          },
        ]}
      />
    </Modal>
  );
};

export default ListSilence;
