import React, { useState, useEffect, useRef } from 'react';
import { Modal, message, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { delPipelineUrl, addPipelineUrl, updatePipelineUrl } from '@/pages/application/service';
import { getRequest, postRequest } from '@/utils/request';
import ETable from '@/components/editable-table';

export default function PipeLineManage(props: any) {
  const { visible, handleCancel, dataSource, setDatasource, appData, onSave } = props;
  const { appCode } = appData || {};
  const addBottonText = '新增流水线';
  const deleteText = '确定删除该条流水线吗？';
  const tableRef = useRef<any>();

  useEffect(() => {
    if (!visible && tableRef.current) {
      tableRef.current.reset();
    }
  }, [visible]);

  // 删除流水线
  const handleDel = (record: any) => {
    postRequest(delPipelineUrl, {
      data: { appCode, ...record },
    }).then((res) => {
      if (res?.success) {
        message.success('删除成功！');
        onSave?.();
      }
    });
  };

  const handleSave = async (rowKey: any, data: any) => {
    if (rowKey === -1) {
      // 新增
      const res = await postRequest(addPipelineUrl, { data: { appCode, ...data } });
      if (res?.success) {
        message.success('新增成功');
        onSave?.();
      }
    } else {
      // 编辑
      const res = await postRequest(updatePipelineUrl, { data: { appCode, ...data } });
      if (res?.success) {
        message.success('编辑成功');
        onSave?.();
      }
    }
  };
  // const handleChange = (next: any[]) => {
  //   setDatasource(next)
  // };
  const columns: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      editable: false,
    },
    {
      title: '流水线名称',
      dataIndex: 'pipelineName',
      key: 'pipelineName',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
      ellipsis: true,
      width: 150,
    },
    {
      title: '流水线code',
      dataIndex: 'pipelineCode',
      // 新增的时候流水线code可以写入
      editable: (text: any, record: any) => {
        return record.id === -1;
      },
      key: 'pipelineCode',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
      ellipsis: true,
      width: 150,
    },
  ];
  return (
    <Modal width={800} title="流水线管理" visible={visible} footer={false} onCancel={handleCancel}>
      {/* <Form
        layout="inline"
        form={form}
        onFinish={addPipeline}
      >
        <Form.Item label="流水线名：" name="pipelineName" rules={[{ required: true, message: '请输入流水线名' }]} >
          <Input placeholder="请输入流水线名" style={{ width: 150 }} />
        </Form.Item>
        <Form.Item label="流水线Code" name="pipelineCode" rules={[{ required: true, message: '请输入流水线code' }]}>
          <Input placeholder="请输入流水线code" style={{ width: 150 }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 16 }} icon={<PlusOutlined />}>
            新增流水线
          </Button>
        </Form.Item>
      </Form> */}
      {/* <Input
        placeholder="请输入流水线名称"
        style={{ width: '250px', marginRight: '10px' }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPressEnter={addPipeline}
      />
      <Button type="primary" icon={<PlusOutlined />} onClick={addPipeline}>
        新增流水线
      </Button> */}
      <div style={{ marginTop: '20px' }}>
        <ETable
          ref={tableRef}
          dataSource={dataSource}
          // onChange={handleChange}
          columns={columns}
          addBottonText={addBottonText}
          deleteText={deleteText}
          handleDelete={handleDel}
          handleSave={handleSave}
        ></ETable>
      </div>
    </Modal>
  );
}
