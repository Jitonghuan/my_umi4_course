import React, { useState } from 'react';
import { Modal, Input, Table, Button, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { delPipelineUrl, addPipelineUrl } from '@/pages/application/service';
import { getRequest } from '@/utils/request';

export default function PipeLineManage(props: any) {
  const { visible, handleCancel, dataSource, appData, onSave } = props;
  const [value, setValue] = useState<string>('');
  // 新增流水线
  const addPipeline = () => {
    if (!value) {
      message.error('请输入流水线名称！');
    }
    getRequest(addPipelineUrl, {
      data: { appCode: appData?.appCode },
    }).then((res) => {
      if (res.success) {
        message.success('新增成功！');
        onSave?.();
      }
    });
  };
  // 删除流水线
  const handleDel = (record: any) => {
    getRequest(delPipelineUrl, {
      data: { appCode: appData?.appCode },
    }).then((res) => {
      if (res.success) {
        message.success('删除成功！');
        onSave?.();
      }
    });
  };
  const columns: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'name',
      width: 80,
    },
    {
      title: '流水线',
      dataIndex: 'pipeLine',
      key: 'pipeLine',
      ellipsis: true,
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'desc',
      key: 'desc',
      width: 80,
      render: (_: any, record: any) => (
        <Popconfirm title="确定要删除该流水线吗？" onConfirm={() => handleDel(record)}>
          <Button type="primary" danger size="small">
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];
  return (
    <Modal width={700} title="流水线管理" visible={visible} footer={false} onCancel={handleCancel}>
      <Input
        placeholder="请输入流水线名称"
        style={{ width: '250px', marginRight: '10px' }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPressEnter={addPipeline}
      />
      <Button type="primary" icon={<PlusOutlined />} onClick={addPipeline}>
        新增流水线
      </Button>
      <div style={{ marginTop: '20px' }}>
        <Table rowKey="id" bordered dataSource={dataSource} columns={columns} pagination={false}></Table>
      </div>
    </Modal>
  );
}
